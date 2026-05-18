/**
 * Premium animated company logos video with glow effects.
 * Companies: Apple, Microsoft, NVIDIA, Amazon, Google
 * Output: premium_logos.mp4
 */

const { createCanvas } = require('canvas');
const ffmpeg = require('@ffmpeg-installer/ffmpeg');
const { spawn } = require('child_process');

// ── Settings ─────────────────────────────────────────────────────────────────
const W = 1280, H = 720;
const FPS = 30;
const DURATION = 12;
const TOTAL_FRAMES = FPS * DURATION;

// ── Company definitions ───────────────────────────────────────────────────────
const COMPANIES = [
  { name: 'Apple',     glow: '#9CB4FF' },
  { name: 'Microsoft', glow: '#50AAFF' },
  { name: 'NVIDIA',    glow: '#70FF70' },
  { name: 'Amazon',    glow: '#FFB840' },
  { name: 'Google',    glow: '#A0C4FF' },
];

const N = COMPANIES.length;
const ICON_SIZE = 130;
const LABEL_OFFSET = 100;

// horizontal positions
const LOGO_X = COMPANIES.map((_, i) => Math.round(W * (i + 0.5) / N));
const LOGO_Y = Math.round(H * 0.44);

// ── Animation helpers ─────────────────────────────────────────────────────────
/** Smooth step easing */
function easeInOut(t) {
  t = Math.max(0, Math.min(1, t));
  return t * t * (3 - 2 * t);
}

/** Per-logo animation state at frame f */
function logoState(i, f) {
  const appearFrame = 20 + i * 38;        // stagger appearance
  const fadeDuration = 35;                 // frames to scale in

  let scale = 0, alpha = 0;
  if (f >= appearFrame) {
    const progress = (f - appearFrame) / fadeDuration;
    const ease = easeInOut(progress);
    scale = ease;
    alpha = ease;
  }

  // pulse after full appearance
  const pulseT = f / FPS;
  const pulse = 0.5 + 0.5 * Math.sin(pulseT * 2.2 + i * 1.1);   // 0–1
  // float
  const floatY = Math.sin(pulseT * 1.4 + i * 0.9) * 8;

  return { scale: Math.min(scale, 1), alpha: Math.min(alpha, 1), pulse, floatY };
}

// ── Logo drawing functions ────────────────────────────────────────────────────

function setGlow(ctx, color, intensity) {
  ctx.shadowColor = color;
  ctx.shadowBlur = 25 + 45 * intensity;
}

function clearGlow(ctx) {
  ctx.shadowBlur = 0;
}

/** Draw glow ring behind logo for extra depth */
function drawGlowRing(ctx, cx, cy, r, color, intensity) {
  const oldAlpha = ctx.globalAlpha;
  ctx.save();
  ctx.globalAlpha = oldAlpha * 0.18 * intensity;
  const grad = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 2.5);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawApple(ctx, cx, cy, size, alpha, pulse) {
  const r = size * 0.40;
  const c = '#D0D0DC';
  const glow = '#9CB4FF';

  // Glow ring
  ctx.save();
  ctx.globalAlpha = alpha;
  drawGlowRing(ctx, cx, cy, r, glow, pulse);

  // Offscreen canvas to handle the "bite" cutout
  const oc = createCanvas(size * 2.4, size * 2.4);
  const o = oc.getContext('2d');
  const ocx = oc.width / 2, ocy = oc.height / 2 + 5;

  // Body
  o.fillStyle = c;
  o.beginPath();
  o.ellipse(ocx, ocy + r * 0.05, r, r * 0.92, 0, 0, Math.PI * 2);
  o.fill();

  // Bite (erase top-right area)
  o.globalCompositeOperation = 'destination-out';
  o.beginPath();
  o.ellipse(ocx + r * 0.38, ocy - r * 0.45, r * 0.50, r * 0.50, 0, 0, Math.PI * 2);
  o.fill();
  o.globalCompositeOperation = 'source-over';

  // Stem
  o.fillStyle = c;
  o.fillRect(ocx + r * 0.08, ocy - r - 16, r * 0.18, 18);

  // Leaf (quadratic bezier)
  o.beginPath();
  o.moveTo(ocx + r * 0.08, ocy - r - 2);
  o.quadraticCurveTo(ocx + r * 0.75, ocy - r - 22, ocx + r * 0.70, ocy - r + 6);
  o.quadraticCurveTo(ocx + r * 0.30, ocy - r + 2, ocx + r * 0.08, ocy - r - 2);
  o.fill();

  // Paint offscreen to main canvas with glow
  setGlow(ctx, glow, pulse);
  ctx.drawImage(oc, cx - oc.width / 2, cy - oc.height / 2 - 5);
  // Extra passes for stronger glow
  ctx.globalAlpha = alpha * 0.5;
  ctx.drawImage(oc, cx - oc.width / 2, cy - oc.height / 2 - 5);
  ctx.globalAlpha = alpha * 0.25;
  ctx.drawImage(oc, cx - oc.width / 2, cy - oc.height / 2 - 5);
  clearGlow(ctx);
  ctx.restore();
}

