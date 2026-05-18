/**
 * video_edit.js
 * Full video editor: color grade + subtitle animations + music + SFX
 * Run: node video_edit.js
 *
 * Fill in SUBTITLE_LINES and MUSIC_PATH before running.
 */

const { spawn } = require("child_process");
const path  = require("path");
const fs    = require("fs");

// ── Paths ──────────────────────────────────────────────────────────────────────
const FFMPEG  = path.join(__dirname, "node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe");
const INPUT   = "D:\\Danish Shahzad\\Skilled Migration\\26 March\\Reel#11\\Broll\\Broll.mp4";
const OUT_DIR = "D:\\Danish Shahzad\\Skilled Migration\\26 March\\Reel#11\\Broll";
const OUTPUT  = path.join(OUT_DIR, "Broll_edited.mp4");

// ── Subtitles — fill in your Roman Urdu lines ─────────────────────────────────
// Format: { start: seconds, end: seconds, text: "Roman Urdu text" }
const SUBTITLE_LINES = [
  // EXAMPLE — replace with actual transcript:
  // { start: 0.5,  end: 4.0,  text: "Aaj hum baat karenge" },
  // { start: 4.2,  end: 8.5,  text: "Australia ke PR visa ke baare mein" },
];

// ── Music — set path if available ─────────────────────────────────────────────
const MUSIC_PATH = ""; // e.g. "D:\\Music\\background.mp3"
const MUSIC_VOL  = 0.12; // 12% volume

// ── Color Grade settings ───────────────────────────────────────────────────────
const GRADE = {
  // Cinematic warmth
  temperature: 0.04,    // positive = warmer, negative = cooler
  contrast:    1.12,    // 1.0 = no change
  brightness:  0.02,    // slight lift
  saturation:  0.88,    // slightly desaturated (cinematic)
  gamma:       0.95,    // slight gamma correction
  shadows:     0.06,    // lift shadows (milky blacks)
  vignette:    true,
};

// =============================================================================
// BUILD FFMPEG FILTER CHAIN
// =============================================================================
function buildFilters(hasSubtitles, hasSfx) {
  const W = 2160, H = 3840;
  const filters = [];
  const inputs = ["[0:v]"];

  // ── 1. Color grade ──────────────────────────────────────────────────────────
  // eq filter: contrast, brightness, saturation, gamma
  const eq = [
    `contrast=${GRADE.contrast}`,
    `brightness=${GRADE.brightness}`,
    `saturation=${GRADE.saturation}`,
    `gamma=${GRADE.gamma}`,
  ].join(":");

  // curves: warm shadows (lift R, lower B in shadows)
  const curvesR = `0/0 0.1/${(0.1 + GRADE.shadows).toFixed(3)} 0.5/0.52 1/1`;
  const curvesG = `0/0 0.1/${(0.1 + GRADE.shadows * 0.6).toFixed(3)} 0.5/0.51 1/1`;
  const curvesB = `0/0 0.1/${(0.1 + GRADE.shadows * 0.3).toFixed(3)} 0.5/0.49 1/${(1 - GRADE.temperature * 0.5).toFixed(3)}`;

  filters.push(`[0:v]eq=${eq}[graded]`);
  filters.push(`[graded]curves=r='${curvesR}':g='${curvesG}':b='${curvesB}'[curved]`);

  // ── 2. Vignette ─────────────────────────────────────────────────────────────
  if (GRADE.vignette) {
    filters.push(`[curved]vignette=PI/4.2:eval=init[vignetted]`);
  } else {
    filters.push(`[curved]copy[vignetted]`);
  }

  let lastV = "[vignetted]";

  // ── 3. Subtitle overlays ────────────────────────────────────────────────────
  if (hasSubtitles && SUBTITLE_LINES.length > 0) {
    SUBTITLE_LINES.forEach((line, i) => {
      const label = `[sub${i}]`;
      const safe  = line.text.replace(/'/g, "\\'").replace(/:/g, "\\:");
      const dur   = line.end - line.start;

      // Subtitle box: bottom 1/4 of screen, centred
      // Uses drawtext with a fade-in/out opacity effect via alpha
      const drawtext = [
        `fontfile=C\\:/Windows/Fonts/arialbd.ttf`,
        `text='${safe}'`,
        `fontsize=72`,
        `fontcolor=white`,
        `borderw=4`,
        `bordercolor=black`,
        `shadowcolor=black@0.7`,
        `shadowx=3`,
        `shadowy=3`,
        `x=(w-text_w)/2`,
        `y=h*0.80`,
        `enable='between(t,${line.start},${line.end})'`,
        // Fade in over 0.25s, hold, fade out over 0.25s
        `alpha='if(lt(t-${line.start},0.25),(t-${line.start})/0.25,if(gt(t,${line.end}-0.25),(${line.end}-t)/0.25,1))'`,
      ].join(":");

      filters.push(`${lastV}drawtext=${drawtext}${label}`);
      lastV = label;
    });
  }

  // ── 4. Animated lower-third title (always on, 0s–3.5s) ─────────────────────
  const titleText = "Skilled Migration Australia";
  const titleSafe = titleText.replace(/'/g, "\\'");
  // Gold bar + white text lower third
  filters.push(
    `${lastV}drawbox=x=0:y=h*0.88:w=w:h=h*0.07:color=0x1a1a1a@0.75:t=fill:enable='between(t,0.5,4.5)'[boxed]`
  );
  filters.push(
    `[boxed]drawtext=fontfile=C\\:/Windows/Fonts/arialbd.ttf:text='${titleSafe}':fontsize=58:fontcolor=#FFD700:x=(w-text_w)/2:y=h*0.895:enable='between(t,0.5,4.5)':alpha='if(lt(t-0.5,0.4),(t-0.5)/0.4,if(gt(t,4.1),(4.5-t)/0.4,1))'[titled]`
  );
  lastV = "[titled]";

  // ── 5. Animated "PR VISA" badge stamp (appears at 2s) ──────────────────────
  filters.push(
    `${lastV}drawbox=x=w*0.04:y=h*0.06:w=w*0.55:h=h*0.045:color=0x003311@0.82:t=fill:enable='between(t,2,45)'[badge_bg]`
  );
  filters.push(
    `[badge_bg]drawtext=fontfile=C\\:/Windows/Fonts/arialbd.ttf:text='🇦🇺  AUSTRALIA PR':fontsize=52:fontcolor=#00FF88:x=w*0.06:y=h*0.068:enable='between(t,2,45)':alpha='if(lt(t-2,0.5),(t-2)/0.5,1)'[badged]`
  );
  lastV = "[badged]";

  return { filters, lastV };
}

// =============================================================================
// WRITE SRT SUBTITLE FILE (for reference/softsub track)
// =============================================================================
function writeSRT() {
  if (SUBTITLE_LINES.length === 0) return null;
  const srtPath = path.join(OUT_DIR, "subtitles.srt");
  const toSRTTime = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, "0");
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, "0");
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    const ms = Math.round((s % 1) * 1000).toString().padStart(3, "0");
    return `${h}:${m}:${sec},${ms}`;
  };
  const content = SUBTITLE_LINES.map((l, i) =>
    `${i + 1}\n${toSRTTime(l.start)} --> ${toSRTTime(l.end)}\n${l.text}\n`
  ).join("\n");
  fs.writeFileSync(srtPath, content, "utf8");
  console.log(`✅ SRT written: ${srtPath}`);
  return srtPath;
}

