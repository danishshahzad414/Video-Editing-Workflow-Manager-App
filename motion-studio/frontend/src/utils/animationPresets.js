/**
 * Animation Presets — auto-generate keyframes from a named style.
 * This is the core of the "Motion" panel: pick a style, timing, and it
 * writes all the keyframes for you instead of manually editing them.
 */

export const ENTRANCE_STYLES = [
  { id: 'none',        name: 'None',        icon: '—',  desc: 'No entrance animation' },
  { id: 'fade-in',     name: 'Fade In',     icon: '◎',  desc: 'Smoothly fades from invisible' },
  { id: 'slide-left',  name: 'Slide Left',  icon: '←',  desc: 'Slides in from the right' },
  { id: 'slide-right', name: 'Slide Right', icon: '→',  desc: 'Slides in from the left' },
  { id: 'slide-up',    name: 'Slide Up',    icon: '↑',  desc: 'Rises up into position' },
  { id: 'slide-down',  name: 'Slide Down',  icon: '↓',  desc: 'Drops down into position' },
  { id: 'scale-in',    name: 'Scale In',    icon: '⊕',  desc: 'Grows from zero to full size' },
  { id: 'bounce-in',   name: 'Bounce In',   icon: '⤷',  desc: 'Scales in with a satisfying bounce' },
  { id: 'rotate-in',   name: 'Rotate In',   icon: '↻',  desc: 'Spins into position' },
  { id: 'flip-in',     name: 'Flip In',     icon: '⟳',  desc: 'Flips in on the Y axis' },
  { id: 'glitch',      name: 'Glitch',      icon: '⚡',  desc: 'RGB-split glitch entrance' },
  { id: 'blur-in',     name: 'Blur In',     icon: '◉',  desc: 'Snaps into focus' },
  { id: 'wipe-right',  name: 'Wipe Right',  icon: '▶',  desc: 'Wipes in from the left edge' },
  { id: 'spring',      name: 'Spring',      icon: '〜',  desc: 'Elastic spring overshoot' },
];

export const EXIT_STYLES = [
  { id: 'none',         name: 'None',         icon: '—' },
  { id: 'fade-out',     name: 'Fade Out',     icon: '◎' },
  { id: 'slide-left',   name: 'Slide Left',   icon: '←' },
  { id: 'slide-right',  name: 'Slide Right',  icon: '→' },
  { id: 'slide-up',     name: 'Slide Up',     icon: '↑' },
  { id: 'scale-out',    name: 'Scale Out',    icon: '⊖' },
  { id: 'rotate-out',   name: 'Rotate Out',   icon: '↻' },
];

export const EASING_OPTIONS = [
  { id: 'ease',         name: 'Smooth' },
  { id: 'ease-out',     name: 'Ease Out' },
  { id: 'ease-in',      name: 'Ease In' },
  { id: 'ease-in-out',  name: 'Ease In Out' },
  { id: 'linear',       name: 'Linear' },
  { id: 'bounce',       name: 'Bounce' },
  { id: 'spring',       name: 'Spring' },
];

/**
 * Apply an entrance animation to a layer's keyframes.
 * @param {object} layer - the full layer object
 * @param {string} style - entrance style id
 * @param {object} opts  - { startTime, duration, easing, offsetAmount }
 * @returns {object} new keyframes object (merged with existing non-motion ones)
 */