function drawMicrosoft(ctx, cx, cy, size, alpha, pulse) {
  const sq = size * 0.34;
  const gap = size * 0.045;
  const colors = ['#F25022', '#7FBA00', '#00A4EF', '#FFB900'];
  const glow = '#50AAFF';
  const positions = [
    [cx - sq - gap, cy - sq - gap],
    [cx + gap,      cy - sq - gap],
    [cx - sq - gap, cy + gap],
    [cx + gap,      cy + gap],
  ];

  ctx.save();
  ctx.globalAlpha = alpha;
  drawGlowRing(ctx, cx, cy, sq * 1.2, glow, pulse);

  for (let i = 0; i < 4; i++) {
    ctx.shadowColor = colors[i];
    ctx.shadowBlur = 20 + 35 * pulse;
    ctx.fillStyle = colors[i];
    ctx.fillRect(positions[i][0], positions[i][1], sq, sq);
  }
  clearGlow(ctx);
  ctx.restore();
}

function drawNvidia(ctx, cx, cy, size, alpha, pulse) {
  const r = size * 0.42;
  const glow = '#70FF70';

  ctx.save();
  ctx.globalAlpha = alpha;
  drawGlowRing(ctx, cx, cy, r, glow, pulse);
  setGlow(ctx, glow, pulse);

  // Shield body
  ctx.fillStyle = '#76B900';
  ctx.beginPath();
  ctx.moveTo(cx, cy - r);
  ctx.lineTo(cx + r * 0.95, cy - r * 0.48);
  ctx.lineTo(cx + r * 0.95, cy + r * 0.28);
  ctx.lineTo(cx, cy + r);
  ctx.lineTo(cx - r * 0.95, cy + r * 0.28);
  ctx.lineTo(cx - r * 0.95, cy - r * 0.48);
  ctx.closePath();
  ctx.fill();

  clearGlow(ctx);

  // Inner eye highlight
  ctx.fillStyle = '#050F05';
  ctx.beginPath();
  ctx.ellipse(cx, cy, r * 0.38, r * 0.22, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupil glow dot
  setGlow(ctx, glow, pulse * 1.5);
  ctx.fillStyle = '#76B900';
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.10, 0, Math.PI * 2);
  ctx.fill();
  clearGlow(ctx);

  ctx.restore();
}

function drawAmazon(ctx, cx, cy, size, alpha, pulse) {
  const r = size * 0.40;
  const glow = '#FFB840';

  ctx.save();
  ctx.globalAlpha = alpha;
  drawGlowRing(ctx, cx, cy, r, glow, pulse);
  setGlow(ctx, glow, pulse);

  const lw = r * 0.21;
  ctx.strokeStyle = '#FF9900';
  ctx.fillStyle = '#FF9900';
  ctx.lineCap = 'round';

  // 'a' circle
  ctx.lineWidth = lw;
  ctx.beginPath();
  const ar = r * 0.58;
  ctx.arc(cx - ar * 0.05, cy - ar * 0.08, ar, 0.38, Math.PI * 2 - 0.05);
  ctx.stroke();

  // Right stem
  const stemX = cx - ar * 0.05 + ar * Math.cos(0.38);
  ctx.fillRect(stemX - lw * 0.5, cy - ar - ar * 0.1, lw, ar * 1.28);

  clearGlow(ctx);
  setGlow(ctx, glow, pulse);

  // Smile / arrow arc
  ctx.lineWidth = lw * 0.8;
  ctx.beginPath();
  ctx.arc(cx, cy + r * 0.30, r * 0.58, 0.25, Math.PI - 0.25);
  ctx.stroke();

  // Arrowhead at right end of smile
  const aAngle = Math.PI - 0.25;
  const ax = cx + r * 0.58 * Math.cos(aAngle);
  const ay = cy + r * 0.30 + r * 0.58 * Math.sin(aAngle);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(ax - 6, ay - 10);
  ctx.lineTo(ax + 9, ay + 3);
  ctx.lineTo(ax - 7, ay + 8);
  ctx.closePath();
  ctx.fill();

  clearGlow(ctx);
  ctx.restore();
}

