// 10 premium built-in animation templates
export const PRESET_TEMPLATES = [
  // ─── 1. Neon Kinetic Typography ─────────────────────────────────────────
  {
    id: 'preset_neon_kinetic',
    name: 'Neon Kinetic Typography',
    duration: 6,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#030310',
    layers: [
      {
        id: 'nk_bg', name: 'BG Glow', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 900, height: 400, rotation: 0, opacity: 0.18, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#7c3aed', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {
          opacity: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 1.2, value: 0.18, easing: 'ease-in-out' }, { time: 6, value: 0.1, easing: 'linear' }],
          scaleX: [{ time: 0, value: 0.5, easing: 'ease-out' }, { time: 2, value: 1, easing: 'ease-in-out' }, { time: 4, value: 1.15, easing: 'ease-in-out' }, { time: 6, value: 1, easing: 'linear' }],
          scaleY: [{ time: 0, value: 0.5, easing: 'ease-out' }, { time: 2, value: 1, easing: 'ease-in-out' }, { time: 4, value: 1.15, easing: 'ease-in-out' }, { time: 6, value: 1, easing: 'linear' }],
        }
      },
      {
        id: 'nk_line1', name: 'Line Top', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 290, width: 0, height: 3, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#a855f7', stroke: 'transparent', strokeWidth: 0, borderRadius: 2 },
        keyframes: {
          width: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 1.4, value: 600, easing: 'ease-out' }],
          opacity: [{ time: 0.5, value: 0, easing: 'linear' }, { time: 0.6, value: 1, easing: 'linear' }, { time: 5.5, value: 1, easing: 'ease-in' }, { time: 6, value: 0, easing: 'ease-in' }],
        }
      },
      {
        id: 'nk_line2', name: 'Line Bottom', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 430, width: 0, height: 3, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#06b6d4', stroke: 'transparent', strokeWidth: 0, borderRadius: 2 },
        keyframes: {
          width: [{ time: 0.7, value: 0, easing: 'ease-out' }, { time: 1.6, value: 600, easing: 'ease-out' }],
          opacity: [{ time: 0.7, value: 0, easing: 'linear' }, { time: 0.8, value: 1, easing: 'linear' }, { time: 5.5, value: 1, easing: 'ease-in' }, { time: 6, value: 0, easing: 'ease-in' }],
        }
      },
      {
        id: 'nk_title', name: 'Main Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 345, width: 900, height: 100, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'MOTION STUDIO', fontSize: 86, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 12 },
        keyframes: {
          opacity: [{ time: 1, value: 0, easing: 'ease-out' }, { time: 1.8, value: 1, easing: 'ease-out' }, { time: 5.3, value: 1, easing: 'ease-in' }, { time: 6, value: 0, easing: 'ease-in' }],
          scaleX: [{ time: 1, value: 1.3, easing: 'ease-out' }, { time: 1.8, value: 1, easing: 'ease-out' }],
          scaleY: [{ time: 1, value: 1.3, easing: 'ease-out' }, { time: 1.8, value: 1, easing: 'ease-out' }],
          y: [{ time: 1, value: 380, easing: 'ease-out' }, { time: 1.8, value: 345, easing: 'ease-out' }],
        }
      },
      {
        id: 'nk_sub', name: 'Subtitle', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 420, width: 700, height: 50, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'CREATIVE DIRECTION & DESIGN', fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#a855f7', textAlign: 'center', letterSpacing: 8 },
        keyframes: {
          opacity: [{ time: 1.5, value: 0, easing: 'ease-out' }, { time: 2.3, value: 1, easing: 'ease-out' }, { time: 5.3, value: 1, easing: 'ease-in' }, { time: 6, value: 0, easing: 'ease-in' }],
          y: [{ time: 1.5, value: 440, easing: 'ease-out' }, { time: 2.3, value: 420, easing: 'ease-out' }],
        }
      },
    ]
  },

  // ─── 2. Minimal Brand Reveal ─────────────────────────────────────────────
  {
    id: 'preset_minimal_brand',
    name: 'Minimal Brand Reveal',
    duration: 5,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#ffffff',
    layers: [
      {
        id: 'mb_bar', name: 'Reveal Bar', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 1280, height: 720, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#111111', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {
          scaleX: [{ time: 0, value: 1, easing: 'ease-in-out' }, { time: 1.5, value: 0, easing: 'ease-in-out' }],
          x: [{ time: 0, value: 640, easing: 'ease-in-out' }, { time: 1.5, value: 1280, easing: 'ease-in-out' }],
        }
      },
      {
        id: 'mb_logo_bg', name: 'Logo Circle', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 320, width: 100, height: 100, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0, shapeType: 'circle', fill: '#111111', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {
          opacity: [{ time: 1.2, value: 0, easing: 'ease-out' }, { time: 1.6, value: 1, easing: 'ease-out' }],
          scaleX: [{ time: 1.2, value: 0, easing: 'spring' }, { time: 2, value: 1, easing: 'spring' }],
          scaleY: [{ time: 1.2, value: 0, easing: 'spring' }, { time: 2, value: 1, easing: 'spring' }],
        }
      },
      {
        id: 'mb_brand', name: 'Brand Name', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 400, width: 800, height: 80, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'BRANDNAME', fontSize: 72, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#111111', textAlign: 'center', letterSpacing: 16 },
        keyframes: {
          opacity: [{ time: 1.8, value: 0, easing: 'ease-out' }, { time: 2.6, value: 1, easing: 'ease-out' }],
          y: [{ time: 1.8, value: 420, easing: 'ease-out' }, { time: 2.6, value: 400, easing: 'ease-out' }],
        }
      },
      {
        id: 'mb_tagline', name: 'Tagline', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 458, width: 600, height: 40, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Design Without Limits', fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#666666', textAlign: 'center', letterSpacing: 3 },
        keyframes: {
          opacity: [{ time: 2.4, value: 0, easing: 'ease-out' }, { time: 3.2, value: 1, easing: 'ease-out' }],
          y: [{ time: 2.4, value: 475, easing: 'ease-out' }, { time: 3.2, value: 458, easing: 'ease-out' }],
        }
      },
      {
        id: 'mb_line', name: 'Underline', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 480, width: 0, height: 2, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#111111', stroke: 'transparent', strokeWidth: 0, borderRadius: 1 },
        keyframes: {
          width: [{ time: 2.8, value: 0, easing: 'ease-out' }, { time: 3.6, value: 200, easing: 'ease-out' }],
        }
      },
    ]
  },

  // ─── 3. Corporate Lower Third ─────────────────────────────────────────────
  {
    id: 'preset_lower_third',
    name: 'Corporate Lower Third',
    duration: 6,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#1a1f2e',
    layers: [
      {
        id: 'lt_accent', name: 'Accent Bar', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 200, y: 590, width: 0, height: 56, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#2563eb', stroke: 'transparent', strokeWidth: 0, borderRadius: 4 },
        keyframes: {
          width: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.9, value: 420, easing: 'ease-out' }],
          x: [{ time: 0.3, value: 130, easing: 'ease-out' }, { time: 0.9, value: 340, easing: 'ease-out' }],
          opacity: [{ time: 4.8, value: 1, easing: 'ease-in' }, { time: 5.4, value: 0, easing: 'ease-in' }],
        }
      },
      {
        id: 'lt_bg', name: 'Name BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 200, y: 590, width: 0, height: 56, rotation: 0, opacity: 0.92, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#0f172a', stroke: 'transparent', strokeWidth: 0, borderRadius: 4 },
        keyframes: {
          width: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 1.2, value: 520, easing: 'ease-out' }],
          x: [{ time: 0.5, value: 130, easing: 'ease-out' }, { time: 1.2, value: 390, easing: 'ease-out' }],
          opacity: [{ time: 4.8, value: 0.92, easing: 'ease-in' }, { time: 5.4, value: 0, easing: 'ease-in' }],
        }
      },
      {
        id: 'lt_name', name: 'Name', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 340, y: 585, width: 440, height: 36, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Alexandra Chen', fontSize: 26, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'left', letterSpacing: 0.5 },
        keyframes: {
          opacity: [{ time: 0.8, value: 0, easing: 'ease-out' }, { time: 1.4, value: 1, easing: 'ease-out' }, { time: 4.8, value: 1, easing: 'ease-in' }, { time: 5.2, value: 0, easing: 'ease-in' }],
          x: [{ time: 0.8, value: 310, easing: 'ease-out' }, { time: 1.4, value: 340, easing: 'ease-out' }],
        }
      },
      {
        id: 'lt_title', name: 'Job Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 340, y: 613, width: 440, height: 26, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Senior Creative Director', fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#93c5fd', textAlign: 'left', letterSpacing: 1 },
        keyframes: {
          opacity: [{ time: 1.1, value: 0, easing: 'ease-out' }, { time: 1.7, value: 1, easing: 'ease-out' }, { time: 4.8, value: 1, easing: 'ease-in' }, { time: 5.2, value: 0, easing: 'ease-in' }],
          x: [{ time: 1.1, value: 310, easing: 'ease-out' }, { time: 1.7, value: 340, easing: 'ease-out' }],
        }
      },
    ]
  },

  // ─── 4. Glitch Title Screen ──────────────────────────────────────────────
  {
    id: 'preset_glitch_title',
    name: 'Glitch Title Screen',
    duration: 5,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#000000',
    layers: [
      {
        id: 'gt_scanline', name: 'Scanlines', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 1280, height: 720, rotation: 0, opacity: 0.06, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#00ff41', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {}
      },
      {
        id: 'gt_r', name: 'Title Red', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 648, y: 358, width: 1000, height: 120, rotation: 0, opacity: 0.7, scaleX: 1, scaleY: 1, text: 'SYSTEM ERROR', fontSize: 96, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ff0040', textAlign: 'center', letterSpacing: 6 },
        keyframes: {
          x: [{ time: 0, value: 648, easing: 'linear' }, { time: 0.1, value: 660, easing: 'linear' }, { time: 0.2, value: 635, easing: 'linear' }, { time: 0.3, value: 648, easing: 'linear' }, { time: 1.5, value: 648, easing: 'linear' }, { time: 1.6, value: 668, easing: 'linear' }, { time: 1.7, value: 648, easing: 'linear' }, { time: 3, value: 648, easing: 'linear' }, { time: 3.05, value: 640, easing: 'linear' }, { time: 3.1, value: 648, easing: 'linear' }],
          opacity: [{ time: 0, value: 0, easing: 'linear' }, { time: 0.4, value: 0.7, easing: 'linear' }],
        }
      },
      {
        id: 'gt_b', name: 'Title Cyan', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 634, y: 362, width: 1000, height: 120, rotation: 0, opacity: 0.7, scaleX: 1, scaleY: 1, text: 'SYSTEM ERROR', fontSize: 96, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#00ffff', textAlign: 'center', letterSpacing: 6 },
        keyframes: {
          x: [{ time: 0, value: 634, easing: 'linear' }, { time: 0.1, value: 622, easing: 'linear' }, { time: 0.2, value: 645, easing: 'linear' }, { time: 0.3, value: 634, easing: 'linear' }, { time: 1.5, value: 634, easing: 'linear' }, { time: 1.6, value: 620, easing: 'linear' }, { time: 1.7, value: 634, easing: 'linear' }],
          opacity: [{ time: 0, value: 0, easing: 'linear' }, { time: 0.4, value: 0.7, easing: 'linear' }],
        }
      },
      {
        id: 'gt_main', name: 'Title Main', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 358, width: 1000, height: 120, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, text: 'SYSTEM ERROR', fontSize: 96, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 6 },
        keyframes: {
          opacity: [{ time: 0, value: 0, easing: 'linear' }, { time: 0.5, value: 1, easing: 'linear' }],
        }
      },
      {
        id: 'gt_sub', name: 'Subtitle', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 448, width: 800, height: 50, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '// ACCESS DENIED — REBOOT REQUIRED //', fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#00ff41', textAlign: 'center', letterSpacing: 4 },
        keyframes: {
          opacity: [{ time: 1, value: 0, easing: 'linear' }, { time: 1.1, value: 1, easing: 'linear' }, { time: 1.2, value: 0, easing: 'linear' }, { time: 1.3, value: 1, easing: 'linear' }],
        }
      },
    ]
  },

  // ─── 5. Countdown Timer ──────────────────────────────────────────────────
  {
    id: 'preset_countdown',
    name: 'Neon Countdown',
    duration: 6,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#06060f',
    layers: [
      {
        id: 'cd_ring_outer', name: 'Ring Outer', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 380, height: 380, rotation: 0, opacity: 0.3, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: 'transparent', stroke: '#6366f1', strokeWidth: 3, borderRadius: 0 },
        keyframes: {
          rotation: [{ time: 0, value: 0, easing: 'linear' }, { time: 6, value: 360, easing: 'linear' }],
          scaleX: [{ time: 0, value: 0, easing: 'spring' }, { time: 0.8, value: 1, easing: 'spring' }],
          scaleY: [{ time: 0, value: 0, easing: 'spring' }, { time: 0.8, value: 1, easing: 'spring' }],
        }
      },
      {
        id: 'cd_ring_inner', name: 'Ring Inner', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 300, height: 300, rotation: 0, opacity: 0.5, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: 'transparent', stroke: '#a855f7', strokeWidth: 2, borderRadius: 0 },
        keyframes: {
          rotation: [{ time: 0, value: 0, easing: 'linear' }, { time: 6, value: -360, easing: 'linear' }],
          scaleX: [{ time: 0, value: 0, easing: 'spring' }, { time: 1, value: 1, easing: 'spring' }],
          scaleY: [{ time: 0, value: 0, easing: 'spring' }, { time: 1, value: 1, easing: 'spring' }],
        }
      },
      {
        id: 'cd_label', name: 'Label', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 300, width: 400, height: 40, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'STARTING IN', fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#a855f7', textAlign: 'center', letterSpacing: 8 },
        keyframes: {
          opacity: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 1.2, value: 1, easing: 'ease-out' }],
        }
      },
      {
        id: 'cd_number', name: 'Countdown', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 300, height: 160, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '5', fontSize: 140, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.8, value: 0, easing: 'ease-out' }, { time: 1.3, value: 1, easing: 'ease-out' }],
          scaleX: [{ time: 1, value: 1.3, easing: 'ease-out' }, { time: 1.5, value: 1, easing: 'ease-out' }, { time: 2, value: 1.3, easing: 'ease-out' }, { time: 2.5, value: 1, easing: 'ease-out' }, { time: 3, value: 1.3, easing: 'ease-out' }, { time: 3.5, value: 1, easing: 'ease-out' }, { time: 4, value: 1.3, easing: 'ease-out' }, { time: 4.5, value: 1, easing: 'ease-out' }, { time: 5, value: 1.3, easing: 'ease-out' }, { time: 5.5, value: 1, easing: 'ease-out' }],
          scaleY: [{ time: 1, value: 1.3, easing: 'ease-out' }, { time: 1.5, value: 1, easing: 'ease-out' }, { time: 2, value: 1.3, easing: 'ease-out' }, { time: 2.5, value: 1, easing: 'ease-out' }, { time: 3, value: 1.3, easing: 'ease-out' }, { time: 3.5, value: 1, easing: 'ease-out' }, { time: 4, value: 1.3, easing: 'ease-out' }, { time: 4.5, value: 1, easing: 'ease-out' }, { time: 5, value: 1.3, easing: 'ease-out' }, { time: 5.5, value: 1, easing: 'ease-out' }],
        }
      },
      {
        id: 'cd_go', name: 'GO Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 450, width: 400, height: 50, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'LIVE NOW', fontSize: 22, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#6366f1', textAlign: 'center', letterSpacing: 10 },
        keyframes: {
          opacity: [{ time: 5.5, value: 0, easing: 'ease-out' }, { time: 6, value: 1, easing: 'ease-out' }],
        }
      },
    ]
  },

  // ─── 6. Social Media Story ───────────────────────────────────────────────
  {
    id: 'preset_social_story',
    name: 'Social Media Story',
    duration: 6,
    fps: 30,
    width: 720,
    height: 1280,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    layers: [
      {
        id: 'ss_bg', name: 'Gradient BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 360, y: 640, width: 720, height: 1280, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#667eea', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {}
      },
      {
        id: 'ss_circle1', name: 'Deco Circle 1', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 600, y: 200, width: 400, height: 400, rotation: 0, opacity: 0.15, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#ffffff', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {
          scaleX: [{ time: 0, value: 0.8, easing: 'ease-in-out' }, { time: 3, value: 1.1, easing: 'ease-in-out' }, { time: 6, value: 0.8, easing: 'ease-in-out' }],
          scaleY: [{ time: 0, value: 0.8, easing: 'ease-in-out' }, { time: 3, value: 1.1, easing: 'ease-in-out' }, { time: 6, value: 0.8, easing: 'ease-in-out' }],
        }
      },
      {
        id: 'ss_circle2', name: 'Deco Circle 2', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 100, y: 1100, width: 500, height: 500, rotation: 0, opacity: 0.1, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#ffffff', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {
          scaleX: [{ time: 0, value: 1.1, easing: 'ease-in-out' }, { time: 3, value: 0.8, easing: 'ease-in-out' }, { time: 6, value: 1.1, easing: 'ease-in-out' }],
          scaleY: [{ time: 0, value: 1.1, easing: 'ease-in-out' }, { time: 3, value: 0.8, easing: 'ease-in-out' }, { time: 6, value: 1.1, easing: 'ease-in-out' }],
        }
      },
      {
        id: 'ss_eyebrow', name: 'Eyebrow', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 360, y: 560, width: 600, height: 50, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'NEW RELEASE', fontSize: 20, fontFamily: 'Inter, sans-serif', fontWeight: '500', color: 'rgba(255,255,255,0.75)', textAlign: 'center', letterSpacing: 8 },
        keyframes: {
          opacity: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 1.1, value: 1, easing: 'ease-out' }],
          y: [{ time: 0.5, value: 580, easing: 'ease-out' }, { time: 1.1, value: 560, easing: 'ease-out' }],
        }
      },
      {
        id: 'ss_headline', name: 'Headline', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 360, y: 640, width: 640, height: 200, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'YOUR\nSTORY', fontSize: 110, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 4 },
        keyframes: {
          opacity: [{ time: 0.8, value: 0, easing: 'ease-out' }, { time: 1.5, value: 1, easing: 'ease-out' }],
          scaleX: [{ time: 0.8, value: 0.85, easing: 'ease-out' }, { time: 1.5, value: 1, easing: 'ease-out' }],
          scaleY: [{ time: 0.8, value: 0.85, easing: 'ease-out' }, { time: 1.5, value: 1, easing: 'ease-out' }],
        }
      },
      {
        id: 'ss_cta', name: 'CTA', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 360, y: 820, width: 0, height: 52, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#ffffff', stroke: 'transparent', strokeWidth: 0, borderRadius: 26 },
        keyframes: {
          width: [{ time: 1.5, value: 0, easing: 'ease-out' }, { time: 2.2, value: 260, easing: 'ease-out' }],
          opacity: [{ time: 1.5, value: 0, easing: 'ease-out' }, { time: 1.7, value: 1, easing: 'ease-out' }],
        }
      },
      {
        id: 'ss_cta_text', name: 'CTA Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 360, y: 820, width: 260, height: 52, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'LEARN MORE →', fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#667eea', textAlign: 'center', letterSpacing: 2 },
        keyframes: {
          opacity: [{ time: 2.1, value: 0, easing: 'ease-out' }, { time: 2.6, value: 1, easing: 'ease-out' }],
        }
      },
    ]
  },

  // ─── 7. Cinematic Title ──────────────────────────────────────────────────
  {
    id: 'preset_cinematic',
    name: 'Cinematic Title Sequence',
    duration: 8,
    fps: 24,
    width: 1920,
    height: 1080,
    background: '#000000',
    layers: [
      {
        id: 'ct_bars_top', name: 'Letterbox Top', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 0, width: 1920, height: 130, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#000000', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {
          y: [{ time: 0, value: -65, easing: 'ease-in-out' }, { time: 1.5, value: 65, easing: 'ease-in-out' }],
        }
      },
      {
        id: 'ct_bars_bot', name: 'Letterbox Bottom', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 1080, width: 1920, height: 130, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#000000', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {
          y: [{ time: 0, value: 1145, easing: 'ease-in-out' }, { time: 1.5, value: 1015, easing: 'ease-in-out' }],
        }
      },
      {
        id: 'ct_subtitle', name: 'Pre-title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 440, width: 1400, height: 60, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'A N T H R O P I C   P R E S E N T S', fontSize: 20, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#888888', textAlign: 'center', letterSpacing: 12 },
        keyframes: {
          opacity: [{ time: 1.5, value: 0, easing: 'ease-out' }, { time: 2.5, value: 1, easing: 'ease-out' }, { time: 5.5, value: 1, easing: 'ease-in' }, { time: 6.5, value: 0, easing: 'ease-in' }],
        }
      },
      {
        id: 'ct_title', name: 'Main Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 530, width: 1600, height: 180, rotation: 0, opacity: 0, scaleX: 1.05, scaleY: 1.05, text: 'THE LAST HORIZON', fontSize: 120, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 20 },
        keyframes: {
          opacity: [{ time: 2.5, value: 0, easing: 'ease-out' }, { time: 4, value: 1, easing: 'ease-out' }, { time: 5.5, value: 1, easing: 'ease-in' }, { time: 7, value: 0, easing: 'ease-in' }],
          scaleX: [{ time: 2.5, value: 1.08, easing: 'ease-out' }, { time: 4, value: 1, easing: 'ease-out' }],
          scaleY: [{ time: 2.5, value: 1.08, easing: 'ease-out' }, { time: 4, value: 1, easing: 'ease-out' }],
        }
      },
      {
        id: 'ct_year', name: 'Year', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 640, width: 800, height: 50, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '2 0 2 6', fontSize: 22, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#555555', textAlign: 'center', letterSpacing: 16 },
        keyframes: {
          opacity: [{ time: 3.5, value: 0, easing: 'ease-out' }, { time: 4.5, value: 1, easing: 'ease-out' }, { time: 5.5, value: 1, easing: 'ease-in' }, { time: 6.5, value: 0, easing: 'ease-in' }],
        }
      },
    ]
  },

  // ─── 8. Product Showcase ─────────────────────────────────────────────────
  {
    id: 'preset_product',
    name: 'Product Launch Card',
    duration: 6,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#0a0a0a',
    layers: [
      {
        id: 'ps_glow', name: 'BG Glow', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 360, width: 700, height: 600, rotation: 0, opacity: 0.12, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#f97316', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {
          scaleX: [{ time: 0, value: 0.6, easing: 'ease-out' }, { time: 2, value: 1.1, easing: 'ease-in-out' }, { time: 4, value: 0.9, easing: 'ease-in-out' }, { time: 6, value: 1, easing: 'ease-in-out' }],
          scaleY: [{ time: 0, value: 0.6, easing: 'ease-out' }, { time: 2, value: 1.1, easing: 'ease-in-out' }, { time: 4, value: 0.9, easing: 'ease-in-out' }, { time: 6, value: 1, easing: 'ease-in-out' }],
          opacity: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 1, value: 0.12, easing: 'ease-out' }],
        }
      },
      {
        id: 'ps_badge', name: 'Badge', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 260, y: 235, width: 130, height: 34, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#f97316', stroke: 'transparent', strokeWidth: 0, borderRadius: 17 },
        keyframes: {
          opacity: [{ time: 0.4, value: 0, easing: 'ease-out' }, { time: 0.9, value: 1, easing: 'ease-out' }],
          x: [{ time: 0.4, value: 230, easing: 'ease-out' }, { time: 0.9, value: 260, easing: 'ease-out' }],
        }
      },
      {
        id: 'ps_badge_text', name: 'Badge Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 260, y: 235, width: 130, height: 34, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'NEW LAUNCH', fontSize: 11, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 2 },
        keyframes: {
          opacity: [{ time: 0.6, value: 0, easing: 'ease-out' }, { time: 1, value: 1, easing: 'ease-out' }],
        }
      },
      {
        id: 'ps_headline', name: 'Product Name', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 260, y: 320, width: 580, height: 200, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Introducing\nPro X', fontSize: 74, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#ffffff', textAlign: 'left', letterSpacing: -1 },
        keyframes: {
          opacity: [{ time: 0.7, value: 0, easing: 'ease-out' }, { time: 1.4, value: 1, easing: 'ease-out' }],
          y: [{ time: 0.7, value: 340, easing: 'ease-out' }, { time: 1.4, value: 320, easing: 'ease-out' }],
        }
      },
      {
        id: 'ps_desc', name: 'Description', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 260, y: 490, width: 500, height: 60, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Redefine what\'s possible. Available now.', fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#888888', textAlign: 'left', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 1.2, value: 0, easing: 'ease-out' }, { time: 1.9, value: 1, easing: 'ease-out' }],
          y: [{ time: 1.2, value: 510, easing: 'ease-out' }, { time: 1.9, value: 490, easing: 'ease-out' }],
        }
      },
      {
        id: 'ps_cta', name: 'CTA Button', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 318, y: 566, width: 160, height: 48, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#f97316', stroke: 'transparent', strokeWidth: 0, borderRadius: 8 },
        keyframes: {
          opacity: [{ time: 1.8, value: 0, easing: 'ease-out' }, { time: 2.4, value: 1, easing: 'ease-out' }],
          scaleX: [{ time: 1.8, value: 0.8, easing: 'spring' }, { time: 2.4, value: 1, easing: 'spring' }],
          scaleY: [{ time: 1.8, value: 0.8, easing: 'spring' }, { time: 2.4, value: 1, easing: 'spring' }],
        }
      },
      {
        id: 'ps_cta_text', name: 'CTA Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 318, y: 566, width: 160, height: 48, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Shop Now →', fontSize: 15, fontFamily: 'Inter, sans-serif', fontWeight: '600', color: '#ffffff', textAlign: 'center', letterSpacing: 0.5 },
        keyframes: {
          opacity: [{ time: 2.2, value: 0, easing: 'ease-out' }, { time: 2.7, value: 1, easing: 'ease-out' }],
        }
      },
    ]
  },

  // ─── 9. Event Promo ──────────────────────────────────────────────────────
  {
    id: 'preset_event',
    name: 'Event Promo Card',
    duration: 7,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#0d0221',
    layers: [
      {
        id: 'ev_bg1', name: 'BG Shape 1', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 900, y: 150, width: 700, height: 700, rotation: 30, opacity: 0.08, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#ec4899', stroke: 'transparent', strokeWidth: 0, borderRadius: 60 },
        keyframes: {
          rotation: [{ time: 0, value: 30, easing: 'linear' }, { time: 7, value: 90, easing: 'linear' }],
          scaleX: [{ time: 0, value: 0.5, easing: 'ease-out' }, { time: 1.5, value: 1, easing: 'ease-out' }],
          scaleY: [{ time: 0, value: 0.5, easing: 'ease-out' }, { time: 1.5, value: 1, easing: 'ease-out' }],
          opacity: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 1.5, value: 0.08, easing: 'ease-out' }],
        }
      },
      {
        id: 'ev_bg2', name: 'BG Shape 2', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 300, y: 600, width: 500, height: 500, rotation: -15, opacity: 0.06, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#8b5cf6', stroke: 'transparent', strokeWidth: 0, borderRadius: 50 },
        keyframes: {
          rotation: [{ time: 0, value: -15, easing: 'linear' }, { time: 7, value: -60, easing: 'linear' }],
        }
      },
      {
        id: 'ev_date_box', name: 'Date Box', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 175, y: 280, width: 120, height: 120, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#ec4899', stroke: 'transparent', strokeWidth: 0, borderRadius: 16 },
        keyframes: {
          opacity: [{ time: 0.4, value: 0, easing: 'spring' }, { time: 1, value: 1, easing: 'spring' }],
          scaleX: [{ time: 0.4, value: 0, easing: 'spring' }, { time: 1, value: 1, easing: 'spring' }],
          scaleY: [{ time: 0.4, value: 0, easing: 'spring' }, { time: 1, value: 1, easing: 'spring' }],
        }
      },
      {
        id: 'ev_date_num', name: 'Date Number', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 175, y: 268, width: 120, height: 70, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '28', fontSize: 52, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.8, value: 0, easing: 'ease-out' }, { time: 1.3, value: 1, easing: 'ease-out' }],
        }
      },
      {
        id: 'ev_date_month', name: 'Month', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 175, y: 322, width: 120, height: 30, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'JUN', fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 4 },
        keyframes: {
          opacity: [{ time: 0.9, value: 0, easing: 'ease-out' }, { time: 1.4, value: 1, easing: 'ease-out' }],
        }
      },
      {
        id: 'ev_title', name: 'Event Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 680, y: 310, width: 900, height: 160, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'DESIGN\nSUMMIT', fontSize: 88, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 8 },
        keyframes: {
          opacity: [{ time: 0.8, value: 0, easing: 'ease-out' }, { time: 1.6, value: 1, easing: 'ease-out' }],
          y: [{ time: 0.8, value: 340, easing: 'ease-out' }, { time: 1.6, value: 310, easing: 'ease-out' }],
        }
      },
      {
        id: 'ev_loc', name: 'Location', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 680, y: 450, width: 700, height: 40, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '📍 Dubai World Trade Centre', fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#ec4899', textAlign: 'center', letterSpacing: 1 },
        keyframes: {
          opacity: [{ time: 1.4, value: 0, easing: 'ease-out' }, { time: 2, value: 1, easing: 'ease-out' }],
        }
      },
    ]
  },

  // ─── 10. Stats / Data Reveal ─────────────────────────────────────────────
  {
    id: 'preset_stats',
    name: 'Stats Data Reveal',
    duration: 6,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#f8fafc',
    layers: [
      {
        id: 'st_header_bg', name: 'Header BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 80, width: 1280, height: 140, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#0f172a', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {
          scaleX: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 0.8, value: 1, easing: 'ease-out' }],
        }
      },
      {
        id: 'st_header', name: 'Header Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 80, width: 1000, height: 60, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'QUARTERLY PERFORMANCE', fontSize: 28, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 4 },
        keyframes: {
          opacity: [{ time: 0.6, value: 0, easing: 'ease-out' }, { time: 1.1, value: 1, easing: 'ease-out' }],
        }
      },
      {
        id: 'st_box1', name: 'Stat Box 1', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 210, y: 430, width: 280, height: 200, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#ffffff', stroke: '#e2e8f0', strokeWidth: 1, borderRadius: 16 },
        keyframes: {
          opacity: [{ time: 0.8, value: 0, easing: 'ease-out' }, { time: 1.3, value: 1, easing: 'ease-out' }],
          y: [{ time: 0.8, value: 460, easing: 'ease-out' }, { time: 1.3, value: 430, easing: 'ease-out' }],
        }
      },
      {
        id: 'st_num1', name: 'Stat 1 Value', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 210, y: 406, width: 280, height: 80, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '$2.4M', fontSize: 54, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#0f172a', textAlign: 'center', letterSpacing: -1 },
        keyframes: {
          opacity: [{ time: 1.1, value: 0, easing: 'ease-out' }, { time: 1.6, value: 1, easing: 'ease-out' }],
        }
      },
      {
        id: 'st_label1', name: 'Stat 1 Label', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 210, y: 468, width: 280, height: 40, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Total Revenue', fontSize: 15, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#64748b', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 1.3, value: 0, easing: 'ease-out' }, { time: 1.8, value: 1, easing: 'ease-out' }],
        }
      },
      {
        id: 'st_box2', name: 'Stat Box 2', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 430, width: 280, height: 200, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 16 },
        keyframes: {
          opacity: [{ time: 1.2, value: 0, easing: 'ease-out' }, { time: 1.7, value: 1, easing: 'ease-out' }],
          y: [{ time: 1.2, value: 460, easing: 'ease-out' }, { time: 1.7, value: 430, easing: 'ease-out' }],
        }
      },
      {
        id: 'st_num2', name: 'Stat 2 Value', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 406, width: 280, height: 80, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '+147%', fontSize: 54, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#ffffff', textAlign: 'center', letterSpacing: -1 },
        keyframes: {
          opacity: [{ time: 1.5, value: 0, easing: 'ease-out' }, { time: 2, value: 1, easing: 'ease-out' }],
        }
      },
      {
        id: 'st_label2', name: 'Stat 2 Label', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 468, width: 280, height: 40, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Growth YOY', fontSize: 15, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: 'rgba(255,255,255,0.75)', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 1.7, value: 0, easing: 'ease-out' }, { time: 2.2, value: 1, easing: 'ease-out' }],
        }
      },
      {
        id: 'st_box3', name: 'Stat Box 3', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 1070, y: 430, width: 280, height: 200, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#ffffff', stroke: '#e2e8f0', strokeWidth: 1, borderRadius: 16 },
        keyframes: {
          opacity: [{ time: 1.6, value: 0, easing: 'ease-out' }, { time: 2.1, value: 1, easing: 'ease-out' }],
          y: [{ time: 1.6, value: 460, easing: 'ease-out' }, { time: 2.1, value: 430, easing: 'ease-out' }],
        }
      },
      {
        id: 'st_num3', name: 'Stat 3 Value', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 1070, y: 406, width: 280, height: 80, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '98.4%', fontSize: 54, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#0f172a', textAlign: 'center', letterSpacing: -1 },
        keyframes: {
          opacity: [{ time: 1.9, value: 0, easing: 'ease-out' }, { time: 2.4, value: 1, easing: 'ease-out' }],
        }
      },
      {
        id: 'st_label3', name: 'Stat 3 Label', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 1070, y: 468, width: 280, height: 40, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Satisfaction', fontSize: 15, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#64748b', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 2.1, value: 0, easing: 'ease-out' }, { time: 2.6, value: 1, easing: 'ease-out' }],
        }
      },
    ]
  },
];
