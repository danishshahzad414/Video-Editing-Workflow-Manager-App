// Easing functions
export function applyEasing(t, easing = 'ease') {
  t = Math.max(0, Math.min(1, t));
  switch (easing) {
    case 'linear': return t;
    case 'ease': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    case 'ease-in': return t * t;
    case 'ease-out': return t * (2 - t);
    case 'ease-in-out': return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    case 'bounce': {
      if (t < 1 / 2.75) return 7.5625 * t * t;
      else if (t < 2 / 2.75) { t -= 1.5 / 2.75; return 7.5625 * t * t + 0.75; }
      else if (t < 2.5 / 2.75) { t -= 2.25 / 2.75; return 7.5625 * t * t + 0.9375; }
      else { t -= 2.625 / 2.75; return 7.5625 * t * t + 0.984375; }
    }
    case 'spring': {
      const c4 = (2 * Math.PI) / 3;
      if (t === 0) return 0;
      if (t === 1) return 1;
      return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
    }
    default: return t;
  }
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Get interpolated value for a property at a given time
export function getValueAtTime(keyframes, time, defaultValue) {
  if (!keyframes || keyframes.length === 0) return defaultValue;
  if (keyframes.length === 1) return keyframes[0].value;
  if (time <= keyframes[0].time) return keyframes[0].value;
  if (time >= keyframes[keyframes.length - 1].time) return keyframes[keyframes.length - 1].value;

  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i];
    const b = keyframes[i + 1];
    if (time >= a.time && time <= b.time) {
      const rawT = (time - a.time) / (b.time - a.time);
      const easedT = applyEasing(rawT, b.easing || 'ease');
      if (typeof a.value === 'number') return lerp(a.value, b.value, easedT);
      return easedT < 0.5 ? a.value : b.value;
    }
  }
  return defaultValue;
}

// Compute computed properties for a layer at a given time (includes 3D)
export function computeLayerProps(layer, time) {
  const p  = layer.properties;
  const kf = layer.keyframes || {};

  return {
    x:           getValueAtTime(kf.x,           time, p.x           ?? 0),
    y:           getValueAtTime(kf.y,           time, p.y           ?? 0),
    width:       getValueAtTime(kf.width,       time, p.width       ?? 200),
    height:      getValueAtTime(kf.height,      time, p.height      ?? 100),
    rotation:    getValueAtTime(kf.rotation,    time, p.rotation    ?? 0),
    opacity:     getValueAtTime(kf.opacity,     time, p.opacity     ?? 1),
    scaleX:      getValueAtTime(kf.scaleX,      time, p.scaleX      ?? 1),
    scaleY:      getValueAtTime(kf.scaleY,      time, p.scaleY      ?? 1),
    // 3D transforms
    rotateX:     getValueAtTime(kf.rotateX,     time, p.rotateX     ?? 0),
    rotateY:     getValueAtTime(kf.rotateY,     time, p.rotateY     ?? 0),
    skewX:       getValueAtTime(kf.skewX,       time, p.skewX       ?? 0),
    skewY:       getValueAtTime(kf.skewY,       time, p.skewY       ?? 0),
    perspective: p.perspective ?? 800,
    // Visual
    blur:        getValueAtTime(kf.blur,        time, p.blur        ?? 0),
    brightness:  getValueAtTime(kf.brightness,  time, p.brightness  ?? 1),
  };
}

// Format seconds as MM:SS:FF
export function formatTime(seconds, fps = 30) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const f = Math.floor((seconds % 1) * fps);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
}