// =============================================================================
// RUN FFMPEG
// =============================================================================
async function run() {
  const hasSubtitles = SUBTITLE_LINES.length > 0;
  const hasMusic     = MUSIC_PATH && fs.existsSync(MUSIC_PATH);

  console.log("📽  Video editor starting...");
  console.log(`   Input   : ${INPUT}`);
  console.log(`   Output  : ${OUTPUT}`);
  console.log(`   Subs    : ${hasSubtitles ? SUBTITLE_LINES.length + " lines" : "⚠️  none — add SUBTITLE_LINES"}`);
  console.log(`   Music   : ${hasMusic ? MUSIC_PATH : "⚠️  none — add MUSIC_PATH"}`);
  console.log("");

  writeSRT();

  const { filters, lastV } = buildFilters(hasSubtitles, false);
  const filterStr = filters.join("; ");

  // Build ffmpeg args
  const args = ["-y"];

  // Input 1: video
  args.push("-i", INPUT);

  // Input 2: music (if available)
  if (hasMusic) {
    args.push("-stream_loop", "-1", "-i", MUSIC_PATH);
  }

  // Video filter chain
  args.push("-filter_complex", filterStr);

  // Map video output
  args.push("-map", lastV);

  // Audio: mix original + music, or just pass original
  if (hasMusic) {
    args.push(
      "-filter_complex",
      `[0:a]volume=1.0[orig];[1:a]volume=${MUSIC_VOL}[music];[orig][music]amix=inputs=2:duration=first[audio]`,
      "-map", "[audio]"
    );
  } else {
    args.push("-map", "0:a");
  }

  // Codec settings
  args.push(
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "16",
    "-pix_fmt", "yuv420p",
    "-c:a", "aac",
    "-b:a", "192k",
    "-movflags", "+faststart",
    OUTPUT
  );

  console.log("🎬 Processing... (4K takes a few minutes)\n");

  return new Promise((resolve, reject) => {
    const ff = spawn(FFMPEG, args);

    ff.stderr.on("data", (d) => {
      const line = d.toString();
      // Show only progress lines
      if (line.includes("time=") || line.includes("frame=")) {
        process.stdout.write("\r" + line.trim().substring(0, 80));
      }
    });

    ff.on("close", (code) => {
      console.log("\n");
      if (code === 0) {
        const size = (fs.statSync(OUTPUT).size / 1024 / 1024).toFixed(1);
        console.log(`✅ Done! Output: ${OUTPUT} (${size} MB)`);
        console.log("\n📋 Next steps:");
        if (!hasSubtitles) {
          console.log("   1. Add your Roman Urdu script to SUBTITLE_LINES in video_edit.js");
          console.log("      then re-run: node video_edit.js");
        }
        if (!hasMusic) {
          console.log("   2. Add your music file path to MUSIC_PATH and re-run");
        }
        resolve();
      } else {
        reject(new Error(`ffmpeg exited with code ${code}`));
      }
    });

    ff.on("error", reject);
  });
}

run().catch((e) => { console.error("❌", e.message); process.exit(1); });
