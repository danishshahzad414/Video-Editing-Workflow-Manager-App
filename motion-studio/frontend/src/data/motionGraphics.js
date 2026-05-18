// 5 premium motion graphics animations (abstract/visual, no text dependency)
export const MOTION_GRAPHICS = [
  // ─── 1. Particle Burst ───────────────────────────────────────────────────
  {
    id: 'mg_particle_burst',
    name: 'Particle Burst',
    duration: 4,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#050510',
    layers: [
      { id: 'pb_c1', name: 'Particle 1', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 18, height: 18, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#a855f7', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { x: [{ time: 0, value: 640, easing: 'ease-out' }, { time: 2, value: 880, easing: 'ease-out' }], y: [{ time: 0, value: 360, easing: 'ease-out' }, { time: 2, value: 180, easing: 'ease-out' }], opacity: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 0.3, value: 1, easing: 'ease-out' }, { time: 1.5, value: 1, easing: 'ease-in' }, { time: 2, value: 0, easing: 'ease-in' }], scaleX: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 0.3, value: 1, easing: 'ease-out' }, { time: 2, value: 0.3, easing: 'ease-in' }], scaleY: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 0.3, value: 1, easing: 'ease-out' }, { time: 2, value: 0.3, easing: 'ease-in' }] } },
      { id: 'pb_c2', name: 'Particle 2', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 24, height: 24, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { x: [{ time: 0, value: 640, easing: 'ease-out' }, { time: 2.2, value: 400, easing: 'ease-out' }], y: [{ time: 0, value: 360, easing: 'ease-out' }, { time: 2.2, value: 160, easing: 'ease-out' }], opacity: [{ time: 0.1, value: 0, easing: 'ease-out' }, { time: 0.4, value: 1, easing: 'ease-out' }, { time: 1.8, value: 1, easing: 'ease-in' }, { time: 2.2, value: 0, easing: 'ease-in' }], scaleX: [{ time: 0.1, value: 0, easing: 'ease-out' }, { time: 0.4, value: 1.2, easing: 'ease-out' }], scaleY: [{ time: 0.1, value: 0, easing: 'ease-out' }, { time: 0.4, value: 1.2, easing: 'ease-out' }] } },
      { id: 'pb_c3', name: 'Particle 3', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 14, height: 14, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#ec4899', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { x: [{ time: 0, value: 640, easing: 'ease-out' }, { time: 1.8, value: 900, easing: 'ease-out' }], y: [{ time: 0, value: 360, easing: 'ease-out' }, { time: 1.8, value: 490, easing: 'ease-out' }], opacity: [{ time: 0.2, value: 0, easing: 'ease-out' }, { time: 0.5, value: 1, easing: 'ease-out' }, { time: 1.4, value: 1, easing: 'ease-in' }, { time: 1.8, value: 0, easing: 'ease-in' }] } },
      { id: 'pb_c4', name: 'Particle 4', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 20, height: 20, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#06b6d4', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { x: [{ time: 0, value: 640, easing: 'ease-out' }, { time: 2, value: 350, easing: 'ease-out' }], y: [{ time: 0, value: 360, easing: 'ease-out' }, { time: 2, value: 550, easing: 'ease-out' }], opacity: [{ time: 0.15, value: 0, easing: 'ease-out' }, { time: 0.45, value: 1, easing: 'ease-out' }, { time: 1.6, value: 1, easing: 'ease-in' }, { time: 2, value: 0, easing: 'ease-in' }] } },
      { id: 'pb_c5', name: 'Particle 5', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 30, height: 30, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#f59e0b', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { x: [{ time: 0, value: 640, easing: 'ease-out' }, { time: 2.4, value: 760, easing: 'ease-out' }], y: [{ time: 0, value: 360, easing: 'ease-out' }, { time: 2.4, value: 600, easing: 'ease-out' }], opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.6, value: 1, easing: 'ease-out' }, { time: 2, value: 1, easing: 'ease-in' }, { time: 2.4, value: 0, easing: 'ease-in' }] } },
      { id: 'pb_c6', name: 'Particle 6', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 12, height: 12, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#10b981', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { x: [{ time: 0, value: 640, easing: 'ease-out' }, { time: 1.6, value: 480, easing: 'ease-out' }], y: [{ time: 0, value: 360, easing: 'ease-out' }, { time: 1.6, value: 200, easing: 'ease-out' }], opacity: [{ time: 0.05, value: 0, easing: 'ease-out' }, { time: 0.35, value: 1, easing: 'ease-out' }, { time: 1.2, value: 1, easing: 'ease-in' }, { time: 1.6, value: 0, easing: 'ease-in' }] } },
      { id: 'pb_core', name: 'Core', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 60, height: 60, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0, shapeType: 'circle', fill: '#ffffff', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { opacity: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 0.2, value: 0.9, easing: 'ease-out' }, { time: 0.6, value: 0, easing: 'ease-out' }], scaleX: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 0.2, value: 1.5, easing: 'ease-out' }, { time: 0.6, value: 3, easing: 'ease-out' }], scaleY: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 0.2, value: 1.5, easing: 'ease-out' }, { time: 0.6, value: 3, easing: 'ease-out' }] } },
    ]
  },

  // ─── 2. Geometric Morphing ───────────────────────────────────────────────
  {
    id: 'mg_geo_morph',
    name: 'Geometric Morphing',
    duration: 6,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#111111',
    layers: [
      { id: 'gm_sq1', name: 'Square 1', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 200, height: 200, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: 'transparent', stroke: '#6366f1', strokeWidth: 3, borderRadius: 0 },
        keyframes: { rotation: [{ time: 0, value: 0, easing: 'linear' }, { time: 6, value: 360, easing: 'linear' }], scaleX: [{ time: 0, value: 0, easing: 'spring' }, { time: 0.8, value: 1, easing: 'spring' }, { time: 2, value: 1.4, easing: 'ease-in-out' }, { time: 3, value: 0.7, easing: 'ease-in-out' }, { time: 4, value: 1.2, easing: 'ease-in-out' }, { time: 6, value: 1, easing: 'ease-in-out' }], scaleY: [{ time: 0, value: 0, easing: 'spring' }, { time: 0.8, value: 1, easing: 'spring' }, { time: 2, value: 0.7, easing: 'ease-in-out' }, { time: 3, value: 1.4, easing: 'ease-in-out' }, { time: 4, value: 0.8, easing: 'ease-in-out' }, { time: 6, value: 1, easing: 'ease-in-out' }] } },
      { id: 'gm_sq2', name: 'Square 2', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 300, height: 300, rotation: 45, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: 'transparent', stroke: '#a855f7', strokeWidth: 2, borderRadius: 0 },
        keyframes: { rotation: [{ time: 0, value: 45, easing: 'linear' }, { time: 6, value: -315, easing: 'linear' }], scaleX: [{ time: 0, value: 0, easing: 'spring' }, { time: 1, value: 1, easing: 'spring' }, { time: 3, value: 0.6, easing: 'ease-in-out' }, { time: 4.5, value: 1.3, easing: 'ease-in-out' }, { time: 6, value: 1, easing: 'ease-in-out' }], scaleY: [{ time: 0, value: 0, easing: 'spring' }, { time: 1, value: 1, easing: 'spring' }] } },
      { id: 'gm_sq3', name: 'Square 3', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 120, height: 120, rotation: 20, opacity: 0.6, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { rotation: [{ time: 0, value: 20, easing: 'linear' }, { time: 6, value: 200, easing: 'linear' }], scaleX: [{ time: 0, value: 0, easing: 'spring' }, { time: 0.6, value: 1, easing: 'spring' }, { time: 2, value: 0.5, easing: 'ease-in-out' }, { time: 4, value: 1.5, easing: 'ease-in-out' }, { time: 6, value: 1, easing: 'ease-in-out' }], scaleY: [{ time: 0, value: 0, easing: 'spring' }, { time: 0.6, value: 1, easing: 'spring' }], opacity: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 0.6, value: 0.6, easing: 'ease-out' }, { time: 3, value: 0.2, easing: 'ease-in-out' }, { time: 5, value: 0.8, easing: 'ease-in-out' }, { time: 6, value: 0.6, easing: 'ease-in-out' }] } },
      { id: 'gm_dot', name: 'Center Dot', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 20, height: 20, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0, shapeType: 'circle', fill: '#ffffff', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { opacity: [{ time: 0.3, value: 0, easing: 'spring' }, { time: 0.8, value: 1, easing: 'spring' }], scaleX: [{ time: 0.3, value: 0, easing: 'spring' }, { time: 0.8, value: 1, easing: 'spring' }, { time: 2.5, value: 2, easing: 'ease-in-out' }, { time: 3.5, value: 0.5, easing: 'ease-in-out' }, { time: 5, value: 1.5, easing: 'ease-in-out' }, { time: 6, value: 1, easing: 'ease-in-out' }], scaleY: [{ time: 0.3, value: 0, easing: 'spring' }, { time: 0.8, value: 1, easing: 'spring' }] } },
    ]
  },

  // ─── 3. Wave Pulse ───────────────────────────────────────────────────────
  {
    id: 'mg_wave_pulse',
    name: 'Wave Pulse',
    duration: 5,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#020617',
    layers: [
      ...Array.from({ length: 7 }, (_, i) => ({
        id: `wp_ring_${i}`,
        name: `Ring ${i + 1}`,
        type: 'shape',
        visible: true,
        locked: false,
        blendMode: 'normal',
        properties: {
          x: 640, y: 360,
          width: 60 + i * 60, height: 60 + i * 60,
          rotation: 0, opacity: 0, scaleX: 0.3, scaleY: 0.3,
          shapeType: 'circle',
          fill: 'transparent',
          stroke: i % 2 === 0 ? '#6366f1' : '#a855f7',
          strokeWidth: Math.max(1, 4 - i * 0.4),
          borderRadius: 0,
        },
        keyframes: {
          scaleX: [
            { time: i * 0.15, value: 0.3, easing: 'ease-out' },
            { time: i * 0.15 + 1.5, value: 1.8, easing: 'ease-out' },
            { time: i * 0.15 + 3, value: 0.3, easing: 'ease-in' },
            { time: i * 0.15 + 4.5, value: 1.8, easing: 'ease-out' },
          ],
          scaleY: [
            { time: i * 0.15, value: 0.3, easing: 'ease-out' },
            { time: i * 0.15 + 1.5, value: 1.8, easing: 'ease-out' },
            { time: i * 0.15 + 3, value: 0.3, easing: 'ease-in' },
            { time: i * 0.15 + 4.5, value: 1.8, easing: 'ease-out' },
          ],
          opacity: [
            { time: i * 0.15, value: 0, easing: 'ease-out' },
            { time: i * 0.15 + 0.3, value: 0.7, easing: 'ease-out' },
            { time: i * 0.15 + 1.5, value: 0, easing: 'ease-out' },
            { time: i * 0.15 + 3, value: 0, easing: 'ease-out' },
            { time: i * 0.15 + 3.3, value: 0.7, easing: 'ease-out' },
            { time: i * 0.15 + 4.5, value: 0, easing: 'ease-out' },
          ],
        },
      })),
      {
        id: 'wp_center', name: 'Center Core', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 40, height: 40, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {
          scaleX: [{ time: 0, value: 0, easing: 'spring' }, { time: 0.5, value: 1, easing: 'spring' }, { time: 1.5, value: 1.3, easing: 'ease-in-out' }, { time: 3, value: 0.7, easing: 'ease-in-out' }, { time: 4.5, value: 1.2, easing: 'ease-in-out' }, { time: 5, value: 1, easing: 'ease-in-out' }],
          scaleY: [{ time: 0, value: 0, easing: 'spring' }, { time: 0.5, value: 1, easing: 'spring' }],
          opacity: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 0.5, value: 1, easing: 'ease-out' }],
        }
      },
    ]
  },

  // ─── 4. Gradient Flow ────────────────────────────────────────────────────
  {
    id: 'mg_gradient_flow',
    name: 'Gradient Flow',
    duration: 6,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#0a0a12',
    layers: [
      ...[
        { color: '#6366f1', x: 320, y: 360, w: 500, h: 500, delay: 0 },
        { color: '#a855f7', x: 640, y: 260, w: 600, h: 600, delay: 0.4 },
        { color: '#ec4899', x: 960, y: 420, w: 450, h: 450, delay: 0.8 },
        { color: '#06b6d4', x: 500, y: 500, w: 400, h: 400, delay: 0.2 },
        { color: '#f59e0b', x: 800, y: 200, w: 350, h: 350, delay: 0.6 },
      ].map((cfg, i) => ({
        id: `gf_blob_${i}`,
        name: `Blob ${i + 1}`,
        type: 'shape',
        visible: true,
        locked: false,
        blendMode: i === 0 ? 'normal' : 'screen',
        properties: {
          x: cfg.x, y: cfg.y,
          width: cfg.w, height: cfg.h,
          rotation: 0, opacity: 0, scaleX: 0.5, scaleY: 0.5,
          shapeType: 'circle',
          fill: cfg.color,
          stroke: 'transparent', strokeWidth: 0, borderRadius: 0,
        },
        keyframes: {
          opacity: [
            { time: cfg.delay, value: 0, easing: 'ease-out' },
            { time: cfg.delay + 0.8, value: 0.25, easing: 'ease-out' },
            { time: 3, value: 0.18, easing: 'ease-in-out' },
            { time: 5, value: 0.28, easing: 'ease-in-out' },
          ],
          scaleX: [
            { time: cfg.delay, value: 0.5, easing: 'ease-out' },
            { time: cfg.delay + 1.5, value: 1, easing: 'ease-out' },
            { time: 3, value: 1.2, easing: 'ease-in-out' },
            { time: 4.5, value: 0.85, easing: 'ease-in-out' },
            { time: 6, value: 1, easing: 'ease-in-out' },
          ],
          scaleY: [
            { time: cfg.delay, value: 0.5, easing: 'ease-out' },
            { time: cfg.delay + 1.5, value: 1, easing: 'ease-out' },
            { time: 3, value: 0.85, easing: 'ease-in-out' },
            { time: 4.5, value: 1.2, easing: 'ease-in-out' },
            { time: 6, value: 1, easing: 'ease-in-out' },
          ],
          x: [
            { time: 0, value: cfg.x, easing: 'ease-in-out' },
            { time: 2, value: cfg.x + (i % 2 === 0 ? 40 : -40), easing: 'ease-in-out' },
            { time: 4, value: cfg.x - (i % 2 === 0 ? 20 : 30), easing: 'ease-in-out' },
            { time: 6, value: cfg.x, easing: 'ease-in-out' },
          ],
          y: [
            { time: 0, value: cfg.y, easing: 'ease-in-out' },
            { time: 2, value: cfg.y + (i % 3 === 0 ? -30 : 30), easing: 'ease-in-out' },
            { time: 4, value: cfg.y + (i % 2 === 0 ? 20 : -20), easing: 'ease-in-out' },
            { time: 6, value: cfg.y, easing: 'ease-in-out' },
          ],
        },
      })),
    ]
  },

  // ─── 5. DNA Helix / Orbiting Spheres ─────────────────────────────────────
  {
    id: 'mg_orbit',
    name: 'Orbital System',
    duration: 6,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#03030a',
    layers: [
      // Center star
      { id: 'orb_center', name: 'Star', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 50, height: 50, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0, shapeType: 'circle', fill: '#fbbf24', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { opacity: [{ time: 0, value: 0, easing: 'spring' }, { time: 0.6, value: 1, easing: 'spring' }], scaleX: [{ time: 0, value: 0, easing: 'spring' }, { time: 0.6, value: 1, easing: 'spring' }, { time: 2, value: 1.2, easing: 'ease-in-out' }, { time: 4, value: 0.9, easing: 'ease-in-out' }, { time: 6, value: 1, easing: 'ease-in-out' }], scaleY: [{ time: 0, value: 0, easing: 'spring' }, { time: 0.6, value: 1, easing: 'spring' }] } },
      // Orbit ring 1
      { id: 'orb_ring1', name: 'Orbit 1', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 220, height: 220, rotation: 0, opacity: 0.2, scaleX: 1, scaleY: 0.3, shapeType: 'circle', fill: 'transparent', stroke: '#6366f1', strokeWidth: 1.5, borderRadius: 0 },
        keyframes: { opacity: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 1.2, value: 0.2, easing: 'ease-out' }], rotation: [{ time: 0, value: 0, easing: 'linear' }, { time: 6, value: 360, easing: 'linear' }] } },
      // Planet 1 (orbiting on ring 1)
      { id: 'orb_p1', name: 'Planet 1', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 750, y: 360, width: 22, height: 22, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { opacity: [{ time: 0.7, value: 0, easing: 'ease-out' }, { time: 1.2, value: 1, easing: 'ease-out' }], x: [{ time: 0, value: 750, easing: 'linear' }, { time: 1, value: 530, easing: 'linear' }, { time: 2, value: 750, easing: 'linear' }, { time: 3, value: 530, easing: 'linear' }, { time: 4, value: 750, easing: 'linear' }, { time: 5, value: 530, easing: 'linear' }, { time: 6, value: 750, easing: 'linear' }], y: [{ time: 0, value: 360, easing: 'linear' }, { time: 0.5, value: 393, easing: 'linear' }, { time: 1, value: 360, easing: 'linear' }, { time: 1.5, value: 327, easing: 'linear' }, { time: 2, value: 360, easing: 'linear' }, { time: 2.5, value: 393, easing: 'linear' }, { time: 3, value: 360, easing: 'linear' }, { time: 3.5, value: 327, easing: 'linear' }, { time: 4, value: 360, easing: 'linear' }, { time: 4.5, value: 393, easing: 'linear' }, { time: 5, value: 360, easing: 'linear' }, { time: 5.5, value: 327, easing: 'linear' }, { time: 6, value: 360, easing: 'linear' }] } },
      // Orbit ring 2
      { id: 'orb_ring2', name: 'Orbit 2', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 360, height: 360, rotation: 25, opacity: 0.15, scaleX: 1, scaleY: 0.4, shapeType: 'circle', fill: 'transparent', stroke: '#a855f7', strokeWidth: 1, borderRadius: 0 },
        keyframes: { opacity: [{ time: 0.8, value: 0, easing: 'ease-out' }, { time: 1.5, value: 0.15, easing: 'ease-out' }], rotation: [{ time: 0, value: 25, easing: 'linear' }, { time: 6, value: -335, easing: 'linear' }] } },
      // Planet 2
      { id: 'orb_p2', name: 'Planet 2', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 820, y: 360, width: 18, height: 18, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#a855f7', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { opacity: [{ time: 1, value: 0, easing: 'ease-out' }, { time: 1.6, value: 1, easing: 'ease-out' }], x: [{ time: 0, value: 820, easing: 'linear' }, { time: 1.5, value: 460, easing: 'linear' }, { time: 3, value: 820, easing: 'linear' }, { time: 4.5, value: 460, easing: 'linear' }, { time: 6, value: 820, easing: 'linear' }], y: [{ time: 0, value: 360, easing: 'linear' }, { time: 0.75, value: 420, easing: 'linear' }, { time: 1.5, value: 360, easing: 'linear' }, { time: 2.25, value: 300, easing: 'linear' }, { time: 3, value: 360, easing: 'linear' }, { time: 3.75, value: 420, easing: 'linear' }, { time: 4.5, value: 360, easing: 'linear' }, { time: 5.25, value: 300, easing: 'linear' }, { time: 6, value: 360, easing: 'linear' }] } },
      // Glow
      { id: 'orb_glow', name: 'Glow', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 200, height: 200, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#fbbf24', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { opacity: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 0.6, value: 0.07, easing: 'ease-out' }, { time: 2, value: 0.12, easing: 'ease-in-out' }, { time: 4, value: 0.06, easing: 'ease-in-out' }, { time: 6, value: 0.1, easing: 'ease-in-out' }], scaleX: [{ time: 0, value: 0, easing: 'spring' }, { time: 0.6, value: 1, easing: 'spring' }, { time: 2, value: 1.4, easing: 'ease-in-out' }, { time: 4, value: 0.9, easing: 'ease-in-out' }, { time: 6, value: 1.2, easing: 'ease-in-out' }], scaleY: [{ time: 0, value: 0, easing: 'spring' }, { time: 0.6, value: 1, easing: 'spring' }] } },
    ]
  },
];
