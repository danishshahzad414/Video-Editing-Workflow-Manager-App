/**
 * burn_edit.js  —  Full video edit pipeline
 * Color-graded base + ASS subtitles + overlay animations
 * node burn_edit.js
 */

const { spawn } = require("child_process");
const fs   = require("fs");
const path = require("path");

const FFMPEG  = path.join(__dirname, "node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe");
const INPUT   = "D:\\Danish Shahzad\\Skilled Migration\\26 March\\Reel#11\\Broll\\Broll_graded.mp4";
const OUT_DIR = "D:\\Danish Shahzad\\Skilled Migration\\26 March\\Reel#11\\Broll";
const ASS_OUT = path.join(OUT_DIR, "subtitles.ass");
const OUTPUT  = path.join(OUT_DIR, "Broll_final.mp4");

// ── Video dimensions (4K 9:16) ────────────────────────────────────────────────
const VW = 2160, VH = 3840;

// ── Subtitle timing — Roman Urdu script ──────────────────────────────────────
// Each line: [startSec, endSec, style, text]
// Styles: Default | Highlight | Big | CTA
const LINES = [
  [0.5,  5.5,  "Default",   "Australia mein is waqt teachers ki shadeed kami hai"],
  [5.6,  11.0, "Default",   "aur aap jaise professionals ki demand\\Npehle se kahin zyada high ho chuki hai"],
  [11.2, 15.5, "Default",   "Agar aapne apni 4 years education"],
  [15.6, 19.0, "Default",   "kisi bhi top university se mukammal ki hai:"],
  [19.2, 22.8, "Highlight", "International Islamic University\\Nya University of the Punjab"],
  [22.9, 26.4, "Highlight", "University of Karachi\\Nya University of Peshawar"],
  [26.5, 30.0, "Highlight", "Abdul Wali Khan University\\NBahauddin Zakariya University"],
  [30.1, 33.5, "Highlight", "Ya phir Islamia University of Bahawalpur..."],
  [33.6, 37.5, "Big",       "to MUBARAK HO!\\NAap Australia mein Direct PR ke liye eligible hain!"],
  [37.6, 41.5, "CTA",       "The Migration apko da raha hy\\nFREE CONSULTATION"],
  [41.6, 45.3, "CTA",       "Abhi neechay form fill karein\\naur Free Consultation book karwain!"],
];

// ── ASS color helper (AABBGGRR format) ───────────────────────────────────────
const rgb = (r, g, b, a = 0) =>
  `&H${a.toString(16).padStart(2,"0").toUpperCase()}${b.toString(16).padStart(2,"0").toUpperCase()}${g.toString(16).padStart(2,"0").toUpperCase()}${r.toString(16).padStart(2,"0").toUpperCase()}`;

// ── Time formatter  H:MM:SS.cc ────────────────────────────────────────────────
const toASSTime = (s) => {
  const h  = Math.floor(s / 3600);
  const m  = Math.floor((s % 3600) / 60);
  const sc = Math.floor(s % 60);
  const cs = Math.round((s % 1) * 100);
  return `${h}:${String(m).padStart(2,"0")}:${String(sc).padStart(2,"0")}.${String(cs).padStart(2,"0")}`;
};

// ── Build ASS file ────────────────────────────────────────────────────────────
function buildASS() {
  // Colors
  const white   = rgb(255,255,255);
  const black   = rgb(0,0,0);
  const gold    = rgb(255,215,0);
  const green   = rgb(0,200,100);
  const darkBg  = rgb(10,10,10, 160); // semi-transparent dark
  const redBg   = rgb(0,0,0, 120);

  const head = `[Script Info]
ScriptType: v4.00+
PlayResX: ${VW}
PlayResY: ${VH}
ScaledBorderAndShadow: yes
WrapStyle: 0

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Default,Arial,92,${white},${white},${black},${darkBg},1,0,0,0,100,100,1,0,1,6,4,2,80,80,120,1
Style: Highlight,Arial,96,${gold},${gold},${black},${darkBg},1,0,0,0,100,100,1,0,1,6,4,2,80,80,120,1
Style: Big,Arial,128,${gold},${gold},${black},${redBg},-1,0,0,0,100,100,2,0,1,7,5,5,80,80,200,1
Style: CTA,Arial,110,${white},${white},${black},${rgb(0,100,40,80)},-1,0,0,0,100,100,1,0,3,6,4,2,80,80,140,1

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text`;

  const events = LINES.map(([s, e, style, text]) => {
    let tags = "";
    if (style === "Big") {
      // Fade in 400ms, hold, fade out 400ms + scale pop
      tags = `{\\fad(400,400)\\t(0,200,\\fscx115\\fscy115)\\t(200,400,\\fscx100\\fscy100)}`;
    } else if (style === "Highlight") {
      tags = `{\\fad(250,250)}`;
    } else if (style === "CTA") {
      tags = `{\\fad(300,300)\\bord8}`;
    } else {
      tags = `{\\fad(200,200)}`;
    }
    return `Dialogue: 0,${toASSTime(s)},${toASSTime(e)},${style},,0,0,0,,${tags}${text}`;
  });

  return head + "\n" + events.join("\n") + "\n";
}