function drawGoogle(ctx, cx, cy, size, alpha, pulse) {
  const r = size * 0.42;
  const stroke = r * 0.30;
  const glow = '#A0C4FF';

  const segments = [
    { color: '#4285F4', start: -Math.PI * 0.62, end: Math.PI * 0.58 },  // Blue
    { color: '#EA4335', start: Math.PI * 0.58,  end: Math.PI * 1.02 },  // Red
    { color: '#FBBC05', start: Math.PI * 1.02,  end: Math.PI * 1.52 },  // Yellow
    { color: '#34A853', start: Math.PI * 1.52,  end: Math.PI * 1.88 },  // Green
  ];

  ctx.save();
  ctx.globalAlpha = alpha;
  drawGlowRing(ctx, cx, cy, r, glow, pulse);

  ctx.lineWidth = stroke;
  ctx.lineCap = 'round';

  for (const seg of segments) {
    ctx.shadowColor = seg.color;
    ctx.shadowBlur = 18 + 32 * pulse;
    ctx.strokeStyle = seg.color;
    ctx.beginPath();
    ctx.arc(cx, cy, r - stroke / 2, seg.start, seg.end);
    ctx.stroke();
  }

  // Crossbar (blue)
  ctx.shadowColor = '#4285F4';
  ctx.shadowBlur = 18 + 32 * pulse;
  ctx.strokeStyle = '#4285F4';
  ctx.lineWidth = stroke;
  ctx.lineCap = 'butt';
  ctx.beginPath();
  ctx.moveTo(cx, cy - stroke * 0.1);
  ctx.lineTo(cx + r, cy - stroke * 0.1);
  ctx.stroke();

  clearGlow(ctx);
  ctx.restore();
}

const DRAW_FNS = [drawApple, drawMicrosoft, drawNvidia, drawAmazon, drawGoogle];

// ── Background ────────────────────────────────────────────────────────────────
function drawBackground(ctx, f) {
  // Deep dark gradient
  const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.7);
  grad.addColorStop(0, '#0C0C24');
  grad.addColorStop(1, '#04040E');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Subtle grid lines
  ctx.save();
  ctx.strokeStyle = 'rgba(80,80,160,0.07)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 80) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 80) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }
  ctx.restore();
}

// ── Label ─────────────────────────────────────────────────────────────────────
function drawLabel(ctx, name, cx, cy, alpha, glow) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.shadowColor = glow;
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#C8D0E8';
  ctx.font = `bold ${Math.round(W * 0.018)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(name.toUpperCase(), cx, cy);
  ctx.restore();
}

// ── Render frame ──────────────────────────────────────────────────────────────
function renderFrame(f) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  drawBackground(ctx, f);

  // Fade-in overlay at very start
  if (f < 20) {
    ctx.fillStyle = `rgba(0,0,0,${1 - f / 20})`;
    ctx.fillRect(0, 0, W, H);
  }

  for (let i = 0; i < N; i++) {
    const { scale, alpha, pulse, floatY } = logoState(i, f);
    if (alpha <= 0) continue;

    const cx = LOGO_X[i];
    const cy = LOGO_Y + floatY;
    const s = ICON_SIZE * scale;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);

    ctx.globalAlpha = alpha;
    DRAW_FNS[i](ctx, cx, cy, s, 1, pulse);

    ctx.restore();

    // Company name label
    drawLabel(ctx, COMPANIES[i].name, cx, LOGO_Y + LABEL_OFFSET, alpha, COMPANIES[i].glow);
  }

  // Subtle vignette
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, W * 0.8);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(0,0,0,0.55)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  return canvas.toBuffer('raw');
}

// ── Video encoding ────────────────────────────────────────────────────────────
async function encode() {
  const outPath = 'premium_logos.mp4';
  console.log(`Rendering ${TOTAL_FRAMES} frames at ${W}x${H} @ ${FPS}fps…`);

  return new Promise((resolve, reject) => {
    const ff = spawn(ffmpeg.path, [
      '-f', 'rawvideo',
      '-pixel_format', 'bgra',
      '-video_size', `${W}x${H}`,
      '-framerate', String(FPS),
      '-i', 'pipe:0',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-preset', 'medium',
      '-crf', '18',
      '-movflags', '+faststart',
      '-y', outPath,
    ]);

    ff.stderr.on('data', d => process.stdout.write('.'));
    ff.on('close', code => {
      console.log(`\nDone! → ${outPath}`);
      code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}`));
    });

    (async () => {
      for (let f = 0; f < TOTAL_FRAMES; f++) {
        if (f % 30 === 0) process.stdout.write(`\rFrame ${f}/${TOTAL_FRAMES} `);
        const buf = renderFrame(f);
        const ok = ff.stdin.write(buf);
        if (!ok) await new Promise(r => ff.stdin.once('drain', r));
      }
      ff.stdin.end();
    })();
  });
}

encode().catch(err => { console.error(err); process.exit(1); });
