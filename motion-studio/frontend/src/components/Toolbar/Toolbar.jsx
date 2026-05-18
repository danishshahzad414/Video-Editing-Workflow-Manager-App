import React, { useState } from 'react';
import { useStudio } from '../../store/useStudio.js';
import { api } from '../../utils/api.js';

const PANELS = [
  { key: 'presets',    label: '⬡ Templates' },
  { key: 'properties', label: '⚙ Properties' },
  { key: 'ai',         label: '✦ AI' },
  { key: 'export',     label: '↗ Export' },
  { key: 'library',    label: '🗂 Library' },
];

export default function Toolbar() {
  const {
    template, addLayer, undo, redo, historyIndex, history,
    setActivePanel, activePanel, setZoom, zoom, isDirty, setLastSaved,
    isPlaying, setIsPlaying,
  } = useStudio();

  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try { await api.saveTemplate(template); setLastSaved(new Date().toISOString()); }
    catch (e) { console.error(e); }
    finally { setSaving(false); }
  };

  return (
    <div className="flex items-center gap-2 px-3 h-12 bg-studio-panel border-b border-studio-border flex-shrink-0">
      {/* Wordmark */}
      <div className="flex items-center gap-2 mr-3 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-black text-white shadow-lg">M</div>
        <span className="text-sm font-bold text-studio-text hidden md:block">Motion Studio</span>
      </div>

      {/* Add layer */}
      <div className="flex items-center gap-0.5 border-r border-studio-border pr-3 flex-shrink-0">
        {[['text','T','Add Text'],['shape','◆','Add Shape'],['image','🖼','Add Image']].map(([type,icon,title]) => (
          <button key={type} title={title}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-studio-border text-studio-muted hover:text-studio-text text-sm transition-colors"
            onClick={() => addLayer(type)}
            draggable onDragStart={e => e.dataTransfer.setData('layer-type', type)}
          >{icon}</button>
        ))}
      </div>

      {/* Undo/Redo */}
      <div className="flex items-center gap-0.5 border-r border-studio-border pr-3 flex-shrink-0">
        <button title="Undo (Ctrl+Z)" className="w-8 h-8 flex items-center justify-center rounded hover:bg-studio-border text-studio-muted hover:text-studio-text text-sm transition-colors disabled:opacity-30"
          disabled={historyIndex <= 0} onClick={undo}>↩</button>
        <button title="Redo (Ctrl+Y)" className="w-8 h-8 flex items-center justify-center rounded hover:bg-studio-border text-studio-muted hover:text-studio-text text-sm transition-colors disabled:opacity-30"
          disabled={historyIndex >= history.length - 1} onClick={redo}>↪</button>
      </div>

      {/* Zoom */}
      <div className="flex items-center gap-1 border-r border-studio-border pr-3 flex-shrink-0">
        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-studio-border text-studio-muted text-sm" onClick={() => setZoom(zoom - 0.1)}>−</button>
        <button className="text-xs text-studio-muted hover:text-studio-text w-10 text-center" onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-studio-border text-studio-muted text-sm" onClick={() => setZoom(zoom + 0.1)}>+</button>
      </div>

      {/* Panel switcher */}
      <div className="flex items-center gap-0.5 flex-1">
        {PANELS.map(({ key, label }) => (
          <button key={key}
            className={`px-2.5 h-7 rounded text-xs font-medium transition-colors whitespace-nowrap
              ${activePanel === key
                ? 'bg-studio-accent text-white'
                : 'text-studio-muted hover:text-studio-text hover:bg-studio-border'}`}
            onClick={() => setActivePanel(key)}
          >{label}</button>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {isDirty && <span className="text-[10px] text-studio-muted hidden sm:block">● Unsaved</span>}
        <button
          className="h-7 px-3 rounded text-xs font-medium bg-studio-border text-studio-muted hover:text-studio-text hover:bg-studio-border/80 transition-colors"
          onClick={save} disabled={saving}
        >{saving ? '…' : '💾 Save'}</button>
      </div>
    </div>
  );
}
