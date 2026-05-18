/**
 * 20 Premium Templates — complex animations, 3D effects, advanced motion
 * All fields fully editable via schema quick-edit + property panel.
 */
export const PREMIUM_TEMPLATES = [

  // ── 1. 3D Card Flip Reveal ───────────────────────────────────────────────
  {
    id: 'prm_3d_card_flip',
    name: '3D Card Flip',
    category: '3D',
    duration: 5,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#0a0a18',
    schema: [
      { id: 'frontTitle',  label: 'Front Title',    layerId: 'cf_front_title', property: 'text'  },
      { id: 'backTitle',   label: 'Back Title',     layerId: 'cf_back_title',  property: 'text'  },
      { id: 'backSub',     label: 'Back Subtitle',  layerId: 'cf_back_sub',    property: 'text'  },
      { id: 'cardColor',   label: 'Card Color',     layerId: 'cf_back_bg',     property: 'fill'  },
    ],
    layers: [
      // Ambient glow
      { id: 'cf_glow', name: 'Ambient Glow', type: 'shape', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 640, y: 360, width: 700, height: 700, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 0, perspective: 800 },
        keyframes: { opacity: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 1.5, value: 0.1, easing: 'ease-out' }, { time: 3, value: 0.18, easing: 'ease-in-out' }], scaleX: [{ time: 0, value: 0.4, easing: 'ease-out' }, { time: 3, value: 1.2, easing: 'ease-in-out' }], scaleY: [{ time: 0, value: 0.4, easing: 'ease-out' }, { time: 3, value: 1.2, easing: 'ease-in-out' }] }
      },
      // Card shadow
      { id: 'cf_shadow', name: 'Card Shadow', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 648, y: 372, width: 500, height: 340, rotation: 0, opacity: 0, scaleX: 1, scaleY: 0.15, shapeType: 'rectangle', fill: '#000000', stroke: 'transparent', strokeWidth: 0, borderRadius: 30, perspective: 800 },
        keyframes: { opacity: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 1.2, value: 0.5, easing: 'ease-out' }], scaleY: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 1.2, value: 0.18, easing: 'ease-out' }] }
      },
      // Front face
      { id: 'cf_front_bg', name: 'Front Card BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 500, height: 320, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#1e1b4b', stroke: '#4f46e5', strokeWidth: 1.5, borderRadius: 20, rotateY: 0, perspective: 900 },
        keyframes: { opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.8, value: 1, easing: 'ease-out' }], scaleX: [{ time: 0.3, value: 0.6, easing: 'spring' }, { time: 0.9, value: 1, easing: 'spring' }], scaleY: [{ time: 0.3, value: 0.6, easing: 'spring' }, { time: 0.9, value: 1, easing: 'spring' }], rotateY: [{ time: 1.5, value: 0, easing: 'ease-in-out' }, { time: 2.5, value: 90, easing: 'ease-in' }] }
      },
      { id: 'cf_front_deco', name: 'Front Deco Ring', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 310, width: 80, height: 80, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: 'transparent', stroke: '#818cf8', strokeWidth: 2, borderRadius: 0, rotateY: 0, perspective: 900 },
        keyframes: { opacity: [{ time: 0.8, value: 0, easing: 'ease-out' }, { time: 1.2, value: 1, easing: 'ease-out' }, { time: 2.4, value: 1, easing: 'ease-in' }, { time: 2.5, value: 0, easing: 'ease-in' }], rotation: [{ time: 0, value: 0, easing: 'linear' }, { time: 5, value: 360, easing: 'linear' }] }
      },
      { id: 'cf_front_title', name: 'Front Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 375, width: 460, height: 80, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'MOTION\nSTUDIO', fontSize: 54, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 4, rotateY: 0, perspective: 900 },
        keyframes: { opacity: [{ time: 1, value: 0, easing: 'ease-out' }, { time: 1.5, value: 1, easing: 'ease-out' }, { time: 2.3, value: 1, easing: 'ease-in' }, { time: 2.5, value: 0, easing: 'ease-in' }] }
      },
      // Back face (appears at rotateY 270 = -90)
      { id: 'cf_back_bg', name: 'Back Card BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 500, height: 320, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#4f46e5', stroke: '#818cf8', strokeWidth: 1.5, borderRadius: 20, rotateY: -90, perspective: 900 },
        keyframes: { opacity: [{ time: 2.4, value: 0, easing: 'linear' }, { time: 2.6, value: 1, easing: 'linear' }], rotateY: [{ time: 2.5, value: -90, easing: 'ease-out' }, { time: 3.5, value: 0, easing: 'ease-out' }] }
      },
      { id: 'cf_back_title', name: 'Back Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 330, width: 460, height: 70, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Create Anything', fontSize: 42, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#ffffff', textAlign: 'center', letterSpacing: 1, rotateY: -90, perspective: 900 },
        keyframes: { opacity: [{ time: 3, value: 0, easing: 'ease-out' }, { time: 3.5, value: 1, easing: 'ease-out' }], rotateY: [{ time: 2.5, value: -90, easing: 'ease-out' }, { time: 3.5, value: 0, easing: 'ease-out' }] }
      },
      { id: 'cf_back_sub', name: 'Back Subtitle', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 400, width: 420, height: 60, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'AI-powered motion graphics\nin seconds, not hours.', fontSize: 20, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: 'rgba(255,255,255,0.85)', textAlign: 'center', letterSpacing: 0, rotateY: -90, perspective: 900 },
        keyframes: { opacity: [{ time: 3.3, value: 0, easing: 'ease-out' }, { time: 3.8, value: 1, easing: 'ease-out' }], rotateY: [{ time: 2.5, value: -90, easing: 'ease-out' }, { time: 3.5, value: 0, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 2. Neon Sign Flicker ─────────────────────────────────────────────────
  {
    id: 'prm_neon_sign',
    name: 'Neon Sign Flicker',
    category: 'Neon',
    duration: 6,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#050508',
    schema: [
      { id: 'signText',  label: 'Sign Text',   layerId: 'ns_text_main', property: 'text'  },
      { id: 'neonColor', label: 'Neon Color',  layerId: 'ns_glow_pink', property: 'fill'  },
      { id: 'subText',   label: 'Sub Text',    layerId: 'ns_sub',       property: 'text'  },
    ],
    layers: [
      // Wall texture
      { id: 'ns_wall', name: 'Wall', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 1280, height: 720, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#0a0a0f', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {}
      },
      // Pink neon glow (wide blur)
      { id: 'ns_glow_pink', name: 'Neon Glow Wide', type: 'shape', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 640, y: 330, width: 900, height: 200, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#ff2d78', stroke: 'transparent', strokeWidth: 0, borderRadius: 100, blur: 28 },
        keyframes: { opacity: [{ time: 0.8, value: 0, easing: 'linear' }, { time: 0.85, value: 0.35, easing: 'linear' }, { time: 0.9, value: 0.1, easing: 'linear' }, { time: 0.95, value: 0.35, easing: 'linear' }, { time: 1.2, value: 0.4, easing: 'linear' }, { time: 1.25, value: 0.05, easing: 'linear' }, { time: 1.3, value: 0.4, easing: 'linear' }, { time: 2, value: 0.45, easing: 'linear' }, { time: 3.5, value: 0.3, easing: 'ease-in-out' }, { time: 5, value: 0.45, easing: 'ease-in-out' } ] }
      },
      // Neon tube outline
      { id: 'ns_tube', name: 'Neon Tube', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 330, width: 820, height: 130, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: 'transparent', stroke: '#ff2d78', strokeWidth: 3, borderRadius: 65 },
        keyframes: { opacity: [{ time: 0.8, value: 0, easing: 'linear' }, { time: 0.85, value: 0.8, easing: 'linear' }, { time: 0.9, value: 0.2, easing: 'linear' }, { time: 0.95, value: 0.8, easing: 'linear' }, { time: 1.2, value: 0.9, easing: 'linear' }, { time: 1.25, value: 0.2, easing: 'linear' }, { time: 1.3, value: 0.9, easing: 'linear' }, { time: 2, value: 1, easing: 'linear' } ] }
      },
      // Main text
      { id: 'ns_text_main', name: 'Neon Text', type: 'text', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 640, y: 330, width: 820, height: 130, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'OPEN', fontSize: 110, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#ff9fc9', textAlign: 'center', letterSpacing: 14 },
        keyframes: { opacity: [{ time: 0.8, value: 0, easing: 'linear' }, { time: 0.85, value: 0.9, easing: 'linear' }, { time: 0.9, value: 0.3, easing: 'linear' }, { time: 0.95, value: 0.9, easing: 'linear' }, { time: 1.2, value: 1, easing: 'linear' }, { time: 1.25, value: 0.2, easing: 'linear' }, { time: 1.3, value: 1, easing: 'linear' }, { time: 2, value: 1, easing: 'linear' } ] }
      },
      // Blue secondary glow
      { id: 'ns_glow_blue', name: 'Blue Glow', type: 'shape', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 640, y: 480, width: 500, height: 80, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#00d4ff', stroke: 'transparent', strokeWidth: 0, borderRadius: 40, blur: 20 },
        keyframes: { opacity: [{ time: 1.8, value: 0, easing: 'linear' }, { time: 1.85, value: 0.4, easing: 'linear' }, { time: 2.2, value: 0.45, easing: 'linear' }, { time: 2.25, value: 0.1, easing: 'linear' }, { time: 2.3, value: 0.45, easing: 'linear' }, { time: 2.6, value: 0.5, easing: 'linear' }] }
      },
      { id: 'ns_sub', name: 'Sub Text', type: 'text', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 640, y: 480, width: 500, height: 60, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '24 hours', fontSize: 40, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#80eaff', textAlign: 'center', letterSpacing: 6 },
        keyframes: { opacity: [{ time: 1.8, value: 0, easing: 'linear' }, { time: 1.85, value: 0.9, easing: 'linear' }, { time: 2.2, value: 1, easing: 'linear' }, { time: 2.25, value: 0.1, easing: 'linear' }, { time: 2.3, value: 1, easing: 'linear' }] }
      },
      // Floor reflection
      { id: 'ns_reflect', name: 'Floor Reflection', type: 'text', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 640, y: 590, width: 820, height: 130, rotation: 180, opacity: 0, scaleX: 1, scaleY: 0.3, text: 'OPEN', fontSize: 110, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#ff2d78', textAlign: 'center', letterSpacing: 14, blur: 3 },
        keyframes: { opacity: [{ time: 2, value: 0, easing: 'ease-out' }, { time: 2.5, value: 0.15, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 3. Kinetic Word Burst ────────────────────────────────────────────────
  {
    id: 'prm_kinetic_burst',
    name: 'Kinetic Word Burst',
    category: 'Kinetic',
    duration: 5,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#09090b',
    schema: [
      { id: 'word1', label: 'Word 1', layerId: 'kb_w1', property: 'text' },
      { id: 'word2', label: 'Word 2', layerId: 'kb_w2', property: 'text' },
      { id: 'word3', label: 'Word 3', layerId: 'kb_w3', property: 'text' },
      { id: 'accent1', label: 'Color 1', layerId: 'kb_w1', property: 'color' },
      { id: 'accent2', label: 'Color 2', layerId: 'kb_w2', property: 'color' },
    ],
    layers: [
      { id: 'kb_flash', name: 'Flash', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 1280, height: 720, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#ffffff', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { opacity: [{ time: 0.4, value: 0, easing: 'linear' }, { time: 0.45, value: 0.6, easing: 'linear' }, { time: 0.5, value: 0, easing: 'linear' }] }
      },
      { id: 'kb_w1', name: 'Word 1', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 360, y: 280, width: 480, height: 120, rotation: -8, opacity: 0, scaleX: 0, scaleY: 0, text: 'CREATE', fontSize: 96, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: -2 },
        keyframes: { opacity: [{ time: 0.4, value: 0, easing: 'ease-out' }, { time: 0.6, value: 1, easing: 'ease-out' }], scaleX: [{ time: 0.4, value: 2, easing: 'ease-out' }, { time: 0.7, value: 1, easing: 'ease-out' }], scaleY: [{ time: 0.4, value: 2, easing: 'ease-out' }, { time: 0.7, value: 1, easing: 'ease-out' }], x: [{ time: 0.4, value: 0, easing: 'ease-out' }, { time: 0.7, value: 360, easing: 'ease-out' }], y: [{ time: 0.4, value: 120, easing: 'ease-out' }, { time: 0.7, value: 280, easing: 'ease-out' }] }
      },
      { id: 'kb_w2', name: 'Word 2', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 760, y: 390, width: 460, height: 120, rotation: 5, opacity: 0, scaleX: 0, scaleY: 0, text: 'INSPIRE', fontSize: 96, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#6366f1', textAlign: 'center', letterSpacing: -2 },
        keyframes: { opacity: [{ time: 0.7, value: 0, easing: 'ease-out' }, { time: 0.9, value: 1, easing: 'ease-out' }], scaleX: [{ time: 0.7, value: 2, easing: 'ease-out' }, { time: 1, value: 1, easing: 'ease-out' }], scaleY: [{ time: 0.7, value: 2, easing: 'ease-out' }, { time: 1, value: 1, easing: 'ease-out' }], x: [{ time: 0.7, value: 1280, easing: 'ease-out' }, { time: 1, value: 760, easing: 'ease-out' }] }
      },
      { id: 'kb_w3', name: 'Word 3', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 540, y: 510, width: 600, height: 100, rotation: -3, opacity: 0, scaleX: 0, scaleY: 0, text: 'DOMINATE', fontSize: 72, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#a855f7', textAlign: 'center', letterSpacing: 2 },
        keyframes: { opacity: [{ time: 1, value: 0, easing: 'ease-out' }, { time: 1.2, value: 1, easing: 'ease-out' }], scaleX: [{ time: 1, value: 0.2, easing: 'spring' }, { time: 1.4, value: 1, easing: 'spring' }], scaleY: [{ time: 1, value: 0.2, easing: 'spring' }, { time: 1.4, value: 1, easing: 'spring' }], y: [{ time: 1, value: 620, easing: 'spring' }, { time: 1.4, value: 510, easing: 'spring' }] }
      },
      { id: 'kb_line1', name: 'Accent Line 1', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 345, width: 0, height: 4, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 2 },
        keyframes: { width: [{ time: 0.8, value: 0, easing: 'ease-out' }, { time: 1.3, value: 900, easing: 'ease-out' }], opacity: [{ time: 0.8, value: 0, easing: 'linear' }, { time: 0.85, value: 1, easing: 'linear' }] }
      },
    ]
  },

  // ── 4. 3D Hologram Reveal ────────────────────────────────────────────────
  {
    id: 'prm_hologram',
    name: '3D Hologram',
    category: '3D',
    duration: 6,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#010810',
    schema: [
      { id: 'holoTitle', label: 'Hologram Title', layerId: 'holo_title', property: 'text'  },
      { id: 'holoSub',   label: 'Sub Line',       layerId: 'holo_sub',   property: 'text'  },
      { id: 'holoColor', label: 'Holo Color',     layerId: 'holo_ring1', property: 'stroke' },
    ],
    layers: [
      // Grid floor
      { id: 'holo_grid', name: 'Grid Floor', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 580, width: 1400, height: 300, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: 'transparent', stroke: '#0d3a4a', strokeWidth: 1, borderRadius: 0, rotateX: 70, perspective: 600 },
        keyframes: { opacity: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 1.5, value: 0.6, easing: 'ease-out' }] }
      },
      // Outer rings
      { id: 'holo_ring1', name: 'Outer Ring', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 480, height: 480, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0, shapeType: 'circle', fill: 'transparent', stroke: '#00e5ff', strokeWidth: 1, borderRadius: 0, rotateX: 70, perspective: 700 },
        keyframes: { opacity: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 1, value: 0.5, easing: 'ease-out' }], scaleX: [{ time: 0.5, value: 0, easing: 'spring' }, { time: 1.2, value: 1, easing: 'spring' }], scaleY: [{ time: 0.5, value: 0, easing: 'spring' }, { time: 1.2, value: 1, easing: 'spring' }], rotation: [{ time: 0, value: 0, easing: 'linear' }, { time: 6, value: 360, easing: 'linear' }] }
      },
      { id: 'holo_ring2', name: 'Mid Ring', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 320, height: 320, rotation: 45, opacity: 0, scaleX: 0, scaleY: 0, shapeType: 'circle', fill: 'transparent', stroke: '#00e5ff', strokeWidth: 1.5, borderRadius: 0, rotateX: 60, perspective: 700 },
        keyframes: { opacity: [{ time: 0.7, value: 0, easing: 'ease-out' }, { time: 1.2, value: 0.6, easing: 'ease-out' }], scaleX: [{ time: 0.7, value: 0, easing: 'spring' }, { time: 1.4, value: 1, easing: 'spring' }], scaleY: [{ time: 0.7, value: 0, easing: 'spring' }, { time: 1.4, value: 1, easing: 'spring' }], rotation: [{ time: 0, value: 45, easing: 'linear' }, { time: 6, value: -315, easing: 'linear' }] }
      },
      // Scan line sweep
      { id: 'holo_scan', name: 'Scan Line', type: 'shape', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 640, y: 160, width: 1280, height: 3, rotation: 0, opacity: 0.6, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#00e5ff', stroke: 'transparent', strokeWidth: 0, borderRadius: 0, blur: 2 },
        keyframes: { y: [{ time: 1, value: 160, easing: 'linear' }, { time: 3.5, value: 560, easing: 'linear' }, { time: 5, value: 160, easing: 'linear' }], opacity: [{ time: 0.9, value: 0, easing: 'linear' }, { time: 1, value: 0.6, easing: 'linear' }] }
      },
      // Title
      { id: 'holo_title', name: 'Holo Title', type: 'text', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 640, y: 330, width: 900, height: 140, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'INITIALIZING', fontSize: 80, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#00e5ff', textAlign: 'center', letterSpacing: 12, blur: 0 },
        keyframes: { opacity: [{ time: 1.2, value: 0, easing: 'linear' }, { time: 1.25, value: 0.8, easing: 'linear' }, { time: 1.3, value: 0.2, easing: 'linear' }, { time: 1.35, value: 0.8, easing: 'linear' }, { time: 1.7, value: 1, easing: 'linear' }], scaleY: [{ time: 1.2, value: 0.6, easing: 'ease-out' }, { time: 1.7, value: 1, easing: 'ease-out' }] }
      },
      { id: 'holo_sub', name: 'Sub Text', type: 'text', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 640, y: 430, width: 700, height: 50, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'SYSTEM ONLINE — ALL MODULES ACTIVE', fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#80f0ff', textAlign: 'center', letterSpacing: 5 },
        keyframes: { opacity: [{ time: 2, value: 0, easing: 'ease-out' }, { time: 2.6, value: 1, easing: 'ease-out' }] }
      },
      { id: 'holo_bar', name: 'Loading Bar BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 490, width: 500, height: 4, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#0d3a4a', stroke: 'transparent', strokeWidth: 0, borderRadius: 2 },
        keyframes: { opacity: [{ time: 2.4, value: 0, easing: 'linear' }, { time: 2.5, value: 1, easing: 'linear' }] }
      },
      { id: 'holo_bar_fill', name: 'Loading Bar Fill', type: 'shape', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 390, y: 490, width: 0, height: 4, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#00e5ff', stroke: 'transparent', strokeWidth: 0, borderRadius: 2 },
        keyframes: { width: [{ time: 2.5, value: 0, easing: 'ease-out' }, { time: 4.5, value: 500, easing: 'ease-out' }], x: [{ time: 2.5, value: 390, easing: 'ease-out' }, { time: 4.5, value: 640, easing: 'ease-out' }], opacity: [{ time: 2.4, value: 0, easing: 'linear' }, { time: 2.5, value: 1, easing: 'linear' }] }
      },
    ]
  },

  // ── 5. Staggered Word Drop ───────────────────────────────────────────────
  {
    id: 'prm_word_drop',
    name: 'Staggered Word Drop',
    category: 'Kinetic',
    duration: 5,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#0c0c14',
    schema: [
      { id: 'line1w1', label: 'Line 1 Word 1', layerId: 'wd_l1w1', property: 'text' },
      { id: 'line1w2', label: 'Line 1 Word 2', layerId: 'wd_l1w2', property: 'text' },
      { id: 'line2',   label: 'Line 2',        layerId: 'wd_l2',   property: 'text' },
      { id: 'accent',  label: 'Accent Color',  layerId: 'wd_l1w2', property: 'color'},
    ],
    layers: [
      ...['THE','FUTURE'].map((word, i) => ({
        id: `wd_l1w${i+1}`, name: `Word ${i+1}`, type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: i === 0 ? 380 : 760, y: 300, width: 380, height: 120, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: word, fontSize: 100, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: i === 0 ? '#ffffff' : '#6366f1', textAlign: 'center', letterSpacing: -2 },
        keyframes: {
          opacity: [{ time: i*0.2 + 0.3, value: 0, easing: 'ease-out' }, { time: i*0.2 + 0.7, value: 1, easing: 'ease-out' }],
          y:       [{ time: i*0.2 + 0.3, value: 160, easing: 'spring'  }, { time: i*0.2 + 0.8, value: 300, easing: 'spring' }],
          scaleY:  [{ time: i*0.2 + 0.3, value: 0.2, easing: 'spring'  }, { time: i*0.2 + 0.8, value: 1,   easing: 'spring' }],
        },
      })),
      { id: 'wd_l2', name: 'Line 2', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 440, width: 900, height: 90, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'IS ALREADY HERE', fontSize: 60, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#888888', textAlign: 'center', letterSpacing: 8 },
        keyframes: { opacity: [{ time: 0.9, value: 0, easing: 'ease-out' }, { time: 1.4, value: 1, easing: 'ease-out' }], y: [{ time: 0.9, value: 500, easing: 'spring' }, { time: 1.4, value: 440, easing: 'spring' }] }
      },
      { id: 'wd_accent_line', name: 'Accent Line', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 388, width: 0, height: 3, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 1.5 },
        keyframes: { width: [{ time: 0.7, value: 0, easing: 'ease-out' }, { time: 1.3, value: 700, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 6. Tech HUD Display ──────────────────────────────────────────────────
  {
    id: 'prm_hud',
    name: 'Tech HUD Display',
    category: '3D',
    duration: 6,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#020b14',
    schema: [
      { id: 'hudTitle', label: 'Title',       layerId: 'hud_title', property: 'text'  },
      { id: 'stat1',    label: 'Stat Value 1',layerId: 'hud_s1',    property: 'text'  },
      { id: 'stat2',    label: 'Stat Value 2',layerId: 'hud_s2',    property: 'text'  },
      { id: 'accent',   label: 'HUD Color',   layerId: 'hud_corner_tl', property: 'stroke' },
    ],
    layers: [
      // Corner brackets
      ...[ ['hud_corner_tl', 160, 160, 0],   ['hud_corner_tr', 1120, 160, 90],
           ['hud_corner_bl', 160, 560, 270],  ['hud_corner_br', 1120, 560, 180] ].map(([id, x, y, rot]) => ({
        id, name: id, type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x, y, width: 60, height: 60, rotation: rot, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: 'transparent', stroke: '#00bcd4', strokeWidth: 2, borderRadius: 0 },
        keyframes: { opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.8, value: 1, easing: 'ease-out' }], scaleX: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.7, value: 1, easing: 'ease-out' }], scaleY: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.7, value: 1, easing: 'ease-out' }] }
      })),
      // Horizontal scan lines
      { id: 'hud_line_t', name: 'Top Line', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 160, width: 0, height: 1, rotation: 0, opacity: 0.7, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#00bcd4', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { width: [{ time: 0.4, value: 0, easing: 'ease-out' }, { time: 1, value: 960, easing: 'ease-out' }] }
      },
      { id: 'hud_line_b', name: 'Bottom Line', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 560, width: 0, height: 1, rotation: 0, opacity: 0.7, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#00bcd4', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { width: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 1.1, value: 960, easing: 'ease-out' }] }
      },
      // Center cross
      { id: 'hud_cross_h', name: 'Cross H', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 0, height: 1, rotation: 0, opacity: 0.25, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#00bcd4', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { width: [{ time: 0.8, value: 0, easing: 'ease-out' }, { time: 1.4, value: 960, easing: 'ease-out' }] }
      },
      { id: 'hud_cross_v', name: 'Cross V', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 1, height: 0, rotation: 0, opacity: 0.25, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#00bcd4', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { height: [{ time: 0.8, value: 0, easing: 'ease-out' }, { time: 1.4, value: 400, easing: 'ease-out' }] }
      },
      // Title
      { id: 'hud_title', name: 'Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 310, width: 800, height: 80, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'MISSION CONTROL', fontSize: 62, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 8 },
        keyframes: { opacity: [{ time: 1, value: 0, easing: 'ease-out' }, { time: 1.5, value: 1, easing: 'ease-out' }] }
      },
      // Stats
      { id: 'hud_s1', name: 'Stat 1', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 310, y: 420, width: 200, height: 60, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '99.9%', fontSize: 36, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#00e5ff', textAlign: 'center', letterSpacing: 2 },
        keyframes: { opacity: [{ time: 1.5, value: 0, easing: 'ease-out' }, { time: 2, value: 1, easing: 'ease-out' }] }
      },
      { id: 'hud_s1_lbl', name: 'Stat 1 Label', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 310, y: 455, width: 200, height: 30, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'UPTIME', fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#5eead4', textAlign: 'center', letterSpacing: 4 },
        keyframes: { opacity: [{ time: 1.7, value: 0, easing: 'ease-out' }, { time: 2.2, value: 1, easing: 'ease-out' }] }
      },
      { id: 'hud_s2', name: 'Stat 2', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 970, y: 420, width: 200, height: 60, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '4.2 PB', fontSize: 36, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#00e5ff', textAlign: 'center', letterSpacing: 2 },
        keyframes: { opacity: [{ time: 1.8, value: 0, easing: 'ease-out' }, { time: 2.3, value: 1, easing: 'ease-out' }] }
      },
      { id: 'hud_s2_lbl', name: 'Stat 2 Label', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 970, y: 455, width: 200, height: 30, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'DATA PROCESSED', fontSize: 12, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#5eead4', textAlign: 'center', letterSpacing: 4 },
        keyframes: { opacity: [{ time: 2, value: 0, easing: 'ease-out' }, { time: 2.5, value: 1, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 7. 3D Perspective Zoom ────────────────────────────────────────────────
  {
    id: 'prm_perspective_zoom',
    name: '3D Perspective Zoom',
    category: '3D',
    duration: 5,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#000000',
    schema: [
      { id: 'bigTitle', label: 'Main Title',   layerId: 'pz_title',  property: 'text'  },
      { id: 'subTitle', label: 'Subtitle',     layerId: 'pz_sub',    property: 'text'  },
      { id: 'titleClr', label: 'Title Color',  layerId: 'pz_title',  property: 'color' },
    ],
    layers: [
      { id: 'pz_lines', name: 'Perspective Grid', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 560, width: 2000, height: 400, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: 'transparent', stroke: '#1a1a2e', strokeWidth: 1, borderRadius: 0, rotateX: 75, perspective: 500 },
        keyframes: { opacity: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 1, value: 0.8, easing: 'ease-out' }] }
      },
      { id: 'pz_title', name: 'Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 1100, height: 200, rotation: 0, opacity: 0, scaleX: 4, scaleY: 4, text: 'BEYOND', fontSize: 130, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 20, rotateX: 25, perspective: 600, blur: 8 },
        keyframes: {
          opacity:  [{ time: 0.2, value: 0, easing: 'ease-out' }, { time: 0.6, value: 1, easing: 'ease-out' }],
          scaleX:   [{ time: 0.2, value: 4, easing: 'ease-out' }, { time: 1.4, value: 1, easing: 'ease-out' }],
          scaleY:   [{ time: 0.2, value: 4, easing: 'ease-out' }, { time: 1.4, value: 1, easing: 'ease-out' }],
          rotateX:  [{ time: 0.2, value: 40, easing: 'ease-out' }, { time: 1.4, value: 0, easing: 'ease-out' }],
          blur:     [{ time: 0.2, value: 12, easing: 'ease-out' }, { time: 1.4, value: 0, easing: 'ease-out' }],
        }
      },
      { id: 'pz_sub', name: 'Subtitle', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 470, width: 800, height: 60, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'the limits of imagination', fontSize: 28, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#888888', textAlign: 'center', letterSpacing: 4 },
        keyframes: { opacity: [{ time: 1.5, value: 0, easing: 'ease-out' }, { time: 2.1, value: 1, easing: 'ease-out' }], y: [{ time: 1.5, value: 500, easing: 'ease-out' }, { time: 2.1, value: 470, easing: 'ease-out' }] }
      },
      { id: 'pz_line', name: 'Underline', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 430, width: 0, height: 2, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 1 },
        keyframes: { width: [{ time: 1.2, value: 0, easing: 'ease-out' }, { time: 1.9, value: 500, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 8. Retro VHS Glitch ──────────────────────────────────────────────────
  {
    id: 'prm_vhs_glitch',
    name: 'Retro VHS Glitch',
    category: 'Glitch',
    duration: 5,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#000000',
    schema: [
      { id: 'mainTitle', label: 'Main Title',  layerId: 'vhs_title_w', property: 'text' },
      { id: 'year',      label: 'Year/Stamp',  layerId: 'vhs_stamp',   property: 'text' },
    ],
    layers: [
      // Static noise overlay
      { id: 'vhs_static', name: 'Static', type: 'shape', visible: true, locked: false, blendMode: 'overlay',
        properties: { x: 640, y: 360, width: 1280, height: 720, rotation: 0, opacity: 0.04, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#ffffff', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { scaleY: [{ time: 0, value: 1, easing: 'linear' }, { time: 0.5, value: 1.02, easing: 'linear' }, { time: 1, value: 0.99, easing: 'linear' }, { time: 1.5, value: 1.01, easing: 'linear' }, { time: 2, value: 1, easing: 'linear' }] }
      },
      // Red channel
      { id: 'vhs_title_r', name: 'Title (Red)', type: 'text', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 648, y: 355, width: 1100, height: 160, rotation: 0, opacity: 0.7, scaleX: 1, scaleY: 1, text: 'REWIND', fontSize: 150, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ff0000', textAlign: 'center', letterSpacing: 8 },
        keyframes: { opacity: [{ time: 0, value: 0, easing: 'linear' }, { time: 0.5, value: 0.7, easing: 'linear' }], x: [{ time: 0.5, value: 648, easing: 'linear' }, { time: 0.55, value: 665, easing: 'linear' }, { time: 0.6, value: 640, easing: 'linear' }, { time: 1.2, value: 640, easing: 'linear' }, { time: 1.25, value: 658, easing: 'linear' }, { time: 1.3, value: 640, easing: 'linear' }, { time: 2.5, value: 640, easing: 'linear' }, { time: 2.52, value: 660, easing: 'linear' }, { time: 2.54, value: 640, easing: 'linear' }] }
      },
      // Blue channel
      { id: 'vhs_title_b', name: 'Title (Cyan)', type: 'text', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 630, y: 365, width: 1100, height: 160, rotation: 0, opacity: 0.7, scaleX: 1, scaleY: 1, text: 'REWIND', fontSize: 150, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#00ffff', textAlign: 'center', letterSpacing: 8 },
        keyframes: { opacity: [{ time: 0, value: 0, easing: 'linear' }, { time: 0.5, value: 0.7, easing: 'linear' }], x: [{ time: 0.5, value: 630, easing: 'linear' }, { time: 0.55, value: 614, easing: 'linear' }, { time: 0.6, value: 630, easing: 'linear' }, { time: 1.2, value: 630, easing: 'linear' }, { time: 1.25, value: 615, easing: 'linear' }, { time: 1.3, value: 630, easing: 'linear' }] }
      },
      // White main
      { id: 'vhs_title_w', name: 'Title (White)', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 1100, height: 160, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'REWIND', fontSize: 150, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 8 },
        keyframes: { opacity: [{ time: 0, value: 0, easing: 'linear' }, { time: 0.5, value: 1, easing: 'linear' }] }
      },
      // Scanlines
      { id: 'vhs_scan1', name: 'Glitch Bar 1', type: 'shape', visible: true, locked: false, blendMode: 'overlay',
        properties: { x: 640, y: 360, width: 1280, height: 6, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#ffffff', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { opacity: [{ time: 0.5, value: 0, easing: 'linear' }, { time: 0.55, value: 0.5, easing: 'linear' }, { time: 0.6, value: 0, easing: 'linear' }, { time: 1.8, value: 0, easing: 'linear' }, { time: 1.82, value: 0.4, easing: 'linear' }, { time: 1.84, value: 0, easing: 'linear' }], y: [{ time: 0, value: 200, easing: 'linear' }, { time: 0.55, value: 420, easing: 'linear' }, { time: 1, value: 300, easing: 'linear' }, { time: 1.82, value: 480, easing: 'linear' }] }
      },
      // VHS timestamp
      { id: 'vhs_stamp', name: 'VHS Stamp', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 1100, y: 88, width: 280, height: 36, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, text: '● REC  00:00:00', fontSize: 16, fontFamily: 'Courier New, monospace', fontWeight: '700', color: '#ff4444', textAlign: 'center', letterSpacing: 1 },
        keyframes: { opacity: [{ time: 0, value: 0, easing: 'linear' }, { time: 0.5, value: 1, easing: 'linear' }, { time: 1.2, value: 0, easing: 'linear' }, { time: 1.5, value: 1, easing: 'linear' }, { time: 2.2, value: 0, easing: 'linear' }, { time: 2.5, value: 1, easing: 'linear' }] }
      },
    ]
  },

  // ── 9. Split Screen 3D ───────────────────────────────────────────────────
  {
    id: 'prm_split_3d',
    name: '3D Split Screen',
    category: '3D',
    duration: 6,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#000000',
    schema: [
      { id: 'leftTitle',  label: 'Left Title',   layerId: 'ss3_ltxt', property: 'text' },
      { id: 'rightTitle', label: 'Right Title',  layerId: 'ss3_rtxt', property: 'text' },
      { id: 'leftColor',  label: 'Left Color',   layerId: 'ss3_lpan', property: 'fill' },
      { id: 'rightColor', label: 'Right Color',  layerId: 'ss3_rpan', property: 'fill' },
    ],
    layers: [
      { id: 'ss3_lpan', name: 'Left Panel', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 320, y: 360, width: 640, height: 720, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#1e1b4b', stroke: 'transparent', strokeWidth: 0, borderRadius: 0, rotateY: 0, perspective: 800 },
        keyframes: { rotateY: [{ time: 0, value: 90, easing: 'ease-out' }, { time: 1.2, value: 0, easing: 'ease-out' }], x: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 1.2, value: 320, easing: 'ease-out' }] }
      },
      { id: 'ss3_rpan', name: 'Right Panel', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 360, width: 640, height: 720, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#312e81', stroke: 'transparent', strokeWidth: 0, borderRadius: 0, rotateY: 0, perspective: 800 },
        keyframes: { rotateY: [{ time: 0.2, value: -90, easing: 'ease-out' }, { time: 1.4, value: 0, easing: 'ease-out' }], x: [{ time: 0.2, value: 1280, easing: 'ease-out' }, { time: 1.4, value: 960, easing: 'ease-out' }] }
      },
      { id: 'ss3_divider', name: 'Center Divide', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 4, height: 720, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#818cf8', stroke: 'transparent', strokeWidth: 0, borderRadius: 2 },
        keyframes: { opacity: [{ time: 1, value: 0, easing: 'ease-out' }, { time: 1.6, value: 1, easing: 'ease-out' }] }
      },
      { id: 'ss3_ltxt', name: 'Left Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 320, y: 360, width: 560, height: 120, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'BEFORE', fontSize: 72, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 8 },
        keyframes: { opacity: [{ time: 1.3, value: 0, easing: 'ease-out' }, { time: 1.9, value: 1, easing: 'ease-out' }] }
      },
      { id: 'ss3_rtxt', name: 'Right Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 360, width: 560, height: 120, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'AFTER', fontSize: 72, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#c7d2fe', textAlign: 'center', letterSpacing: 8 },
        keyframes: { opacity: [{ time: 1.5, value: 0, easing: 'ease-out' }, { time: 2.1, value: 1, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 10. Floating 3D Cards ─────────────────────────────────────────────────
  {
    id: 'prm_floating_cards',
    name: 'Floating 3D Cards',
    category: '3D',
    duration: 7,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#07070f',
    schema: [
      { id: 'card1txt', label: 'Card 1 Text', layerId: 'fc_c1txt', property: 'text' },
      { id: 'card2txt', label: 'Card 2 Text', layerId: 'fc_c2txt', property: 'text' },
      { id: 'card3txt', label: 'Card 3 Text', layerId: 'fc_c3txt', property: 'text' },
      { id: 'card1col', label: 'Card 1 Color', layerId: 'fc_c1bg', property: 'fill' },
      { id: 'card2col', label: 'Card 2 Color', layerId: 'fc_c2bg', property: 'fill' },
    ],
    layers: [
      // Card 1 (left, tilted)
      { id: 'fc_c1bg', name: 'Card 1 BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 280, y: 380, width: 320, height: 220, rotation: -6, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#4f46e5', stroke: 'transparent', strokeWidth: 0, borderRadius: 16, rotateY: -15, perspective: 900 },
        keyframes: { opacity: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 1.1, value: 1, easing: 'ease-out' }], scaleX: [{ time: 0.5, value: 0.6, easing: 'spring' }, { time: 1.2, value: 1, easing: 'spring' }], scaleY: [{ time: 0.5, value: 0.6, easing: 'spring' }, { time: 1.2, value: 1, easing: 'spring' }], y: [{ time: 0, value: 390, easing: 'ease-in-out' }, { time: 3, value: 370, easing: 'ease-in-out' }, { time: 6, value: 390, easing: 'ease-in-out' }, { time: 7, value: 380, easing: 'ease-in-out' }] }
      },
      { id: 'fc_c1txt', name: 'Card 1 Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 280, y: 380, width: 280, height: 60, rotation: -6, opacity: 0, scaleX: 1, scaleY: 1, text: 'Design', fontSize: 32, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 1, rotateY: -15, perspective: 900 },
        keyframes: { opacity: [{ time: 1, value: 0, easing: 'ease-out' }, { time: 1.5, value: 1, easing: 'ease-out' }] }
      },
      // Card 2 (center, front)
      { id: 'fc_c2bg', name: 'Card 2 BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 355, width: 360, height: 240, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#7c3aed', stroke: '#a78bfa', strokeWidth: 1.5, borderRadius: 18, rotateY: 0, perspective: 900 },
        keyframes: { opacity: [{ time: 0.8, value: 0, easing: 'ease-out' }, { time: 1.4, value: 1, easing: 'ease-out' }], scaleX: [{ time: 0.8, value: 0.5, easing: 'spring' }, { time: 1.5, value: 1.05, easing: 'spring' }, { time: 1.8, value: 1, easing: 'spring' }], scaleY: [{ time: 0.8, value: 0.5, easing: 'spring' }, { time: 1.5, value: 1.05, easing: 'spring' }, { time: 1.8, value: 1, easing: 'spring' }], y: [{ time: 0, value: 360, easing: 'ease-in-out' }, { time: 3.5, value: 340, easing: 'ease-in-out' }, { time: 7, value: 360, easing: 'ease-in-out' }] }
      },
      { id: 'fc_c2txt', name: 'Card 2 Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 355, width: 320, height: 60, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Animate', fontSize: 38, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#ffffff', textAlign: 'center', letterSpacing: 2 },
        keyframes: { opacity: [{ time: 1.4, value: 0, easing: 'ease-out' }, { time: 1.9, value: 1, easing: 'ease-out' }] }
      },
      // Card 3 (right)
      { id: 'fc_c3bg', name: 'Card 3 BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 1000, y: 385, width: 300, height: 210, rotation: 6, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#2d1b69', stroke: 'transparent', strokeWidth: 0, borderRadius: 14, rotateY: 15, perspective: 900 },
        keyframes: { opacity: [{ time: 1.1, value: 0, easing: 'ease-out' }, { time: 1.7, value: 1, easing: 'ease-out' }], scaleX: [{ time: 1.1, value: 0.6, easing: 'spring' }, { time: 1.8, value: 1, easing: 'spring' }], scaleY: [{ time: 1.1, value: 0.6, easing: 'spring' }, { time: 1.8, value: 1, easing: 'spring' }], y: [{ time: 0, value: 375, easing: 'ease-in-out' }, { time: 3.5, value: 400, easing: 'ease-in-out' }, { time: 7, value: 375, easing: 'ease-in-out' }] }
      },
      { id: 'fc_c3txt', name: 'Card 3 Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 1000, y: 385, width: 260, height: 60, rotation: 6, opacity: 0, scaleX: 1, scaleY: 1, text: 'Export', fontSize: 28, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#c4b5fd', textAlign: 'center', letterSpacing: 1, rotateY: 15, perspective: 900 },
        keyframes: { opacity: [{ time: 1.6, value: 0, easing: 'ease-out' }, { time: 2.1, value: 1, easing: 'ease-out' }] }
      },
      // Title above
      { id: 'fc_title', name: 'Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 170, width: 900, height: 80, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Everything You Need', fontSize: 52, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#ffffff', textAlign: 'center', letterSpacing: -1 },
        keyframes: { opacity: [{ time: 1.5, value: 0, easing: 'ease-out' }, { time: 2.1, value: 1, easing: 'ease-out' }], y: [{ time: 1.5, value: 200, easing: 'ease-out' }, { time: 2.1, value: 170, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 11. Text Roll Up ─────────────────────────────────────────────────────
  {
    id: 'prm_text_roll',
    name: '3D Text Roll',
    category: '3D',
    duration: 5,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#050505',
    schema: [
      { id: 'rollLine1', label: 'Line 1', layerId: 'tr_l1', property: 'text' },
      { id: 'rollLine2', label: 'Line 2', layerId: 'tr_l2', property: 'text' },
      { id: 'rollLine3', label: 'Line 3', layerId: 'tr_l3', property: 'text' },
    ],
    layers: [
      ...[ ['tr_l1', 'BOLD', 280, 0.3, '#ffffff', 0.5],
           ['tr_l2', 'BRAVE', 380, 0.7, '#6366f1', 0.7],
           ['tr_l3', 'BRILLIANT', 480, 1.1, '#a855f7', 0.9],
      ].map(([id, text, y, t, color, opacity]) => ({
        id, name: text, type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y, width: 1100, height: 120, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text, fontSize: 110, fontFamily: 'Inter, sans-serif', fontWeight: '900', color, textAlign: 'center', letterSpacing: 8, rotateX: 60, perspective: 700 },
        keyframes: {
          opacity:  [{ time: t,       value: 0,   easing: 'ease-out' }, { time: t+0.5, value: 1, easing: 'ease-out' }],
          rotateX:  [{ time: t,       value: 60,  easing: 'ease-out' }, { time: t+0.7, value: 0, easing: 'ease-out' }],
          y:        [{ time: t,       value: y+60,easing: 'ease-out' }, { time: t+0.6, value: y, easing: 'ease-out' }],
          scaleY:   [{ time: t,       value: 0.3, easing: 'ease-out' }, { time: t+0.6, value: 1, easing: 'ease-out' }],
        }
      })),
    ]
  },

  // ── 12. Cinematic Countdown ───────────────────────────────────────────────
  {
    id: 'prm_cinematic_countdown',
    name: 'Cinematic Countdown',
    category: 'Cinematic',
    duration: 7,
    fps: 24,
    width: 1920,
    height: 1080,
    background: '#000000',
    schema: [
      { id: 'showTitle', label: 'Show Title',  layerId: 'cc_title', property: 'text' },
      { id: 'tagline',   label: 'Tagline',     layerId: 'cc_tagline', property: 'text' },
    ],
    layers: [
      // Film grain overlay
      { id: 'cc_vignette', name: 'Vignette', type: 'shape', visible: true, locked: false, blendMode: 'multiply',
        properties: { x: 960, y: 540, width: 1920, height: 1080, rotation: 0, opacity: 0.7, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#000000', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { scaleX: [{ time: 0, value: 0.65, easing: 'linear' }, { time: 7, value: 0.65, easing: 'linear' }], scaleY: [{ time: 0, value: 0.65, easing: 'linear' }, { time: 7, value: 0.65, easing: 'linear' }] }
      },
      // Letterbox
      ...[ { id: 'cc_ltop', y: 70, }, { id: 'cc_lbot', y: 1010 }].map(({ id, y }) => ({
        id, name: 'Letterbox', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y, width: 1920, height: 140, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#000000', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {}
      })),
      // Large number
      { id: 'cc_num', name: 'Countdown Number', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 540, width: 800, height: 500, rotation: 0, opacity: 0, scaleX: 3, scaleY: 3, text: '3', fontSize: 400, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 0, blur: 0 },
        keyframes: { opacity: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 0.8, value: 1, easing: 'ease-out' }, { time: 2, value: 1, easing: 'ease-in' }, { time: 2.3, value: 0, easing: 'ease-in' }], scaleX: [{ time: 0.5, value: 3, easing: 'ease-out' }, { time: 2, value: 0.9, easing: 'linear' }, { time: 2.3, value: 0.5, easing: 'ease-in' }], scaleY: [{ time: 0.5, value: 3, easing: 'ease-out' }, { time: 2, value: 0.9, easing: 'linear' }, { time: 2.3, value: 0.5, easing: 'ease-in' }], blur: [{ time: 0.5, value: 10, easing: 'ease-out' }, { time: 1, value: 0, easing: 'ease-out' }, { time: 2, value: 0, easing: 'ease-in' }, { time: 2.3, value: 6, easing: 'ease-in' }] }
      },
      // Tick line
      { id: 'cc_tick', name: 'Tick Line', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 540, width: 1920, height: 1, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#ffffff', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { opacity: [{ time: 2.3, value: 0, easing: 'linear' }, { time: 2.35, value: 0.4, easing: 'linear' }, { time: 2.4, value: 0, easing: 'linear' }] }
      },
      { id: 'cc_title', name: 'Show Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 500, width: 1600, height: 200, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'THE SERIES', fontSize: 140, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 30, blur: 0 },
        keyframes: { opacity: [{ time: 4, value: 0, easing: 'ease-out' }, { time: 5.2, value: 1, easing: 'ease-out' }], scaleX: [{ time: 4, value: 1.1, easing: 'ease-out' }, { time: 5.2, value: 1, easing: 'ease-out' }], scaleY: [{ time: 4, value: 1.1, easing: 'ease-out' }, { time: 5.2, value: 1, easing: 'ease-out' }], blur: [{ time: 4, value: 8, easing: 'ease-out' }, { time: 5.2, value: 0, easing: 'ease-out' }] }
      },
      { id: 'cc_tagline', name: 'Tagline', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 620, width: 1400, height: 60, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'COMING THIS FALL', fontSize: 28, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#888888', textAlign: 'center', letterSpacing: 14 },
        keyframes: { opacity: [{ time: 5, value: 0, easing: 'ease-out' }, { time: 5.8, value: 1, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 13. Liquid Morph Logo ─────────────────────────────────────────────────
  {
    id: 'prm_liquid_morph',
    name: 'Liquid Morph Logo',
    category: 'Abstract',
    duration: 5,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#04040c',
    schema: [
      { id: 'brandName', label: 'Brand Name', layerId: 'lm_name', property: 'text' },
      { id: 'col1',      label: 'Color 1',    layerId: 'lm_blob1', property: 'fill' },
      { id: 'col2',      label: 'Color 2',    layerId: 'lm_blob2', property: 'fill' },
    ],
    layers: [
      ...[ ['lm_blob1', 580, 340, '#6366f1', 0,   0.3, 240, 240],
           ['lm_blob2', 700, 390, '#a855f7', 0.2, 0.5, 200, 200],
           ['lm_blob3', 640, 360, '#ec4899', 0.4, 0.7, 160, 160],
      ].map(([id, x, y, fill, delay, showAt, w, h]) => ({
        id, name: id, type: 'shape', visible: true, locked: false, blendMode: 'screen',
        properties: { x, y, width: w, height: h, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0, shapeType: 'circle', fill, stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {
          opacity: [{ time: showAt, value: 0, easing: 'ease-out' }, { time: showAt+0.4, value: 0.8, easing: 'ease-out' }],
          scaleX:  [{ time: showAt, value: 0, easing: 'spring'   }, { time: showAt+0.7, value: 1, easing: 'spring' }, { time: 2+delay, value: 1.4, easing: 'ease-in-out' }, { time: 3+delay, value: 0.8, easing: 'ease-in-out' }, { time: 4+delay, value: 1.2, easing: 'ease-in-out' }, { time: 5, value: 1, easing: 'ease-in-out' }],
          scaleY:  [{ time: showAt, value: 0, easing: 'spring'   }, { time: showAt+0.7, value: 1, easing: 'spring' }, { time: 2+delay, value: 0.8, easing: 'ease-in-out' }, { time: 3+delay, value: 1.3, easing: 'ease-in-out' }, { time: 4+delay, value: 0.9, easing: 'ease-in-out' }],
          x:       [{ time: 0, value: x, easing: 'ease-in-out' }, { time: 2+delay, value: x+30, easing: 'ease-in-out' }, { time: 4, value: x-20, easing: 'ease-in-out' }, { time: 5, value: x, easing: 'ease-in-out' }],
          y:       [{ time: 0, value: y, easing: 'ease-in-out' }, { time: 2+delay, value: y-25, easing: 'ease-in-out' }, { time: 4, value: y+15, easing: 'ease-in-out' }, { time: 5, value: y, easing: 'ease-in-out' }],
        }
      })),
      { id: 'lm_name', name: 'Brand Name', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 560, width: 700, height: 70, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'LIQUID', fontSize: 64, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 14 },
        keyframes: { opacity: [{ time: 1.5, value: 0, easing: 'ease-out' }, { time: 2.1, value: 1, easing: 'ease-out' }], y: [{ time: 1.5, value: 590, easing: 'ease-out' }, { time: 2.1, value: 560, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 14. Zoom Punch Reveal ─────────────────────────────────────────────────
  {
    id: 'prm_zoom_punch',
    name: 'Zoom Punch Reveal',
    category: 'Kinetic',
    duration: 4,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#ffffff',
    schema: [
      { id: 'punchWord', label: 'Punch Word',  layerId: 'zp_word',  property: 'text'  },
      { id: 'sub',       label: 'Subtitle',    layerId: 'zp_sub',   property: 'text'  },
      { id: 'bg',        label: 'Background',  layerId: 'zp_bg',    property: 'fill'  },
      { id: 'wordColor', label: 'Word Color',  layerId: 'zp_word',  property: 'color' },
    ],
    layers: [
      { id: 'zp_bg', name: 'Background', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 1280, height: 720, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#09090b', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { scaleX: [{ time: 0.4, value: 0, easing: 'ease-out' }, { time: 0.8, value: 1, easing: 'ease-out' }] }
      },
      { id: 'zp_word', name: 'Punch Word', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 1200, height: 250, rotation: 0, opacity: 0, scaleX: 4, scaleY: 4, text: 'BOOM', fontSize: 180, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#f97316', textAlign: 'center', letterSpacing: -4, blur: 6 },
        keyframes: {
          opacity:  [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 0.7, value: 1, easing: 'ease-out' }],
          scaleX:   [{ time: 0.5, value: 4, easing: 'ease-out' }, { time: 0.85, value: 0.95, easing: 'ease-out' }, { time: 1, value: 1, easing: 'ease-out' }],
          scaleY:   [{ time: 0.5, value: 4, easing: 'ease-out' }, { time: 0.85, value: 0.95, easing: 'ease-out' }, { time: 1, value: 1, easing: 'ease-out' }],
          blur:     [{ time: 0.5, value: 6, easing: 'ease-out' }, { time: 0.85, value: 0, easing: 'ease-out' }],
          rotation: [{ time: 0.5, value: -4, easing: 'ease-out' }, { time: 0.85, value: 1, easing: 'ease-out' }, { time: 1, value: 0, easing: 'ease-out' }],
        }
      },
      { id: 'zp_flash', name: 'Flash', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 1280, height: 720, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#f97316', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { opacity: [{ time: 0.48, value: 0, easing: 'linear' }, { time: 0.5, value: 0.5, easing: 'linear' }, { time: 0.6, value: 0, easing: 'linear' }] }
      },
      { id: 'zp_sub', name: 'Subtitle', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 490, width: 800, height: 60, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Make your content unforgettable', fontSize: 26, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#71717a', textAlign: 'center', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 1.4, value: 0, easing: 'ease-out' }, { time: 2, value: 1, easing: 'ease-out' }], y: [{ time: 1.4, value: 520, easing: 'ease-out' }, { time: 2, value: 490, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 15. Premium Channel Intro ─────────────────────────────────────────────
  {
    id: 'prm_channel_intro',
    name: 'Channel Intro',
    category: 'Intro',
    duration: 7,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#020210',
    schema: [
      { id: 'channelName', label: 'Channel Name',  layerId: 'ci_name',    property: 'text'  },
      { id: 'tagline',     label: 'Tagline',        layerId: 'ci_tagline', property: 'text'  },
      { id: 'accentClr',   label: 'Accent Color',   layerId: 'ci_accent1', property: 'fill'  },
    ],
    layers: [
      // Background rings
      ...Array.from({ length: 5 }, (_, i) => ({
        id: `ci_ring${i}`, name: `Ring ${i}`, type: 'shape', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 640, y: 360, width: 100+i*140, height: 100+i*140, rotation: i*20, opacity: 0, scaleX: 0, scaleY: 0, shapeType: 'circle', fill: 'transparent', stroke: i%2===0 ? '#6366f1' : '#a855f7', strokeWidth: 1, borderRadius: 0 },
        keyframes: {
          opacity: [{ time: i*0.12+0.3, value: 0, easing: 'ease-out' }, { time: i*0.12+0.7, value: 0.3+i*0.05, easing: 'ease-out' }],
          scaleX:  [{ time: i*0.12+0.3, value: 0, easing: 'spring'   }, { time: i*0.12+1,   value: 1,           easing: 'spring'   }],
          scaleY:  [{ time: i*0.12+0.3, value: 0, easing: 'spring'   }, { time: i*0.12+1,   value: 1,           easing: 'spring'   }],
          rotation:[{ time: 0, value: i*20, easing: 'linear' }, { time: 7, value: i*20 + (i%2===0?120:-120), easing: 'linear' }],
        }
      })),
      // Play button
      { id: 'ci_play_bg', name: 'Play BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 100, height: 100, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0, shapeType: 'circle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { opacity: [{ time: 1, value: 0, easing: 'spring' }, { time: 1.4, value: 1, easing: 'spring' }], scaleX: [{ time: 1, value: 0, easing: 'spring' }, { time: 1.5, value: 1, easing: 'spring' }], scaleY: [{ time: 1, value: 0, easing: 'spring' }, { time: 1.5, value: 1, easing: 'spring' }] }
      },
      { id: 'ci_play_icon', name: 'Play Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 643, y: 358, width: 100, height: 100, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '▶', fontSize: 36, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 1.4, value: 0, easing: 'ease-out' }, { time: 1.8, value: 1, easing: 'ease-out' }] }
      },
      // Channel name
      { id: 'ci_name', name: 'Channel Name', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 500, width: 900, height: 80, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'YOUR CHANNEL', fontSize: 64, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: 10 },
        keyframes: { opacity: [{ time: 2, value: 0, easing: 'ease-out' }, { time: 2.7, value: 1, easing: 'ease-out' }], y: [{ time: 2, value: 530, easing: 'ease-out' }, { time: 2.7, value: 500, easing: 'ease-out' }] }
      },
      { id: 'ci_accent1', name: 'Accent Line', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 548, width: 0, height: 3, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 1.5 },
        keyframes: { width: [{ time: 2.5, value: 0, easing: 'ease-out' }, { time: 3.2, value: 400, easing: 'ease-out' }] }
      },
      { id: 'ci_tagline', name: 'Tagline', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 590, width: 700, height: 44, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Subscribe for more amazing content', fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#a5b4fc', textAlign: 'center', letterSpacing: 1 },
        keyframes: { opacity: [{ time: 3, value: 0, easing: 'ease-out' }, { time: 3.7, value: 1, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 16. Benefits Cards Reveal (3-col) ────────────────────────────────────
  {
    id: 'ben_3card_reveal',
    name: 'Benefits Cards Reveal',
    category: 'Benefits',
    duration: 7,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#080810',
    schema: [
      { id: 'headerText',  label: 'Header',        layerId: 'bcr_header',  property: 'text'  },
      { id: 'icon1',       label: 'Card 1 Icon',   layerId: 'bcr_icon1',   property: 'text'  },
      { id: 'title1',      label: 'Card 1 Title',  layerId: 'bcr_title1',  property: 'text'  },
      { id: 'sub1',        label: 'Card 1 Sub',    layerId: 'bcr_sub1',    property: 'text'  },
      { id: 'icon2',       label: 'Card 2 Icon',   layerId: 'bcr_icon2',   property: 'text'  },
      { id: 'title2',      label: 'Card 2 Title',  layerId: 'bcr_title2',  property: 'text'  },
      { id: 'sub2',        label: 'Card 2 Sub',    layerId: 'bcr_sub2',    property: 'text'  },
      { id: 'icon3',       label: 'Card 3 Icon',   layerId: 'bcr_icon3',   property: 'text'  },
      { id: 'title3',      label: 'Card 3 Title',  layerId: 'bcr_title3',  property: 'text'  },
      { id: 'sub3',        label: 'Card 3 Sub',    layerId: 'bcr_sub3',    property: 'text'  },
      { id: 'cardColor',   label: 'Card Color',    layerId: 'bcr_bg1',     property: 'fill'  },
    ],
    layers: [
      // Full background
      { id: 'bcr_bg_main', name: 'Background', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 1280, height: 720, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#060610', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {}
      },
      // Subtle ambient glow behind cards
      { id: 'bcr_glow', name: 'Ambient Glow', type: 'shape', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 640, y: 420, width: 1000, height: 300, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#4f46e5', stroke: 'transparent', strokeWidth: 0, borderRadius: 150, blur: 50 },
        keyframes: { opacity: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 2, value: 0.08, easing: 'ease-out' }] }
      },
      // Header
      { id: 'bcr_header', name: 'Header', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 95, width: 900, height: 55, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'OUR BENEFITS', fontSize: 38, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#ffffff', textAlign: 'center', letterSpacing: 8 },
        keyframes: {
          opacity: [{ time: 0,   value: 0, easing: 'ease-out' }, { time: 0.45, value: 1, easing: 'ease-out' }],
          y:       [{ time: 0,   value: 65, easing: 'ease-out' }, { time: 0.45, value: 95, easing: 'ease-out' }]
        }
      },
      // Header underline
      { id: 'bcr_line', name: 'Header Line', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 135, width: 0, height: 2, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 1 },
        keyframes: { width: [{ time: 0.45, value: 0, easing: 'ease-out' }, { time: 0.85, value: 120, easing: 'ease-out' }] }
      },

      // ── Card 1 (x=320) — enters at t=0.4s ──
      { id: 'bcr_bg1', name: 'Card 1 BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 320, y: 430, width: 280, height: 360, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#1a1a38', stroke: '#6060cc', strokeWidth: 2, borderRadius: 18 },
        keyframes: {
          opacity: [{ time: 0.4, value: 0, easing: 'ease-out' }, { time: 0.75, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.4, value: 1540, easing: 'ease-out' }, { time: 0.85, value: 320, easing: 'ease-out' }]
        }
      },
      { id: 'bcr_icon1', name: 'Card 1 Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 320, y: 305, width: 260, height: 72, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '💰', fontSize: 52, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.4, value: 0, easing: 'ease-out' }, { time: 0.75, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.4, value: 1540, easing: 'ease-out' }, { time: 0.85, value: 320, easing: 'ease-out' }]
        }
      },
      { id: 'bcr_title1', name: 'Card 1 Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 320, y: 407, width: 250, height: 65, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Premium\nGlobal Salary', fontSize: 21, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.4, value: 0, easing: 'ease-out' }, { time: 0.75, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.4, value: 1540, easing: 'ease-out' }, { time: 0.85, value: 320, easing: 'ease-out' }]
        }
      },
      { id: 'bcr_sub1', name: 'Card 1 Sub', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 320, y: 485, width: 240, height: 55, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Competitive pay\npackage worldwide', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#888899', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.4, value: 0, easing: 'ease-out' }, { time: 0.75, value: 0.85, easing: 'ease-out' }],
          x:       [{ time: 0.4, value: 1540, easing: 'ease-out' }, { time: 0.85, value: 320, easing: 'ease-out' }]
        }
      },

      // ── Card 2 (x=640) — enters at t=0.75s ──
      { id: 'bcr_bg2', name: 'Card 2 BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 430, width: 280, height: 360, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#1a1a38', stroke: '#6060cc', strokeWidth: 2, borderRadius: 18 },
        keyframes: {
          opacity: [{ time: 0.75, value: 0, easing: 'ease-out' }, { time: 1.1, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.75, value: 1540, easing: 'ease-out' }, { time: 1.2, value: 640, easing: 'ease-out' }]
        }
      },
      { id: 'bcr_icon2', name: 'Card 2 Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 305, width: 260, height: 72, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '❤️', fontSize: 52, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.75, value: 0, easing: 'ease-out' }, { time: 1.1, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.75, value: 1540, easing: 'ease-out' }, { time: 1.2, value: 640, easing: 'ease-out' }]
        }
      },
      { id: 'bcr_title2', name: 'Card 2 Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 407, width: 250, height: 65, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'World Class\nHealthcare', fontSize: 21, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.75, value: 0, easing: 'ease-out' }, { time: 1.1, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.75, value: 1540, easing: 'ease-out' }, { time: 1.2, value: 640, easing: 'ease-out' }]
        }
      },
      { id: 'bcr_sub2', name: 'Card 2 Sub', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 485, width: 240, height: 55, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Full coverage\nfor you and family', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#888899', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.75, value: 0, easing: 'ease-out' }, { time: 1.1, value: 0.85, easing: 'ease-out' }],
          x:       [{ time: 0.75, value: 1540, easing: 'ease-out' }, { time: 1.2, value: 640, easing: 'ease-out' }]
        }
      },

      // ── Card 3 (x=960) — enters at t=1.1s ──
      { id: 'bcr_bg3', name: 'Card 3 BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 430, width: 280, height: 360, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#1a1a38', stroke: '#6060cc', strokeWidth: 2, borderRadius: 18 },
        keyframes: {
          opacity: [{ time: 1.1, value: 0, easing: 'ease-out' }, { time: 1.45, value: 1, easing: 'ease-out' }],
          x:       [{ time: 1.1, value: 1540, easing: 'ease-out' }, { time: 1.55, value: 960, easing: 'ease-out' }]
        }
      },
      { id: 'bcr_icon3', name: 'Card 3 Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 305, width: 260, height: 72, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '🏠', fontSize: 52, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 1.1, value: 0, easing: 'ease-out' }, { time: 1.45, value: 1, easing: 'ease-out' }],
          x:       [{ time: 1.1, value: 1540, easing: 'ease-out' }, { time: 1.55, value: 960, easing: 'ease-out' }]
        }
      },
      { id: 'bcr_title3', name: 'Card 3 Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 407, width: 250, height: 65, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Australian\nPR Support', fontSize: 21, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 1.1, value: 0, easing: 'ease-out' }, { time: 1.45, value: 1, easing: 'ease-out' }],
          x:       [{ time: 1.1, value: 1540, easing: 'ease-out' }, { time: 1.55, value: 960, easing: 'ease-out' }]
        }
      },
      { id: 'bcr_sub3', name: 'Card 3 Sub', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 485, width: 240, height: 55, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Visa & residency\nassistance', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#888899', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 1.1, value: 0, easing: 'ease-out' }, { time: 1.45, value: 0.85, easing: 'ease-out' }],
          x:       [{ time: 1.1, value: 1540, easing: 'ease-out' }, { time: 1.55, value: 960, easing: 'ease-out' }]
        }
      },
    ]
  },

  // ── 17. Benefits Cards 2-Up ───────────────────────────────────────────────
  {
    id: 'ben_2card_large',
    name: 'Feature Cards 2-Up',
    category: 'Benefits',
    duration: 7,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#07070f',
    schema: [
      { id: 'icon1',  label: 'Card 1 Icon',    layerId: 'b2_icon1',  property: 'text'  },
      { id: 'title1', label: 'Card 1 Title',   layerId: 'b2_title1', property: 'text'  },
      { id: 'sub1',   label: 'Card 1 Detail',  layerId: 'b2_sub1',   property: 'text'  },
      { id: 'icon2',  label: 'Card 2 Icon',    layerId: 'b2_icon2',  property: 'text'  },
      { id: 'title2', label: 'Card 2 Title',   layerId: 'b2_title2', property: 'text'  },
      { id: 'sub2',   label: 'Card 2 Detail',  layerId: 'b2_sub2',   property: 'text'  },
      { id: 'accent1','label': 'Card 1 Accent',layerId: 'b2_accent1',property: 'fill'  },
      { id: 'accent2','label': 'Card 2 Accent',layerId: 'b2_accent2',property: 'fill'  },
    ],
    layers: [
      { id: 'b2_bg', name: 'Background', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 1280, height: 720, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#050510', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {}
      },
      // Card 1 (left, x=340)
      { id: 'b2_bg1', name: 'Card 1 BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 340, y: 380, width: 500, height: 380, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#1a1a38', stroke: '#6060cc', strokeWidth: 2, borderRadius: 22 },
        keyframes: {
          opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.8, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.3, value: 1540, easing: 'ease-out' }, { time: 0.9, value: 340, easing: 'ease-out' }]
        }
      },
      { id: 'b2_accent1', name: 'Card 1 Accent Bar', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 340, y: 196, width: 500, height: 5, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#f59e0b', stroke: 'transparent', strokeWidth: 0, borderRadius: 2 },
        keyframes: {
          opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.8, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.3, value: 1540, easing: 'ease-out' }, { time: 0.9, value: 340, easing: 'ease-out' }]
        }
      },
      { id: 'b2_icon1', name: 'Card 1 Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 340, y: 258, width: 480, height: 80, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '💰', fontSize: 58, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.8, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.3, value: 1540, easing: 'ease-out' }, { time: 0.9, value: 340, easing: 'ease-out' }]
        }
      },
      { id: 'b2_title1', name: 'Card 1 Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 340, y: 373, width: 460, height: 65, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Premium Global Salary', fontSize: 28, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.8, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.3, value: 1540, easing: 'ease-out' }, { time: 0.9, value: 340, easing: 'ease-out' }]
        }
      },
      { id: 'b2_sub1', name: 'Card 1 Detail', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 340, y: 460, width: 440, height: 80, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Industry-leading compensation\npackages with global parity\nand performance bonuses', fontSize: 15, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#7878a0', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.8, value: 0.9, easing: 'ease-out' }],
          x:       [{ time: 0.3, value: 1540, easing: 'ease-out' }, { time: 0.9, value: 340, easing: 'ease-out' }]
        }
      },
      // Card 2 (right, x=940)
      { id: 'b2_bg2', name: 'Card 2 BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 940, y: 380, width: 500, height: 380, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#1a1a38', stroke: '#6060cc', strokeWidth: 2, borderRadius: 22 },
        keyframes: {
          opacity: [{ time: 0.7, value: 0, easing: 'ease-out' }, { time: 1.2, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.7, value: 1540, easing: 'ease-out' }, { time: 1.3, value: 940, easing: 'ease-out' }]
        }
      },
      { id: 'b2_accent2', name: 'Card 2 Accent Bar', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 940, y: 196, width: 500, height: 5, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#ec4899', stroke: 'transparent', strokeWidth: 0, borderRadius: 2 },
        keyframes: {
          opacity: [{ time: 0.7, value: 0, easing: 'ease-out' }, { time: 1.2, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.7, value: 1540, easing: 'ease-out' }, { time: 1.3, value: 940, easing: 'ease-out' }]
        }
      },
      { id: 'b2_icon2', name: 'Card 2 Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 940, y: 258, width: 480, height: 80, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '❤️', fontSize: 58, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.7, value: 0, easing: 'ease-out' }, { time: 1.2, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.7, value: 1540, easing: 'ease-out' }, { time: 1.3, value: 940, easing: 'ease-out' }]
        }
      },
      { id: 'b2_title2', name: 'Card 2 Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 940, y: 373, width: 460, height: 65, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'World Class Healthcare', fontSize: 28, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.7, value: 0, easing: 'ease-out' }, { time: 1.2, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.7, value: 1540, easing: 'ease-out' }, { time: 1.3, value: 940, easing: 'ease-out' }]
        }
      },
      { id: 'b2_sub2', name: 'Card 2 Detail', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 940, y: 460, width: 440, height: 80, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Comprehensive medical, dental\n& vision coverage for you\nand your entire family', fontSize: 15, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#7878a0', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.7, value: 0, easing: 'ease-out' }, { time: 1.2, value: 0.9, easing: 'ease-out' }],
          x:       [{ time: 0.7, value: 1540, easing: 'ease-out' }, { time: 1.3, value: 940, easing: 'ease-out' }]
        }
      },
    ]
  },

  // ── 18. Benefits + Wide Banner ────────────────────────────────────────────
  {
    id: 'ben_3card_banner',
    name: 'Benefits + Banner',
    category: 'Benefits',
    duration: 8,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#080810',
    schema: [
      { id: 'icon1',       label: 'Card 1 Icon',    layerId: 'bb_icon1',   property: 'text'  },
      { id: 'title1',      label: 'Card 1 Title',   layerId: 'bb_title1',  property: 'text'  },
      { id: 'icon2',       label: 'Card 2 Icon',    layerId: 'bb_icon2',   property: 'text'  },
      { id: 'title2',      label: 'Card 2 Title',   layerId: 'bb_title2',  property: 'text'  },
      { id: 'icon3',       label: 'Card 3 Icon',    layerId: 'bb_icon3',   property: 'text'  },
      { id: 'title3',      label: 'Card 3 Title',   layerId: 'bb_title3',  property: 'text'  },
      { id: 'bannerIcon',  label: 'Banner Icon',    layerId: 'bb_bicon',   property: 'text'  },
      { id: 'bannerText',  label: 'Banner Text',    layerId: 'bb_btext',   property: 'text'  },
      { id: 'bannerColor', label: 'Banner Color',   layerId: 'bb_banner',  property: 'fill'  },
    ],
    layers: [
      { id: 'bb_bg', name: 'Background', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 1280, height: 720, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#060610', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {}
      },
      // ── Top row: 3 square cards ──
      // Card 1 (x=270, y=270)
      { id: 'bb_bg1', name: 'Card 1 BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 270, y: 275, width: 260, height: 260, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#1a1a38', stroke: '#6060cc', strokeWidth: 2, borderRadius: 18 },
        keyframes: {
          opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.75, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.3, value: 1540, easing: 'ease-out' }, { time: 0.85, value: 270, easing: 'ease-out' }]
        }
      },
      { id: 'bb_icon1', name: 'Card 1 Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 270, y: 234, width: 240, height: 64, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '💰', fontSize: 48, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.75, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.3, value: 1540, easing: 'ease-out' }, { time: 0.85, value: 270, easing: 'ease-out' }]
        }
      },
      { id: 'bb_title1', name: 'Card 1 Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 270, y: 310, width: 230, height: 55, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Premium\nGlobal Salary', fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.75, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.3, value: 1540, easing: 'ease-out' }, { time: 0.85, value: 270, easing: 'ease-out' }]
        }
      },
      // Card 2 (x=640, y=270)
      { id: 'bb_bg2', name: 'Card 2 BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 275, width: 260, height: 260, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#1a1a38', stroke: '#6060cc', strokeWidth: 2, borderRadius: 18 },
        keyframes: {
          opacity: [{ time: 0.65, value: 0, easing: 'ease-out' }, { time: 1.1, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.65, value: 1540, easing: 'ease-out' }, { time: 1.2, value: 640, easing: 'ease-out' }]
        }
      },
      { id: 'bb_icon2', name: 'Card 2 Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 234, width: 240, height: 64, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '❤️', fontSize: 48, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.65, value: 0, easing: 'ease-out' }, { time: 1.1, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.65, value: 1540, easing: 'ease-out' }, { time: 1.2, value: 640, easing: 'ease-out' }]
        }
      },
      { id: 'bb_title2', name: 'Card 2 Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 310, width: 230, height: 55, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'World Class\nHealthcare', fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.65, value: 0, easing: 'ease-out' }, { time: 1.1, value: 1, easing: 'ease-out' }],
          x:       [{ time: 0.65, value: 1540, easing: 'ease-out' }, { time: 1.2, value: 640, easing: 'ease-out' }]
        }
      },
      // Card 3 (x=1010, y=270)
      { id: 'bb_bg3', name: 'Card 3 BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 1010, y: 275, width: 260, height: 260, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#1a1a38', stroke: '#6060cc', strokeWidth: 2, borderRadius: 18 },
        keyframes: {
          opacity: [{ time: 1.0, value: 0, easing: 'ease-out' }, { time: 1.45, value: 1, easing: 'ease-out' }],
          x:       [{ time: 1.0, value: 1540, easing: 'ease-out' }, { time: 1.55, value: 1010, easing: 'ease-out' }]
        }
      },
      { id: 'bb_icon3', name: 'Card 3 Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 1010, y: 234, width: 240, height: 64, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '🖥️', fontSize: 48, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 1.0, value: 0, easing: 'ease-out' }, { time: 1.45, value: 1, easing: 'ease-out' }],
          x:       [{ time: 1.0, value: 1540, easing: 'ease-out' }, { time: 1.55, value: 1010, easing: 'ease-out' }]
        }
      },
      { id: 'bb_title3', name: 'Card 3 Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 1010, y: 310, width: 230, height: 55, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Australian\nPR Support', fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 1.0, value: 0, easing: 'ease-out' }, { time: 1.45, value: 1, easing: 'ease-out' }],
          x:       [{ time: 1.0, value: 1540, easing: 'ease-out' }, { time: 1.55, value: 1010, easing: 'ease-out' }]
        }
      },
      // ── Wide Banner (slides up from bottom) ──
      { id: 'bb_banner', name: 'Banner BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 580, width: 960, height: 110, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#4f46e5', stroke: 'transparent', strokeWidth: 0, borderRadius: 18 },
        keyframes: {
          opacity: [{ time: 1.6, value: 0, easing: 'ease-out' }, { time: 2.1, value: 1, easing: 'ease-out' }],
          y:       [{ time: 1.6, value: 650, easing: 'ease-out' }, { time: 2.1, value: 580, easing: 'ease-out' }]
        }
      },
      { id: 'bb_bicon', name: 'Banner Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 415, y: 580, width: 70, height: 70, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '👨‍👩‍👧‍👦', fontSize: 38, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 1.6, value: 0, easing: 'ease-out' }, { time: 2.1, value: 1, easing: 'ease-out' }],
          y:       [{ time: 1.6, value: 650, easing: 'ease-out' }, { time: 2.1, value: 580, easing: 'ease-out' }]
        }
      },
      { id: 'bb_btext', name: 'Banner Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 690, y: 580, width: 500, height: 55, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'For Your Entire Family', fontSize: 26, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'left', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 1.8, value: 0, easing: 'ease-out' }, { time: 2.3, value: 1, easing: 'ease-out' }],
          y:       [{ time: 1.6, value: 650, easing: 'ease-out' }, { time: 2.1, value: 580, easing: 'ease-out' }]
        }
      },
    ]
  },

  // ── 19. Feature Grid 4 (2×2) ─────────────────────────────────────────────
  {
    id: 'ben_grid_4',
    name: 'Feature Grid 4',
    category: 'Benefits',
    duration: 8,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#07070e',
    schema: [
      { id: 'headerText', label: 'Header',        layerId: 'fg_header',  property: 'text'  },
      { id: 'icon1',      label: 'Card 1 Icon',   layerId: 'fg_icon1',   property: 'text'  },
      { id: 'title1',     label: 'Card 1 Title',  layerId: 'fg_title1',  property: 'text'  },
      { id: 'icon2',      label: 'Card 2 Icon',   layerId: 'fg_icon2',   property: 'text'  },
      { id: 'title2',     label: 'Card 2 Title',  layerId: 'fg_title2',  property: 'text'  },
      { id: 'icon3',      label: 'Card 3 Icon',   layerId: 'fg_icon3',   property: 'text'  },
      { id: 'title3',     label: 'Card 3 Title',  layerId: 'fg_title3',  property: 'text'  },
      { id: 'icon4',      label: 'Card 4 Icon',   layerId: 'fg_icon4',   property: 'text'  },
      { id: 'title4',     label: 'Card 4 Title',  layerId: 'fg_title4',  property: 'text'  },
      { id: 'cardColor',  label: 'Card Color',    layerId: 'fg_bg1',     property: 'fill'  },
    ],
    layers: [
      { id: 'fg_main_bg', name: 'Background', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 1280, height: 720, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#050510', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {}
      },
      { id: 'fg_header', name: 'Header', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 62, width: 900, height: 48, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'WHY JOIN US', fontSize: 34, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#ffffff', textAlign: 'center', letterSpacing: 7 },
        keyframes: {
          opacity: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 0.4, value: 1, easing: 'ease-out' }],
          y:       [{ time: 0, value: 40, easing: 'ease-out' }, { time: 0.4, value: 62, easing: 'ease-out' }]
        }
      },
      // Row 1, Col 1 (x=375, y=245) — scale in from center
      { id: 'fg_bg1', name: 'Card 1 BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 375, y: 245, width: 290, height: 240, rotation: 0, opacity: 0, scaleX: 0.7, scaleY: 0.7, shapeType: 'rectangle', fill: '#1a1a38', stroke: '#6060cc', strokeWidth: 2, borderRadius: 18 },
        keyframes: {
          opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.75, value: 1, easing: 'ease-out' }],
          scaleX:  [{ time: 0.3, value: 0.7, easing: 'spring' }, { time: 0.75, value: 1, easing: 'spring' }],
          scaleY:  [{ time: 0.3, value: 0.7, easing: 'spring' }, { time: 0.75, value: 1, easing: 'spring' }]
        }
      },
      { id: 'fg_icon1', name: 'Card 1 Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 375, y: 198, width: 270, height: 60, rotation: 0, opacity: 0, scaleX: 0.7, scaleY: 0.7, text: '💰', fontSize: 44, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.75, value: 1, easing: 'ease-out' }],
          scaleX:  [{ time: 0.3, value: 0.7, easing: 'spring' }, { time: 0.75, value: 1, easing: 'spring' }],
          scaleY:  [{ time: 0.3, value: 0.7, easing: 'spring' }, { time: 0.75, value: 1, easing: 'spring' }]
        }
      },
      { id: 'fg_title1', name: 'Card 1 Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 375, y: 268, width: 260, height: 55, rotation: 0, opacity: 0, scaleX: 0.7, scaleY: 0.7, text: 'Premium\nGlobal Salary', fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.75, value: 1, easing: 'ease-out' }],
          scaleX:  [{ time: 0.3, value: 0.7, easing: 'spring' }, { time: 0.75, value: 1, easing: 'spring' }],
          scaleY:  [{ time: 0.3, value: 0.7, easing: 'spring' }, { time: 0.75, value: 1, easing: 'spring' }]
        }
      },
      // Row 1, Col 2 (x=905, y=245)
      { id: 'fg_bg2', name: 'Card 2 BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 905, y: 245, width: 290, height: 240, rotation: 0, opacity: 0, scaleX: 0.7, scaleY: 0.7, shapeType: 'rectangle', fill: '#1a1a38', stroke: '#6060cc', strokeWidth: 2, borderRadius: 18 },
        keyframes: {
          opacity: [{ time: 0.6, value: 0, easing: 'ease-out' }, { time: 1.05, value: 1, easing: 'ease-out' }],
          scaleX:  [{ time: 0.6, value: 0.7, easing: 'spring' }, { time: 1.05, value: 1, easing: 'spring' }],
          scaleY:  [{ time: 0.6, value: 0.7, easing: 'spring' }, { time: 1.05, value: 1, easing: 'spring' }]
        }
      },
      { id: 'fg_icon2', name: 'Card 2 Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 905, y: 198, width: 270, height: 60, rotation: 0, opacity: 0, scaleX: 0.7, scaleY: 0.7, text: '❤️', fontSize: 44, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.6, value: 0, easing: 'ease-out' }, { time: 1.05, value: 1, easing: 'ease-out' }],
          scaleX:  [{ time: 0.6, value: 0.7, easing: 'spring' }, { time: 1.05, value: 1, easing: 'spring' }],
          scaleY:  [{ time: 0.6, value: 0.7, easing: 'spring' }, { time: 1.05, value: 1, easing: 'spring' }]
        }
      },
      { id: 'fg_title2', name: 'Card 2 Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 905, y: 268, width: 260, height: 55, rotation: 0, opacity: 0, scaleX: 0.7, scaleY: 0.7, text: 'World Class\nHealthcare', fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.6, value: 0, easing: 'ease-out' }, { time: 1.05, value: 1, easing: 'ease-out' }],
          scaleX:  [{ time: 0.6, value: 0.7, easing: 'spring' }, { time: 1.05, value: 1, easing: 'spring' }],
          scaleY:  [{ time: 0.6, value: 0.7, easing: 'spring' }, { time: 1.05, value: 1, easing: 'spring' }]
        }
      },
      // Row 2, Col 1 (x=375, y=510)
      { id: 'fg_bg3', name: 'Card 3 BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 375, y: 510, width: 290, height: 240, rotation: 0, opacity: 0, scaleX: 0.7, scaleY: 0.7, shapeType: 'rectangle', fill: '#1a1a38', stroke: '#6060cc', strokeWidth: 2, borderRadius: 18 },
        keyframes: {
          opacity: [{ time: 0.9, value: 0, easing: 'ease-out' }, { time: 1.35, value: 1, easing: 'ease-out' }],
          scaleX:  [{ time: 0.9, value: 0.7, easing: 'spring' }, { time: 1.35, value: 1, easing: 'spring' }],
          scaleY:  [{ time: 0.9, value: 0.7, easing: 'spring' }, { time: 1.35, value: 1, easing: 'spring' }]
        }
      },
      { id: 'fg_icon3', name: 'Card 3 Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 375, y: 463, width: 270, height: 60, rotation: 0, opacity: 0, scaleX: 0.7, scaleY: 0.7, text: '🏠', fontSize: 44, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.9, value: 0, easing: 'ease-out' }, { time: 1.35, value: 1, easing: 'ease-out' }],
          scaleX:  [{ time: 0.9, value: 0.7, easing: 'spring' }, { time: 1.35, value: 1, easing: 'spring' }],
          scaleY:  [{ time: 0.9, value: 0.7, easing: 'spring' }, { time: 1.35, value: 1, easing: 'spring' }]
        }
      },
      { id: 'fg_title3', name: 'Card 3 Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 375, y: 533, width: 260, height: 55, rotation: 0, opacity: 0, scaleX: 0.7, scaleY: 0.7, text: 'Australian\nPR Support', fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.9, value: 0, easing: 'ease-out' }, { time: 1.35, value: 1, easing: 'ease-out' }],
          scaleX:  [{ time: 0.9, value: 0.7, easing: 'spring' }, { time: 1.35, value: 1, easing: 'spring' }],
          scaleY:  [{ time: 0.9, value: 0.7, easing: 'spring' }, { time: 1.35, value: 1, easing: 'spring' }]
        }
      },
      // Row 2, Col 2 (x=905, y=510)
      { id: 'fg_bg4', name: 'Card 4 BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 905, y: 510, width: 290, height: 240, rotation: 0, opacity: 0, scaleX: 0.7, scaleY: 0.7, shapeType: 'rectangle', fill: '#1a1a38', stroke: '#6060cc', strokeWidth: 2, borderRadius: 18 },
        keyframes: {
          opacity: [{ time: 1.2, value: 0, easing: 'ease-out' }, { time: 1.65, value: 1, easing: 'ease-out' }],
          scaleX:  [{ time: 1.2, value: 0.7, easing: 'spring' }, { time: 1.65, value: 1, easing: 'spring' }],
          scaleY:  [{ time: 1.2, value: 0.7, easing: 'spring' }, { time: 1.65, value: 1, easing: 'spring' }]
        }
      },
      { id: 'fg_icon4', name: 'Card 4 Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 905, y: 463, width: 270, height: 60, rotation: 0, opacity: 0, scaleX: 0.7, scaleY: 0.7, text: '👨‍👩‍👧‍👦', fontSize: 44, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 1.2, value: 0, easing: 'ease-out' }, { time: 1.65, value: 1, easing: 'ease-out' }],
          scaleX:  [{ time: 1.2, value: 0.7, easing: 'spring' }, { time: 1.65, value: 1, easing: 'spring' }],
          scaleY:  [{ time: 1.2, value: 0.7, easing: 'spring' }, { time: 1.65, value: 1, easing: 'spring' }]
        }
      },
      { id: 'fg_title4', name: 'Card 4 Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 905, y: 533, width: 260, height: 55, rotation: 0, opacity: 0, scaleX: 0.7, scaleY: 0.7, text: 'For Your\nEntire Family', fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 1.2, value: 0, easing: 'ease-out' }, { time: 1.65, value: 1, easing: 'ease-out' }],
          scaleX:  [{ time: 1.2, value: 0.7, easing: 'spring' }, { time: 1.65, value: 1, easing: 'spring' }],
          scaleY:  [{ time: 1.2, value: 0.7, easing: 'spring' }, { time: 1.65, value: 1, easing: 'spring' }]
        }
      },
    ]
  },

  // ── 20. Benefits Spotlight (single card, cinematic) ───────────────────────
  {
    id: 'ben_spotlight',
    name: 'Benefits Spotlight',
    category: 'Benefits',
    duration: 6,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#06060e',
    schema: [
      { id: 'icon',     label: 'Feature Icon',   layerId: 'bs_icon',    property: 'text'  },
      { id: 'title',    label: 'Feature Title',  layerId: 'bs_title',   property: 'text'  },
      { id: 'subtitle', label: 'Subtitle',       layerId: 'bs_subtitle',property: 'text'  },
      { id: 'detail',   label: 'Detail Text',    layerId: 'bs_detail',  property: 'text'  },
      { id: 'accent',   label: 'Accent Color',   layerId: 'bs_ring',    property: 'fill'  },
    ],
    layers: [
      { id: 'bs_bg', name: 'Background', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 1280, height: 720, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#040410', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: {}
      },
      // Radial glow
      { id: 'bs_glow', name: 'Glow', type: 'shape', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 640, y: 360, width: 900, height: 500, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#4f46e5', stroke: 'transparent', strokeWidth: 0, borderRadius: 0, blur: 60 },
        keyframes: {
          opacity: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 2, value: 0.12, easing: 'ease-out' }],
          scaleX:  [{ time: 0.5, value: 0.3, easing: 'ease-out' }, { time: 2, value: 1, easing: 'ease-out' }],
          scaleY:  [{ time: 0.5, value: 0.3, easing: 'ease-out' }, { time: 2, value: 1, easing: 'ease-out' }]
        }
      },
      // Accent ring
      { id: 'bs_ring', name: 'Accent Ring', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 290, width: 140, height: 140, rotation: 0, opacity: 0, scaleX: 0.5, scaleY: 0.5, shapeType: 'circle', fill: 'transparent', stroke: '#f59e0b', strokeWidth: 3, borderRadius: 0 },
        keyframes: {
          opacity: [{ time: 0.4, value: 0, easing: 'ease-out' }, { time: 0.9, value: 1, easing: 'ease-out' }],
          scaleX:  [{ time: 0.4, value: 0.4, easing: 'spring' }, { time: 0.9, value: 1, easing: 'spring' }],
          scaleY:  [{ time: 0.4, value: 0.4, easing: 'spring' }, { time: 0.9, value: 1, easing: 'spring' }],
          rotation:[{ time: 0, value: 0, easing: 'linear' }, { time: 6, value: 360, easing: 'linear' }]
        }
      },
      // Card
      { id: 'bs_card', name: 'Card BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 390, width: 660, height: 420, rotation: 0, opacity: 0, scaleX: 0.85, scaleY: 0.85, shapeType: 'rectangle', fill: '#181835', stroke: '#6868dd', strokeWidth: 2, borderRadius: 24 },
        keyframes: {
          opacity: [{ time: 0.2, value: 0, easing: 'ease-out' }, { time: 0.7, value: 1, easing: 'ease-out' }],
          scaleX:  [{ time: 0.2, value: 0.85, easing: 'spring' }, { time: 0.75, value: 1, easing: 'spring' }],
          scaleY:  [{ time: 0.2, value: 0.85, easing: 'spring' }, { time: 0.75, value: 1, easing: 'spring' }]
        }
      },
      // Icon
      { id: 'bs_icon', name: 'Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 290, width: 120, height: 100, rotation: 0, opacity: 0, scaleX: 0.5, scaleY: 0.5, text: '💰', fontSize: 72, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.4, value: 0, easing: 'ease-out' }, { time: 0.9, value: 1, easing: 'ease-out' }],
          scaleX:  [{ time: 0.4, value: 0.4, easing: 'spring' }, { time: 0.9, value: 1, easing: 'spring' }],
          scaleY:  [{ time: 0.4, value: 0.4, easing: 'spring' }, { time: 0.9, value: 1, easing: 'spring' }]
        }
      },
      // Title
      { id: 'bs_title', name: 'Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 382, width: 600, height: 65, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Premium Global Salary', fontSize: 42, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 0.6, value: 0, easing: 'ease-out' }, { time: 1.1, value: 1, easing: 'ease-out' }],
          y:       [{ time: 0.6, value: 400, easing: 'ease-out' }, { time: 1.1, value: 382, easing: 'ease-out' }]
        }
      },
      // Subtitle
      { id: 'bs_subtitle', name: 'Subtitle', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 440, width: 560, height: 44, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'COMPETITIVE COMPENSATION', fontSize: 13, fontFamily: 'Inter, sans-serif', fontWeight: '600', color: '#f59e0b', textAlign: 'center', letterSpacing: 4 },
        keyframes: {
          opacity: [{ time: 0.8, value: 0, easing: 'ease-out' }, { time: 1.3, value: 1, easing: 'ease-out' }],
          y:       [{ time: 0.8, value: 455, easing: 'ease-out' }, { time: 1.3, value: 440, easing: 'ease-out' }]
        }
      },
      // Divider line
      { id: 'bs_divider', name: 'Divider', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 475, width: 0, height: 1, rotation: 0, opacity: 0.4, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#3a3a5a', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { width: [{ time: 1.1, value: 0, easing: 'ease-out' }, { time: 1.5, value: 480, easing: 'ease-out' }] }
      },
      // Detail text
      { id: 'bs_detail', name: 'Detail', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 530, width: 580, height: 90, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Industry-leading compensation with global pay\nparity, performance bonuses, and equity options\nto ensure you are rewarded for your impact.', fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#7878a0', textAlign: 'center', letterSpacing: 0 },
        keyframes: {
          opacity: [{ time: 1.2, value: 0, easing: 'ease-out' }, { time: 1.7, value: 0.9, easing: 'ease-out' }],
          y:       [{ time: 1.2, value: 545, easing: 'ease-out' }, { time: 1.7, value: 530, easing: 'ease-out' }]
        }
      },
    ]
  },
];