// ── Build ffmpeg overlay drawtext filters ────────────────────────────────────
// These are EXTRA animated overlays on top of subtitles
function buildOverlayFilters() {
  const font = "C\\\\:/Windows/Fonts/arialbd.ttf";
  const filters = [];

  // 1. Top badge: "👨‍🏫 TEACHERS IN DEMAND" (0–45s)
  filters.push(`drawbox=x=0:y=${VH*0.032}:w=${VW}:h=${VH*0.052}:color=0x003322@0.85:t=fill:enable='gte(t,0.5)'`);
  filters.push(`drawtext=fontfile=${font}:text='TEACHERS IN DEMAND  |  AUSTRALIA PR':fontsize=72:fontcolor=#00FF88:x=(w-text_w)/2:y=${Math.round(VH*0.038)}:enable='gte(t,0.5)':alpha='if(lt(t-0.5,0.5),(t-0.5)/0.5,1)'`);

  // 2. "MUBARAK HO" gold flash box (33.6–37.5s)
  filters.push(`drawbox=x=${VW*0.06}:y=${VH*0.22}:w=${VW*0.88}:h=${VH*0.08}:color=0xFFAA00@0.25:t=fill:enable='between(t,33.6,37.5)'`);

  // 3. University highlight pill boxes (19.2–33.5s)
  filters.push(`drawbox=x=${VW*0.04}:y=${VH*0.72}:w=${VW*0.92}:h=${VH*0.135}:color=0x001122@0.70:t=fill:enable='between(t,19.2,33.5)'`);

  // 4. Bottom CTA strip (37.6–45.3s)
  filters.push(`drawbox=x=0:y=${VH*0.86}:w=${VW}:h=${VH*0.065}:color=0x004422@0.90:t=fill:enable='between(t,37.6,45.3)'`);
  filters.push(`drawtext=fontfile=${font}:text='The Migration  |  Free Consultation':fontsize=62:fontcolor=#FFD700:x=(w-text_w)/2:y=${Math.round(VH*0.873)}:enable='between(t,37.6,45.3)':alpha='if(lt(t-37.6,0.4),(t-37.6)/0.4,1)'`);

  // 5. "The Migration" watermark top-right (always)
  filters.push(`drawtext=fontfile=${font}:text='The Migration':fontsize=52:fontcolor=white@0.45:x=w-text_w-60:y=60:enable='gte(t,0)'`);

  return filters.join(",\n");
}

// ── Run pipeline ──────────────────────────────────────────────────────────────
async function run() {
  // Write ASS file
  const assContent = buildASS();
  fs.writeFileSync(ASS_OUT, assContent, "utf8");
  console.log(`✅ ASS subtitles written → ${ASS_OUT}`);

  const overlays = buildOverlayFilters();

  // ASS path for ffmpeg (forward slashes, escape colons)
  const assFFmpeg = ASS_OUT.replace(/\\/g, "/").replace(/:/g, "\\:");

  const vf = [
    // Overlay drawtext animations
    overlays,
    // Burn ASS subtitles on top
    `subtitles='${assFFmpeg}':force_style='Fontname=Arial'`,
  ].join(",\n");

  const args = [
    "-y",
    "-i", INPUT,
    "-vf", vf,
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "16",
    "-pix_fmt", "yuv420p",
    "-c:a", "copy",
    "-movflags", "+faststart",
    OUTPUT,
  ];

  console.log("\n🎬 Burning subtitles + animations... (takes ~5–8 min for 4K)");

  return new Promise((resolve, reject) => {
    const ff = spawn(FFMPEG, args);
    let lastLine = "";

    ff.stderr.on("data", (d) => {
      const line = d.toString();
      if (line.includes("time=") || line.includes("frame=")) {
        process.stdout.write("\r" + line.trim().slice(0, 100).padEnd(100));
        lastLine = line;
      } else if (line.toLowerCase().includes("error")) {
        console.error("\n⚠️ ffmpeg:", line.trim());
      }
    });

    ff.on("close", (code) => {
      console.log("\n");
      if (code === 0) {
        const size = (fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(1);
        console.log(`\n✅ Final video ready!`);
        console.log(`   File   : ${OUTPUT}`);
        console.log(`   Size   : ${size} MB`);
        console.log(`\n📋 Subtitles also saved as standalone: ${ASS_OUT}`);
        console.log(`   You can load this .ass file into any editor (Premiere, DaVinci) for manual tweaks.`);
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });

    ff.on("error", reject);
  });
}

run().catch(e => { console.error("❌", e.message); process.exit(1); });
