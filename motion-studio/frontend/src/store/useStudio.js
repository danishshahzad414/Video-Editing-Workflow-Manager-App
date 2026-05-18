import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const uuidv4 = () => crypto.randomUUID();

const DEFAULT_TEMPLATE = {
  id: null,
  name: 'Untitled Project',
  duration: 5,
  fps: 30,
  width: 1280,
  height: 720,
  background: '#0f0f13',
  layers: [],
};

const MAX_HISTORY = 50;

export const useStudio = create(
  immer((set, get) => ({
    // Project state
    template: DEFAULT_TEMPLATE,
    selectedLayerId: null,
    selectedKeyframe: null,

    // Playback
    currentTime: 0,
    isPlaying: true,
    playbackSpeed: 1,
    isLooping: true,

    // UI state
    activePanel: 'presets', // 'presets' | 'properties' | 'ai' | 'export'
    zoom: 1,

    // History (undo/redo)
    history: [DEFAULT_TEMPLATE],
    historyIndex: 0,

    // AI
    aiSuggestions: [],
    isGenerating: false,

    // Save state
    lastSaved: null,
    isDirty: false,

    // ── Template mutations ──────────────────────────────────────────────

    setTemplate(template) {
      set(state => {
        const newHistory = state.history.slice(0, state.historyIndex + 1);
        newHistory.push(template);
        if (newHistory.length > MAX_HISTORY) newHistory.shift();
        state.template = template;
        state.history = newHistory;
        state.historyIndex = newHistory.length - 1;
        state.isDirty = true;
      });
    },

    updateTemplate(updates) {
      set(state => {
        Object.assign(state.template, updates);
        state.isDirty = true;
        pushHistory(state);
      });
    },

    // ── Layer mutations ─────────────────────────────────────────────────

    addLayer(type) {
      const id = uuidv4();
      const defaults = getLayerDefaults(type, get().template);
      set(state => {
        state.template.layers.push({ id, name: `${type} ${state.template.layers.length + 1}`, type, visible: true, locked: false, blendMode: 'normal', properties: defaults, keyframes: {}, });
        state.selectedLayerId = id;
        state.isDirty = true;
        pushHistory(state);
      });
      return id;
    },

    updateLayer(id, updates) {
      set(state => {
        const layer = state.template.layers.find(l => l.id === id);
        if (layer) Object.assign(layer, updates);
        state.isDirty = true;
      });
    },

    updateLayerProperty(id, prop, value) {
      set(state => {
        const layer = state.template.layers.find(l => l.id === id);
        if (layer) layer.properties[prop] = value;
        state.isDirty = true;
      });
    },

    deleteLayer(id) {
      set(state => {
        state.template.layers = state.template.layers.filter(l => l.id !== id);
        if (state.selectedLayerId === id) state.selectedLayerId = null;
        state.isDirty = true;
        pushHistory(state);
      });
    },

    duplicateLayer(id) {
      set(state => {
        const layer = state.template.layers.find(l => l.id === id);
        if (!layer) return;
        const copy = JSON.parse(JSON.stringify(layer));
        copy.id = uuidv4();
        copy.name = layer.name + ' copy';
        copy.properties.x = (copy.properties.x || 0) + 20;
        copy.properties.y = (copy.properties.y || 0) + 20;
        state.template.layers.push(copy);
        state.selectedLayerId = copy.id;
        state.isDirty = true;
        pushHistory(state);
      });
    },

    reorderLayers(fromIdx, toIdx) {
      set(state => {
        const layers = state.template.layers;
        const [moved] = layers.splice(fromIdx, 1);
        layers.splice(toIdx, 0, moved);
        state.isDirty = true;
      });
    },

    // ── Keyframe mutations ──────────────────────────────────────────────

    addKeyframe(layerId, property, time, value, easing = 'ease') {
      set(state => {
        const layer = state.template.layers.find(l => l.id === layerId);
        if (!layer) return;
        if (!layer.keyframes[property]) layer.keyframes[property] = [];
        const existing = layer.keyframes[property].findIndex(k => Math.abs(k.time - time) < 0.01);
        if (existing >= 0) {
          layer.keyframes[property][existing] = { time, value, easing };
        } else {
          layer.keyframes[property].push({ time, value, easing });
          layer.keyframes[property].sort((a, b) => a.time - b.time);
        }
        state.isDirty = true;
      });
    },

    deleteKeyframe(layerId, property, time) {
      set(state => {
        const layer = state.template.layers.find(l => l.id === layerId);
        if (!layer || !layer.keyframes[property]) return;
        layer.keyframes[property] = layer.keyframes[property].filter(k => Math.abs(k.time - time) >= 0.01);
        state.isDirty = true;
      });
    },

    // ── Playback ────────────────────────────────────────────────────────

    setCurrentTime(t) {
      set(state => { state.currentTime = Math.max(0, Math.min(t, state.template.duration)); });
    },

    setIsPlaying(v) { set(state => { state.isPlaying = v; }); },
    setPlaybackSpeed(v) { set(state => { state.playbackSpeed = v; }); },
    setIsLooping(v) { set(state => { state.isLooping = v; }); },

    // ── Selection ───────────────────────────────────────────────────────

    selectLayer(id) { set(state => { state.selectedLayerId = id; }); },
    deselectLayer() { set(state => { state.selectedLayerId = null; }); },

    // ── History ─────────────────────────────────────────────────────────

    undo() {
      set(state => {
        if (state.historyIndex > 0) {
          state.historyIndex--;
          state.template = state.history[state.historyIndex];
        }
      });
    },

    redo() {
      set(state => {
        if (state.historyIndex < state.history.length - 1) {
          state.historyIndex++;
          state.template = state.history[state.historyIndex];
        }
      });
    },

    // ── AI ──────────────────────────────────────────────────────────────

    setIsGenerating(v) { set(state => { state.isGenerating = v; }); },
    setAiSuggestions(s) { set(state => { state.aiSuggestions = s; }); },

    // ── UI ──────────────────────────────────────────────────────────────

    setActivePanel(p) { set(state => { state.activePanel = p; }); },
    setZoom(z) { set(state => { state.zoom = Math.max(0.1, Math.min(z, 4)); }); },
    setLastSaved(t) { set(state => { state.lastSaved = t; state.isDirty = false; }); },
  }))
);

function pushHistory(state) {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(JSON.parse(JSON.stringify(state.template)));
  if (newHistory.length > MAX_HISTORY) newHistory.shift();
  state.history = newHistory;
  state.historyIndex = newHistory.length - 1;
}

function getLayerDefaults(type, template) {
  const cx = template.width / 2;
  const cy = template.height / 2;
  const base = { x: cx, y: cy, width: 200, height: 80, rotation: 0, opacity: 1, scaleX: 1, scaleY: 1 };
  switch (type) {
    case 'text':
      return { ...base, text: 'Edit me', fontSize: 48, fontFamily: 'Inter, sans-serif', fontWeight: '700', color: '#ffffff', textAlign: 'center', letterSpacing: 0 };
    case 'shape':
      return { ...base, shapeType: 'rectangle', fill: '#6366f1', stroke: 'transparent', strokeWidth: 0, borderRadius: 8 };
    case 'image':
      return { ...base, src: '', objectFit: 'cover' };
    default:
      return base;
  }
}
