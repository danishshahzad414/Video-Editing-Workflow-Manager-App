/**
 * 10 social-media / content-creator templates inspired by autoae.online
 * Each has a `schema` for the quick-edit form fields.
 */
export const SOCIAL_TEMPLATES = [

  // ── 1. Google Search Animation ──────────────────────────────────────────
  {
    id: 'soc_google_search',
    name: 'Google Search',
    category: 'UI Animation',
    duration: 5,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#ffffff',
    schema: [
      { id: 'query',  label: 'Search Query', layerId: 'gs_query',  property: 'text' },
      { id: 'result', label: 'Result Title',  layerId: 'gs_rtitle', property: 'text' },
      { id: 'url',    label: 'Result URL',    layerId: 'gs_rurl',   property: 'text' },
    ],
    layers: [
      // Search bar background
      { id: 'gs_bar_bg', name: 'Search Bar', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 290, width: 740, height: 56, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#ffffff', stroke: '#dfe1e5', strokeWidth: 1.5, borderRadius: 28 },
        keyframes: { opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.8, value: 1, easing: 'ease-out' }], scaleX: [{ time: 0.3, value: 0.6, easing: 'ease-out' }, { time: 0.8, value: 1, easing: 'ease-out' }] }
      },
      // Google logo
      { id: 'gs_logo', name: 'Google Logo', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 200, width: 280, height: 70, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Google', fontSize: 60, fontFamily: 'Arial, sans-serif', fontWeight: '400', color: '#4285F4', textAlign: 'center', letterSpacing: -2 },
        keyframes: { opacity: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 0.5, value: 1, easing: 'ease-out' }], y: [{ time: 0, value: 230, easing: 'ease-out' }, { time: 0.5, value: 200, easing: 'ease-out' }] }
      },
      // Search cursor
      { id: 'gs_cursor', name: 'Cursor', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 320, y: 290, width: 2, height: 28, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#1a73e8', stroke: 'transparent', strokeWidth: 0, borderRadius: 1 },
        keyframes: { opacity: [{ time: 1, value: 0, easing: 'linear' }, { time: 1.3, value: 1, easing: 'linear' }, { time: 1.6, value: 0, easing: 'linear' }, { time: 1.9, value: 1, easing: 'linear' }, { time: 2.2, value: 0, easing: 'linear' }, { time: 2.5, value: 1, easing: 'linear' }, { time: 2.8, value: 0, easing: 'linear' }], x: [{ time: 1, value: 285, easing: 'linear' }, { time: 3, value: 550, easing: 'linear' }] }
      },
      // Query text (types in)
      { id: 'gs_query', name: 'Search Query', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 430, y: 290, width: 580, height: 40, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'How to grow on YouTube fast', fontSize: 22, fontFamily: 'Arial, sans-serif', fontWeight: '400', color: '#202124', textAlign: 'left', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 1, value: 0, easing: 'linear' }, { time: 1.1, value: 1, easing: 'linear' }] }
      },
      // Search button
      { id: 'gs_btn', name: 'Search Btn', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 370, width: 200, height: 40, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#f8f9fa', stroke: '#dfe1e5', strokeWidth: 1, borderRadius: 4 },
        keyframes: { opacity: [{ time: 1.5, value: 0, easing: 'ease-out' }, { time: 2, value: 1, easing: 'ease-out' }] }
      },
      { id: 'gs_btn_txt', name: 'Search Btn Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 370, width: 200, height: 40, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Google Search', fontSize: 15, fontFamily: 'Arial, sans-serif', fontWeight: '400', color: '#3c4043', textAlign: 'center', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 1.7, value: 0, easing: 'ease-out' }, { time: 2.1, value: 1, easing: 'ease-out' }] }
      },
      // Result card
      { id: 'gs_result_bg', name: 'Result Card', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 500, y: 530, width: 700, height: 110, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#ffffff', stroke: '#e8eaed', strokeWidth: 1, borderRadius: 8 },
        keyframes: { opacity: [{ time: 2.8, value: 0, easing: 'ease-out' }, { time: 3.3, value: 1, easing: 'ease-out' }], y: [{ time: 2.8, value: 555, easing: 'ease-out' }, { time: 3.3, value: 530, easing: 'ease-out' }] }
      },
      { id: 'gs_rurl', name: 'Result URL', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 500, y: 500, width: 660, height: 28, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'www.yourbrand.com › youtube › growth', fontSize: 14, fontFamily: 'Arial, sans-serif', fontWeight: '400', color: '#202124', textAlign: 'left', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 3.1, value: 0, easing: 'ease-out' }, { time: 3.5, value: 1, easing: 'ease-out' }] }
      },
      { id: 'gs_rtitle', name: 'Result Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 500, y: 528, width: 660, height: 34, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '10 Proven Strategies to Grow Your YouTube Channel', fontSize: 22, fontFamily: 'Arial, sans-serif', fontWeight: '400', color: '#1a0dab', textAlign: 'left', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 3.3, value: 0, easing: 'ease-out' }, { time: 3.7, value: 1, easing: 'ease-out' }] }
      },
      { id: 'gs_rdesc', name: 'Result Desc', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 500, y: 558, width: 660, height: 48, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Discover the exact strategies top creators use to grow fast.\nFrom thumbnails to the algorithm — everything you need to know.', fontSize: 15, fontFamily: 'Arial, sans-serif', fontWeight: '400', color: '#4d5156', textAlign: 'left', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 3.6, value: 0, easing: 'ease-out' }, { time: 4, value: 1, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 2. Typewriter Quote ──────────────────────────────────────────────────
  {
    id: 'soc_typewriter_quote',
    name: 'Typewriter Quote',
    category: 'Text Animation',
    duration: 7,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#0c0c14',
    schema: [
      { id: 'quote',  label: 'Quote Text',   layerId: 'tq_text',   property: 'text' },
      { id: 'author', label: 'Author Name',  layerId: 'tq_author', property: 'text' },
      { id: 'qcolor', label: 'Quote Color',  layerId: 'tq_text',   property: 'color' },
    ],
    layers: [
      { id: 'tq_line_l', name: 'Left Line', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 120, y: 360, width: 4, height: 0, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 2 },
        keyframes: { height: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 1, value: 220, easing: 'ease-out' }], y: [{ time: 0.3, value: 360, easing: 'ease-out' }, { time: 1, value: 250, easing: 'ease-out' }] }
      },
      { id: 'tq_quote_mark', name: 'Quote Mark', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 200, y: 270, width: 100, height: 100, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '"', fontSize: 100, fontFamily: 'Georgia, serif', fontWeight: '400', color: '#6366f1', textAlign: 'center', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 1, value: 0.4, easing: 'ease-out' }] }
      },
      { id: 'tq_text', name: 'Quote Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 680, y: 330, width: 920, height: 200, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'The best time to start was yesterday.\nThe second best time is now.', fontSize: 44, fontFamily: 'Georgia, serif', fontWeight: '400', color: '#ffffff', textAlign: 'left', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 1, value: 0, easing: 'ease-out' }, { time: 1.8, value: 1, easing: 'ease-out' }], x: [{ time: 1, value: 660, easing: 'ease-out' }, { time: 1.8, value: 680, easing: 'ease-out' }] }
      },
      { id: 'tq_author', name: 'Author', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 470, width: 800, height: 40, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '— Anonymous', fontSize: 20, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#6366f1', textAlign: 'center', letterSpacing: 3 },
        keyframes: { opacity: [{ time: 2.5, value: 0, easing: 'ease-out' }, { time: 3.2, value: 1, easing: 'ease-out' }] }
      },
      { id: 'tq_underline', name: 'Underline', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 500, width: 0, height: 2, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 1 },
        keyframes: { width: [{ time: 3, value: 0, easing: 'ease-out' }, { time: 3.8, value: 300, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 3. Counter Animation ─────────────────────────────────────────────────
  {
    id: 'soc_counter',
    name: 'Counter Animation',
    category: 'Text Animation',
    duration: 5,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#0a0a18',
    schema: [
      { id: 'endNum',  label: 'End Number',   layerId: 'cnt_num',   property: 'text' },
      { id: 'label',   label: 'Label Text',   layerId: 'cnt_label', property: 'text' },
      { id: 'numColor',label: 'Number Color', layerId: 'cnt_num',   property: 'color' },
    ],
    layers: [
      { id: 'cnt_ring', name: 'Ring', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 340, width: 320, height: 320, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0, shapeType: 'circle', fill: 'transparent', stroke: '#6366f1', strokeWidth: 4, borderRadius: 0 },
        keyframes: { opacity: [{ time: 0.2, value: 0, easing: 'ease-out' }, { time: 0.7, value: 1, easing: 'ease-out' }], scaleX: [{ time: 0.2, value: 0, easing: 'spring' }, { time: 0.9, value: 1, easing: 'spring' }], scaleY: [{ time: 0.2, value: 0, easing: 'spring' }, { time: 0.9, value: 1, easing: 'spring' }], rotation: [{ time: 0, value: 0, easing: 'linear' }, { time: 5, value: 360, easing: 'linear' }] }
      },
      { id: 'cnt_glow', name: 'Glow', type: 'shape', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 640, y: 340, width: 280, height: 280, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { opacity: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 1.5, value: 0.15, easing: 'ease-out' }, { time: 3, value: 0.3, easing: 'ease-in-out' }, { time: 4.5, value: 0.12, easing: 'ease-in-out' }] }
      },
      { id: 'cnt_num', name: 'Number', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 330, width: 300, height: 160, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '1,000,000', fontSize: 88, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: -2 },
        keyframes: { opacity: [{ time: 0.7, value: 0, easing: 'ease-out' }, { time: 1.2, value: 1, easing: 'ease-out' }], scaleX: [{ time: 0.7, value: 0.5, easing: 'spring' }, { time: 1.4, value: 1, easing: 'spring' }], scaleY: [{ time: 0.7, value: 0.5, easing: 'spring' }, { time: 1.4, value: 1, easing: 'spring' }] }
      },
      { id: 'cnt_label', name: 'Label', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 440, width: 500, height: 50, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'SUBSCRIBERS', fontSize: 24, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#a5b4fc', textAlign: 'center', letterSpacing: 8 },
        keyframes: { opacity: [{ time: 1.2, value: 0, easing: 'ease-out' }, { time: 1.8, value: 1, easing: 'ease-out' }], y: [{ time: 1.2, value: 460, easing: 'ease-out' }, { time: 1.8, value: 440, easing: 'ease-out' }] }
      },
      { id: 'cnt_milestone', name: 'Milestone Badge', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 560, width: 0, height: 44, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 22 },
        keyframes: { width: [{ time: 2, value: 0, easing: 'ease-out' }, { time: 2.7, value: 260, easing: 'ease-out' }] }
      },
      { id: 'cnt_milestone_txt', name: 'Milestone Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 560, width: 260, height: 44, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '🏆 Milestone Reached!', fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: '600', color: '#ffffff', textAlign: 'center', letterSpacing: 1 },
        keyframes: { opacity: [{ time: 2.5, value: 0, easing: 'ease-out' }, { time: 3, value: 1, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 4. Highlight Text ────────────────────────────────────────────────────
  {
    id: 'soc_highlight',
    name: 'Highlight Text',
    category: 'Text Animation',
    duration: 5,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#111111',
    schema: [
      { id: 'line1',   label: 'Line 1',         layerId: 'hl_line1',   property: 'text' },
      { id: 'line2',   label: 'Line 2 (highlight)', layerId: 'hl_line2', property: 'text' },
      { id: 'hlcolor', label: 'Highlight Color', layerId: 'hl_mark',    property: 'fill' },
    ],
    layers: [
      { id: 'hl_line1', name: 'Line 1', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 300, width: 1000, height: 90, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Stop wasting time on', fontSize: 62, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: -1 },
        keyframes: { opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.9, value: 1, easing: 'ease-out' }], y: [{ time: 0.3, value: 325, easing: 'ease-out' }, { time: 0.9, value: 300, easing: 'ease-out' }] }
      },
      { id: 'hl_mark', name: 'Highlight Mark', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 400, width: 0, height: 88, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#fbbf24', stroke: 'transparent', strokeWidth: 0, borderRadius: 4 },
        keyframes: { width: [{ time: 1, value: 0, easing: 'ease-out' }, { time: 1.7, value: 560, easing: 'ease-out' }], x: [{ time: 1, value: 360, easing: 'ease-out' }, { time: 1.7, value: 640, easing: 'ease-out' }] }
      },
      { id: 'hl_line2', name: 'Line 2 (highlighted)', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 400, width: 1000, height: 90, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'things that don\'t matter', fontSize: 62, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#111111', textAlign: 'center', letterSpacing: -1 },
        keyframes: { opacity: [{ time: 1.4, value: 0, easing: 'linear' }, { time: 1.6, value: 1, easing: 'linear' }] }
      },
      { id: 'hl_sub', name: 'Sub Line', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 500, width: 800, height: 50, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Focus on what actually moves the needle.', fontSize: 22, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#888888', textAlign: 'center', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 2.2, value: 0, easing: 'ease-out' }, { time: 2.8, value: 1, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 5. Bullet Points Steps ───────────────────────────────────────────────
  {
    id: 'soc_bullet_steps',
    name: 'Bullet Point Steps',
    category: 'Flowchart',
    duration: 7,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#0d0d1a',
    schema: [
      { id: 'title', label: 'Title',    layerId: 'bp_title', property: 'text' },
      { id: 'step1', label: 'Step 1',   layerId: 'bp_s1txt', property: 'text' },
      { id: 'step2', label: 'Step 2',   layerId: 'bp_s2txt', property: 'text' },
      { id: 'step3', label: 'Step 3',   layerId: 'bp_s3txt', property: 'text' },
    ],
    layers: [
      { id: 'bp_title', name: 'Title', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 140, width: 1000, height: 70, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '3 Steps to Go Viral', fontSize: 56, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#ffffff', textAlign: 'center', letterSpacing: -1 },
        keyframes: { opacity: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 0.9, value: 1, easing: 'ease-out' }], y: [{ time: 0.3, value: 160, easing: 'ease-out' }, { time: 0.9, value: 140, easing: 'ease-out' }] }
      },
      // Step 1
      { id: 'bp_s1dot', name: 'Step 1 Dot', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 220, y: 290, width: 44, height: 44, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0, shapeType: 'circle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { opacity: [{ time: 1, value: 0, easing: 'ease-out' }, { time: 1.3, value: 1, easing: 'ease-out' }], scaleX: [{ time: 1, value: 0, easing: 'spring' }, { time: 1.5, value: 1, easing: 'spring' }], scaleY: [{ time: 1, value: 0, easing: 'spring' }, { time: 1.5, value: 1, easing: 'spring' }] }
      },
      { id: 'bp_s1num', name: 'Step 1 Num', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 220, y: 290, width: 44, height: 44, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '1', fontSize: 22, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 1.3, value: 0, easing: 'linear' }, { time: 1.6, value: 1, easing: 'linear' }] }
      },
      { id: 'bp_s1txt', name: 'Step 1 Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 730, y: 290, width: 840, height: 60, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Post consistently — 3x per week minimum', fontSize: 28, fontFamily: 'Inter, sans-serif', fontWeight: '500', color: '#e2e8f0', textAlign: 'left', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 1.2, value: 0, easing: 'ease-out' }, { time: 1.8, value: 1, easing: 'ease-out' }], x: [{ time: 1.2, value: 700, easing: 'ease-out' }, { time: 1.8, value: 730, easing: 'ease-out' }] }
      },
      // Connector line 1-2
      { id: 'bp_line1', name: 'Connector 1', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 220, y: 335, width: 2, height: 0, rotation: 0, opacity: 0.3, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 1 },
        keyframes: { height: [{ time: 1.8, value: 0, easing: 'ease-out' }, { time: 2.2, value: 56, easing: 'ease-out' }] }
      },
      // Step 2
      { id: 'bp_s2dot', name: 'Step 2 Dot', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 220, y: 420, width: 44, height: 44, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0, shapeType: 'circle', fill: '#a855f7', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { opacity: [{ time: 2.2, value: 0, easing: 'ease-out' }, { time: 2.5, value: 1, easing: 'ease-out' }], scaleX: [{ time: 2.2, value: 0, easing: 'spring' }, { time: 2.7, value: 1, easing: 'spring' }], scaleY: [{ time: 2.2, value: 0, easing: 'spring' }, { time: 2.7, value: 1, easing: 'spring' }] }
      },
      { id: 'bp_s2num', name: 'Step 2 Num', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 220, y: 420, width: 44, height: 44, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '2', fontSize: 22, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 2.5, value: 0, easing: 'linear' }, { time: 2.8, value: 1, easing: 'linear' }] }
      },
      { id: 'bp_s2txt', name: 'Step 2 Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 730, y: 420, width: 840, height: 60, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Hook viewers in the first 3 seconds', fontSize: 28, fontFamily: 'Inter, sans-serif', fontWeight: '500', color: '#e2e8f0', textAlign: 'left', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 2.5, value: 0, easing: 'ease-out' }, { time: 3.1, value: 1, easing: 'ease-out' }], x: [{ time: 2.5, value: 700, easing: 'ease-out' }, { time: 3.1, value: 730, easing: 'ease-out' }] }
      },
      { id: 'bp_line2', name: 'Connector 2', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 220, y: 465, width: 2, height: 0, rotation: 0, opacity: 0.3, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#a855f7', stroke: 'transparent', strokeWidth: 0, borderRadius: 1 },
        keyframes: { height: [{ time: 3, value: 0, easing: 'ease-out' }, { time: 3.4, value: 56, easing: 'ease-out' }] }
      },
      // Step 3
      { id: 'bp_s3dot', name: 'Step 3 Dot', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 220, y: 550, width: 44, height: 44, rotation: 0, opacity: 0, scaleX: 0, scaleY: 0, shapeType: 'circle', fill: '#ec4899', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { opacity: [{ time: 3.4, value: 0, easing: 'ease-out' }, { time: 3.7, value: 1, easing: 'ease-out' }], scaleX: [{ time: 3.4, value: 0, easing: 'spring' }, { time: 3.9, value: 1, easing: 'spring' }], scaleY: [{ time: 3.4, value: 0, easing: 'spring' }, { time: 3.9, value: 1, easing: 'spring' }] }
      },
      { id: 'bp_s3num', name: 'Step 3 Num', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 220, y: 550, width: 44, height: 44, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '3', fontSize: 22, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 3.7, value: 0, easing: 'linear' }, { time: 4, value: 1, easing: 'linear' }] }
      },
      { id: 'bp_s3txt', name: 'Step 3 Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 730, y: 550, width: 840, height: 60, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Optimize thumbnails & titles with keywords', fontSize: 28, fontFamily: 'Inter, sans-serif', fontWeight: '500', color: '#e2e8f0', textAlign: 'left', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 3.7, value: 0, easing: 'ease-out' }, { time: 4.3, value: 1, easing: 'ease-out' }], x: [{ time: 3.7, value: 700, easing: 'ease-out' }, { time: 4.3, value: 730, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 6. Breaking News Ticker ──────────────────────────────────────────────
  {
    id: 'soc_news_ticker',
    name: 'Breaking News Ticker',
    category: 'Lower Third',
    duration: 6,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#1c1c28',
    schema: [
      { id: 'headline', label: 'Headline',      layerId: 'nt_headline', property: 'text' },
      { id: 'ticker',   label: 'Ticker Text',   layerId: 'nt_ticker',   property: 'text' },
      { id: 'badge',    label: 'Badge Label',   layerId: 'nt_badge_txt',property: 'text' },
    ],
    layers: [
      { id: 'nt_bar_bg', name: 'Bar BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 608, width: 0, height: 58, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#0f172a', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { width: [{ time: 0.2, value: 0, easing: 'ease-out' }, { time: 0.8, value: 1280, easing: 'ease-out' }], x: [{ time: 0.2, value: 0, easing: 'ease-out' }, { time: 0.8, value: 640, easing: 'ease-out' }] }
      },
      { id: 'nt_badge', name: 'Breaking Badge', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 92, y: 608, width: 148, height: 36, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#dc2626', stroke: 'transparent', strokeWidth: 0, borderRadius: 4 },
        keyframes: { opacity: [{ time: 0.6, value: 0, easing: 'ease-out' }, { time: 1, value: 1, easing: 'ease-out' }], scaleX: [{ time: 0.6, value: 0, easing: 'ease-out' }, { time: 1, value: 1, easing: 'ease-out' }] }
      },
      { id: 'nt_badge_txt', name: 'Badge Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 92, y: 608, width: 148, height: 36, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '⚡ BREAKING', fontSize: 14, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#ffffff', textAlign: 'center', letterSpacing: 1 },
        keyframes: { opacity: [{ time: 0.9, value: 0, easing: 'ease-out' }, { time: 1.3, value: 1, easing: 'ease-out' }] }
      },
      { id: 'nt_ticker', name: 'Ticker Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 780, y: 608, width: 960, height: 36, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Motion Studio — AI-powered motion graphics generation now live for all creators', fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#e2e8f0', textAlign: 'left', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 1, value: 0, easing: 'linear' }, { time: 1.3, value: 1, easing: 'linear' }], x: [{ time: 1, value: 1400, easing: 'linear' }, { time: 6, value: -200, easing: 'linear' }] }
      },
      { id: 'nt_divider', name: 'Divider', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 176, y: 608, width: 2, height: 0, rotation: 0, opacity: 0.5, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#dc2626', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { height: [{ time: 0.8, value: 0, easing: 'ease-out' }, { time: 1.2, value: 36, easing: 'ease-out' }] }
      },
      { id: 'nt_headline', name: 'Headline', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 340, width: 1100, height: 200, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'AI Is Changing\nEverything', fontSize: 90, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: -2 },
        keyframes: { opacity: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 1.2, value: 1, easing: 'ease-out' }], y: [{ time: 0.5, value: 370, easing: 'ease-out' }, { time: 1.2, value: 340, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 7. Before & After Split ──────────────────────────────────────────────
  {
    id: 'soc_before_after',
    name: 'Before & After',
    category: 'Comparison',
    duration: 6,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#0a0a0a',
    schema: [
      { id: 'beforeLabel', label: 'Before Label', layerId: 'ba_left_label',  property: 'text' },
      { id: 'afterLabel',  label: 'After Label',  layerId: 'ba_right_label', property: 'text' },
      { id: 'beforeColor', label: 'Before Color', layerId: 'ba_left_bg',     property: 'fill' },
      { id: 'afterColor',  label: 'After Color',  layerId: 'ba_right_bg',    property: 'fill' },
    ],
    layers: [
      { id: 'ba_left_bg', name: 'Left BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 320, y: 360, width: 0, height: 720, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#1e1e2e', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { width: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 1.2, value: 640, easing: 'ease-out' }], x: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 1.2, value: 320, easing: 'ease-out' }] }
      },
      { id: 'ba_right_bg', name: 'Right BG', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 960, y: 360, width: 0, height: 720, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#0d1117', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { width: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 1.4, value: 640, easing: 'ease-out' }], x: [{ time: 0.5, value: 1280, easing: 'ease-out' }, { time: 1.4, value: 960, easing: 'ease-out' }] }
      },
      { id: 'ba_divider', name: 'Divider Line', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 360, width: 4, height: 0, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#ffffff', stroke: 'transparent', strokeWidth: 0, borderRadius: 2 },
        keyframes: { height: [{ time: 1.2, value: 0, easing: 'ease-out' }, { time: 1.8, value: 720, easing: 'ease-out' }], y: [{ time: 1.2, value: 360, easing: 'ease-out' }, { time: 1.8, value: 360, easing: 'ease-out' }] }
      },
      { id: 'ba_left_label', name: 'Before Label', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 260, y: 150, width: 360, height: 80, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'BEFORE', fontSize: 52, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#888888', textAlign: 'center', letterSpacing: 12 },
        keyframes: { opacity: [{ time: 1.5, value: 0, easing: 'ease-out' }, { time: 2.1, value: 1, easing: 'ease-out' }] }
      },
      { id: 'ba_right_label', name: 'After Label', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 980, y: 150, width: 360, height: 80, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'AFTER', fontSize: 52, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#6366f1', textAlign: 'center', letterSpacing: 12 },
        keyframes: { opacity: [{ time: 1.7, value: 0, easing: 'ease-out' }, { time: 2.3, value: 1, easing: 'ease-out' }] }
      },
      { id: 'ba_left_body', name: 'Before Body', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 260, y: 380, width: 500, height: 200, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '✗ Manual editing\n✗ Hours of work\n✗ No AI help', fontSize: 26, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#666666', textAlign: 'center', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 2, value: 0, easing: 'ease-out' }, { time: 2.6, value: 1, easing: 'ease-out' }], y: [{ time: 2, value: 400, easing: 'ease-out' }, { time: 2.6, value: 380, easing: 'ease-out' }] }
      },
      { id: 'ba_right_body', name: 'After Body', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 980, y: 380, width: 500, height: 200, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '✓ AI-generated\n✓ Seconds, not hours\n✓ Export instantly', fontSize: 26, fontFamily: 'Inter, sans-serif', fontWeight: '600', color: '#a5b4fc', textAlign: 'center', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 2.2, value: 0, easing: 'ease-out' }, { time: 2.8, value: 1, easing: 'ease-out' }], y: [{ time: 2.2, value: 400, easing: 'ease-out' }, { time: 2.8, value: 380, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 8. Social Stats Pop ──────────────────────────────────────────────────
  {
    id: 'soc_stats_pop',
    name: 'Social Stats Pop',
    category: 'Engagement',
    duration: 5,
    fps: 30,
    width: 1080,
    height: 1080,
    background: '#18181b',
    schema: [
      { id: 'views',  label: 'Views Count',   layerId: 'sp_views_num',  property: 'text' },
      { id: 'likes',  label: 'Likes Count',   layerId: 'sp_likes_num',  property: 'text' },
      { id: 'handle', label: 'Your Handle',   layerId: 'sp_handle',     property: 'text' },
    ],
    layers: [
      { id: 'sp_bg_circle', name: 'BG Circle', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 540, y: 540, width: 900, height: 900, rotation: 0, opacity: 0.05, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { scaleX: [{ time: 0, value: 0, easing: 'spring' }, { time: 1, value: 1, easing: 'spring' }], scaleY: [{ time: 0, value: 0, easing: 'spring' }, { time: 1, value: 1, easing: 'spring' }], opacity: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 0.5, value: 0.05, easing: 'ease-out' }] }
      },
      { id: 'sp_views_card', name: 'Views Card', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 540, y: 360, width: 0, height: 200, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#27272a', stroke: '#3f3f46', strokeWidth: 1, borderRadius: 20 },
        keyframes: { width: [{ time: 0.4, value: 0, easing: 'spring' }, { time: 1.1, value: 700, easing: 'spring' }] }
      },
      { id: 'sp_views_icon', name: 'Views Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 540, y: 310, width: 660, height: 60, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '👁 VIEWS', fontSize: 18, fontFamily: 'Inter, sans-serif', fontWeight: '500', color: '#71717a', textAlign: 'center', letterSpacing: 4 },
        keyframes: { opacity: [{ time: 0.9, value: 0, easing: 'ease-out' }, { time: 1.4, value: 1, easing: 'ease-out' }] }
      },
      { id: 'sp_views_num', name: 'Views Number', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 540, y: 370, width: 660, height: 110, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '2.4M', fontSize: 96, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: -2 },
        keyframes: { opacity: [{ time: 1, value: 0, easing: 'spring' }, { time: 1.6, value: 1, easing: 'spring' }], scaleX: [{ time: 1, value: 0.5, easing: 'spring' }, { time: 1.6, value: 1, easing: 'spring' }], scaleY: [{ time: 1, value: 0.5, easing: 'spring' }, { time: 1.6, value: 1, easing: 'spring' }] }
      },
      { id: 'sp_likes_card', name: 'Likes Card', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 540, y: 640, width: 0, height: 180, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 16 },
        keyframes: { width: [{ time: 0.7, value: 0, easing: 'spring' }, { time: 1.4, value: 700, easing: 'spring' }] }
      },
      { id: 'sp_likes_icon', name: 'Likes Icon', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 540, y: 600, width: 660, height: 50, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '❤️ LIKES', fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: '500', color: 'rgba(255,255,255,0.7)', textAlign: 'center', letterSpacing: 4 },
        keyframes: { opacity: [{ time: 1.3, value: 0, easing: 'ease-out' }, { time: 1.8, value: 1, easing: 'ease-out' }] }
      },
      { id: 'sp_likes_num', name: 'Likes Number', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 540, y: 652, width: 660, height: 90, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '148K', fontSize: 80, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: -2 },
        keyframes: { opacity: [{ time: 1.4, value: 0, easing: 'spring' }, { time: 2, value: 1, easing: 'spring' }], scaleX: [{ time: 1.4, value: 0.5, easing: 'spring' }, { time: 2, value: 1, easing: 'spring' }], scaleY: [{ time: 1.4, value: 0.5, easing: 'spring' }, { time: 2, value: 1, easing: 'spring' }] }
      },
      { id: 'sp_handle', name: 'Handle', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 540, y: 820, width: 700, height: 50, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '@yourchannel', fontSize: 26, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#71717a', textAlign: 'center', letterSpacing: 1 },
        keyframes: { opacity: [{ time: 2, value: 0, easing: 'ease-out' }, { time: 2.6, value: 1, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 9. Viral Hook Text ───────────────────────────────────────────────────
  {
    id: 'soc_viral_hook',
    name: 'Viral Hook Text',
    category: 'Text Animation',
    duration: 5,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#000000',
    schema: [
      { id: 'hook1', label: 'Hook Line 1', layerId: 'vh_line1', property: 'text' },
      { id: 'hook2', label: 'Hook Line 2', layerId: 'vh_line2', property: 'text' },
      { id: 'hook3', label: 'Hook Line 3', layerId: 'vh_line3', property: 'text' },
      { id: 'accent', label: 'Accent Color', layerId: 'vh_accent', property: 'fill' },
    ],
    layers: [
      { id: 'vh_accent', name: 'Accent Bar', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 80, y: 360, width: 8, height: 0, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 4 },
        keyframes: { height: [{ time: 0.3, value: 0, easing: 'ease-out' }, { time: 1.2, value: 280, easing: 'ease-out' }], y: [{ time: 0.3, value: 360, easing: 'ease-out' }, { time: 1.2, value: 220, easing: 'ease-out' }] }
      },
      { id: 'vh_line1', name: 'Hook Line 1', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 680, y: 240, width: 1050, height: 100, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Nobody tells you this', fontSize: 72, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#ffffff', textAlign: 'left', letterSpacing: -1 },
        keyframes: { opacity: [{ time: 0.4, value: 0, easing: 'ease-out' }, { time: 0.9, value: 1, easing: 'ease-out' }], x: [{ time: 0.4, value: 640, easing: 'ease-out' }, { time: 0.9, value: 680, easing: 'ease-out' }] }
      },
      { id: 'vh_line2', name: 'Hook Line 2', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 680, y: 360, width: 1050, height: 100, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'about going viral,', fontSize: 72, fontFamily: 'Inter, sans-serif', fontWeight: '800', color: '#6366f1', textAlign: 'left', letterSpacing: -1 },
        keyframes: { opacity: [{ time: 0.8, value: 0, easing: 'ease-out' }, { time: 1.3, value: 1, easing: 'ease-out' }], x: [{ time: 0.8, value: 640, easing: 'ease-out' }, { time: 1.3, value: 680, easing: 'ease-out' }] }
      },
      { id: 'vh_line3', name: 'Hook Line 3', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 680, y: 478, width: 1050, height: 100, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'until it\'s too late.', fontSize: 72, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#888888', textAlign: 'left', letterSpacing: -1 },
        keyframes: { opacity: [{ time: 1.3, value: 0, easing: 'ease-out' }, { time: 1.9, value: 1, easing: 'ease-out' }], x: [{ time: 1.3, value: 640, easing: 'ease-out' }, { time: 1.9, value: 680, easing: 'ease-out' }] }
      },
    ]
  },

  // ── 10. Call To Action ───────────────────────────────────────────────────
  {
    id: 'soc_cta',
    name: 'Call To Action',
    category: 'Engagement',
    duration: 6,
    fps: 30,
    width: 1280,
    height: 720,
    background: '#0f0f1a',
    schema: [
      { id: 'headline', label: 'Headline',      layerId: 'cta_headline', property: 'text' },
      { id: 'subtext',  label: 'Sub Text',      layerId: 'cta_sub',      property: 'text' },
      { id: 'btnLabel', label: 'Button Label',  layerId: 'cta_btn_txt',  property: 'text' },
      { id: 'btnColor', label: 'Button Color',  layerId: 'cta_btn',      property: 'fill' },
    ],
    layers: [
      { id: 'cta_glow', name: 'BG Glow', type: 'shape', visible: true, locked: false, blendMode: 'screen',
        properties: { x: 640, y: 380, width: 800, height: 600, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, shapeType: 'circle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 0 },
        keyframes: { opacity: [{ time: 0, value: 0, easing: 'ease-out' }, { time: 1.5, value: 0.12, easing: 'ease-out' }], scaleX: [{ time: 0, value: 0.5, easing: 'ease-out' }, { time: 1.5, value: 1, easing: 'ease-out' }], scaleY: [{ time: 0, value: 0.5, easing: 'ease-out' }, { time: 1.5, value: 1, easing: 'ease-out' }] }
      },
      { id: 'cta_headline', name: 'Headline', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 270, width: 1100, height: 140, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Ready to Go Viral?', fontSize: 82, fontFamily: 'Inter, sans-serif', fontWeight: '900', color: '#ffffff', textAlign: 'center', letterSpacing: -2 },
        keyframes: { opacity: [{ time: 0.5, value: 0, easing: 'ease-out' }, { time: 1.2, value: 1, easing: 'ease-out' }], y: [{ time: 0.5, value: 300, easing: 'ease-out' }, { time: 1.2, value: 270, easing: 'ease-out' }] }
      },
      { id: 'cta_sub', name: 'Sub Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 380, width: 900, height: 60, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: 'Join 120,000+ creators using Motion Studio today', fontSize: 24, fontFamily: 'Inter, sans-serif', fontWeight: '300', color: '#a5b4fc', textAlign: 'center', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 1, value: 0, easing: 'ease-out' }, { time: 1.7, value: 1, easing: 'ease-out' }], y: [{ time: 1, value: 400, easing: 'ease-out' }, { time: 1.7, value: 380, easing: 'ease-out' }] }
      },
      { id: 'cta_btn', name: 'CTA Button', type: 'shape', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 500, width: 0, height: 68, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1, shapeType: 'rectangle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 34 },
        keyframes: { width: [{ time: 1.5, value: 0, easing: 'spring' }, { time: 2.2, value: 340, easing: 'spring' }] }
      },
      { id: 'cta_btn_txt', name: 'Button Text', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 500, width: 340, height: 68, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '🚀 Start Free Today', fontSize: 20, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 0.5 },
        keyframes: { opacity: [{ time: 2, value: 0, easing: 'ease-out' }, { time: 2.5, value: 1, easing: 'ease-out' }] }
      },
      { id: 'cta_stars', name: 'Stars', type: 'text', visible: true, locked: false, blendMode: 'normal',
        properties: { x: 640, y: 595, width: 400, height: 36, rotation: 0, opacity: 0, scaleX: 1, scaleY: 1, text: '⭐⭐⭐⭐⭐  Rated 4.9/5 by 8,000+ creators', fontSize: 16, fontFamily: 'Inter, sans-serif', fontWeight: '400', color: '#6b7280', textAlign: 'center', letterSpacing: 0 },
        keyframes: { opacity: [{ time: 2.5, value: 0, easing: 'ease-out' }, { time: 3.1, value: 1, easing: 'ease-out' }] }
      },
    ]
  },
];