export function applyEntranceAnimation(layer, style, opts = {}) {
  const {
    startTime   = 0,
    duration    = 0.6,
    easing      = 'ease-out',
    offsetAmount = 120,
  } = opts;

  const p   = layer.properties;
  const end = startTime + duration;

  // Strip old entrance keyframes (opacity, x, y, scaleX, scaleY, rotation)
  const kf = stripEntranceKeys(layer.keyframes || {});

  if (style === 'none') return kf;

  switch (style) {
    case 'fade-in':
      kf.opacity = mergeKF(kf.opacity, [
        { time: startTime, value: 0,              easing },
        { time: end,       value: p.opacity ?? 1, easing: 'linear' },
      ]);
      break;

    case 'slide-left':
      kf.opacity = mergeKF(kf.opacity, fadeKF(startTime, end, p.opacity ?? 1, easing));
      kf.x = mergeKF(kf.x, [
        { time: startTime, value: (p.x ?? 0) + offsetAmount, easing },
        { time: end,       value: p.x ?? 0,                  easing: 'linear' },
      ]);
      break;

    case 'slide-right':
      kf.opacity = mergeKF(kf.opacity, fadeKF(startTime, end, p.opacity ?? 1, easing));
      kf.x = mergeKF(kf.x, [
        { time: startTime, value: (p.x ?? 0) - offsetAmount, easing },
        { time: end,       value: p.x ?? 0,                  easing: 'linear' },
      ]);
      break;

    case 'slide-up':
      kf.opacity = mergeKF(kf.opacity, fadeKF(startTime, end, p.opacity ?? 1, easing));
      kf.y = mergeKF(kf.y, [
        { time: startTime, value: (p.y ?? 0) + offsetAmount, easing },
        { time: end,       value: p.y ?? 0,                  easing: 'linear' },
      ]);
      break;

    case 'slide-down':
      kf.opacity = mergeKF(kf.opacity, fadeKF(startTime, end, p.opacity ?? 1, easing));
      kf.y = mergeKF(kf.y, [
        { time: startTime, value: (p.y ?? 0) - offsetAmount, easing },
        { time: end,       value: p.y ?? 0,                  easing: 'linear' },
      ]);
      break;

    case 'scale-in':
      kf.opacity = mergeKF(kf.opacity, fadeKF(startTime, end, p.opacity ?? 1, easing));
      kf.scaleX  = mergeKF(kf.scaleX, [
        { time: startTime, value: 0,                  easing },
        { time: end,       value: p.scaleX ?? 1,      easing: 'linear' },
      ]);
      kf.scaleY  = mergeKF(kf.scaleY, [
        { time: startTime, value: 0,                  easing },
        { time: end,       value: p.scaleY ?? 1,      easing: 'linear' },
      ]);
      break;

    case 'bounce-in':
      kf.scaleX = mergeKF(kf.scaleX, [
        { time: startTime,              value: 0,              easing: 'ease-out' },
        { time: end - duration * 0.2,   value: 1.2,            easing: 'ease-out' },
        { time: end,                    value: p.scaleX ?? 1,  easing: 'bounce'   },
      ]);
      kf.scaleY = mergeKF(kf.scaleY, [
        { time: startTime,              value: 0,              easing: 'ease-out' },
        { time: end - duration * 0.2,   value: 1.2,            easing: 'ease-out' },
        { time: end,                    value: p.scaleY ?? 1,  easing: 'bounce'   },
      ]);
      kf.opacity = mergeKF(kf.opacity, fadeKF(startTime, startTime + duration * 0.2, p.opacity ?? 1, 'ease-out'));
      break;

    case 'spring':
      kf.scaleX = mergeKF(kf.scaleX, [
        { time: startTime,            value: 0,             easing: 'ease-out' },
        { time: end,                  value: p.scaleX ?? 1, easing: 'spring'   },
      ]);
      kf.scaleY = mergeKF(kf.scaleY, [
        { time: startTime,            value: 0,             easing: 'ease-out' },
        { time: end,                  value: p.scaleY ?? 1, easing: 'spring'   },
      ]);
      kf.opacity = mergeKF(kf.opacity, fadeKF(startTime, end, p.opacity ?? 1, 'ease-out'));
      break;

    case 'rotate-in':
      kf.opacity  = mergeKF(kf.opacity, fadeKF(startTime, end, p.opacity ?? 1, easing));
      kf.rotation = mergeKF(kf.rotation, [
        { time: startTime, value: (p.rotation ?? 0) - 90, easing },
        { time: end,       value: p.rotation ?? 0,        easing: 'linear' },
      ]);
      kf.scaleX = mergeKF(kf.scaleX, [
        { time: startTime, value: 0.4,           easing },
        { time: end,       value: p.scaleX ?? 1, easing: 'linear' },
      ]);
      kf.scaleY = mergeKF(kf.scaleY, [
        { time: startTime, value: 0.4,           easing },
        { time: end,       value: p.scaleY ?? 1, easing: 'linear' },
      ]);
      break;

    case 'flip-in':
      kf.opacity = mergeKF(kf.opacity, fadeKF(startTime, end, p.opacity ?? 1, easing));
      kf.scaleX  = mergeKF(kf.scaleX, [
        { time: startTime,           value: 0,             easing },
        { time: end - duration*0.1,  value: 1.06,          easing },
        { time: end,                 value: p.scaleX ?? 1, easing: 'linear' },
      ]);
      break;

    case 'glitch': {
      const glitchEnd = startTime + Math.min(duration, 0.5);
      kf.opacity = mergeKF(kf.opacity, [
        { time: startTime,          value: 0,              easing: 'linear' },
        { time: startTime + 0.05,   value: 1,              easing: 'linear' },
        { time: startTime + 0.1,    value: 0.3,            easing: 'linear' },
        { time: startTime + 0.15,   value: 1,              easing: 'linear' },
        { time: startTime + 0.25,   value: 0.7,            easing: 'linear' },
        { time: glitchEnd,          value: p.opacity ?? 1, easing: 'linear' },
      ]);
      kf.x = mergeKF(kf.x, [
        { time: startTime,          value: (p.x ?? 0) + 8, easing: 'linear' },
        { time: startTime + 0.05,   value: (p.x ?? 0) - 6, easing: 'linear' },
        { time: startTime + 0.1,    value: (p.x ?? 0) + 4, easing: 'linear' },
        { time: startTime + 0.15,   value: (p.x ?? 0) - 2, easing: 'linear' },
        { time: glitchEnd,          value: p.x ?? 0,        easing: 'linear' },
      ]);
      break;
    }

    case 'blur-in':
      // Blur is simulated via scale slightly > 1 → 1 + opacity
      kf.opacity = mergeKF(kf.opacity, fadeKF(startTime, end, p.opacity ?? 1, easing));
      kf.scaleX  = mergeKF(kf.scaleX, [
        { time: startTime, value: 1.08,          easing },
        { time: end,       value: p.scaleX ?? 1, easing: 'linear' },
      ]);
      kf.scaleY  = mergeKF(kf.scaleY, [
        { time: startTime, value: 1.08,          easing },
        { time: end,       value: p.scaleY ?? 1, easing: 'linear' },
      ]);
      break;

    case 'wipe-right':
      kf.scaleX = mergeKF(kf.scaleX, [
        { time: startTime, value: 0,             easing },
        { time: end,       value: p.scaleX ?? 1, easing: 'linear' },
      ]);
      kf.x = mergeKF(kf.x, [
        { time: startTime, value: (p.x ?? 0) - (p.width ?? 200) / 2, easing },
        { time: end,       value: p.x ?? 0,                           easing: 'linear' },
      ]);
      break;

    default:
      break;
  }

  return kf;
}

/**
 * Apply an exit animation to a layer's keyframes.
 */
export function applyExitAnimation(layer, style, opts = {}) {
  const {
    startTime    = 2,
    duration     = 0.5,
    easing       = 'ease-in',
    offsetAmount = 120,
  } = opts;

  const p   = layer.properties;
  const end = startTime + duration;
  const kf  = stripExitKeys(layer.keyframes || {}, startTime);

  if (style === 'none') return kf;

  switch (style) {
    case 'fade-out':
      kf.opacity = mergeKF(kf.opacity, [
        { time: startTime, value: p.opacity ?? 1, easing: 'linear' },
        { time: end,       value: 0,              easing },
      ]);
      break;
    case 'slide-left':
      kf.opacity = mergeKF(kf.opacity, [{ time: end, value: 0, easing }]);
      kf.x       = mergeKF(kf.x, [
        { time: startTime, value: p.x ?? 0,                  easing: 'linear' },
        { time: end,       value: (p.x ?? 0) - offsetAmount, easing },
      ]);
      break;
    case 'slide-right':
      kf.opacity = mergeKF(kf.opacity, [{ time: end, value: 0, easing }]);
      kf.x       = mergeKF(kf.x, [
        { time: startTime, value: p.x ?? 0,                  easing: 'linear' },
        { time: end,       value: (p.x ?? 0) + offsetAmount, easing },
      ]);
      break;
    case 'slide-up':
      kf.opacity = mergeKF(kf.opacity, [{ time: end, value: 0, easing }]);
      kf.y       = mergeKF(kf.y, [
        { time: startTime, value: p.y ?? 0,                  easing: 'linear' },
        { time: end,       value: (p.y ?? 0) - offsetAmount, easing },
      ]);
      break;
    case 'scale-out':
      kf.opacity = mergeKF(kf.opacity, [
        { time: startTime, value: p.opacity ?? 1, easing: 'linear' },
        { time: end,       value: 0,              easing },
      ]);
      kf.scaleX  = mergeKF(kf.scaleX, [
        { time: startTime, value: p.scaleX ?? 1, easing: 'linear' },
        { time: end,       value: 0,             easing },
      ]);
      kf.scaleY  = mergeKF(kf.scaleY, [
        { time: startTime, value: p.scaleY ?? 1, easing: 'linear' },
        { time: end,       value: 0,             easing },
      ]);
      break;
    default:
      break;
  }
  return kf;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function fadeKF(t0, t1, finalOpacity, easing) {
  return [
    { time: t0, value: 0,            easing },
    { time: t1, value: finalOpacity, easing: 'linear' },
  ];
}

function mergeKF(existing = [], additions = []) {
  const merged = [...existing];
  additions.forEach(kf => {
    const idx = merged.findIndex(k => Math.abs(k.time - kf.time) < 0.01);
    if (idx >= 0) merged[idx] = kf;
    else merged.push(kf);
  });
  return merged.sort((a, b) => a.time - b.time);
}

// Remove entrance-related keyframes (those at or near time 0 up to 1.5s)
function stripEntranceKeys(kf) {
  const copy = {};
  Object.keys(kf).forEach(prop => {
    copy[prop] = (kf[prop] || []).filter(k => k.time > 1.5);
  });
  return copy;
}

function stripExitKeys(kf, fromTime) {
  const copy = {};
  Object.keys(kf).forEach(prop => {
    copy[prop] = (kf[prop] || []).filter(k => k.time < fromTime);
  });
  return copy;
}
