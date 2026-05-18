import React, { useState } from 'react';
import { useStudio } from '../store/useStudio.js';
import { applyEntranceAnimation } from '../utils/animationPresets.js';

const TYPE_ICON = { text: 'T', shape: '◆', image: '🖼', group: '▣' };
const TYPE_COLOR = { text: '#6366f1', shape: '#a855f7', image: '#ec4899', group: '#f59e0b' };

export default function LayerList() {
  const {
    template, selectedLayerId, selectLayer, updateLayer,
    deleteLayer, duplicateLayer, reorderLayers, addLayer,
  } = useStudio();
  const { layers } = template;
  const [dragIdx, setDragIdx] = useState(null);

  // Drag-to-reorder
  const onDragStart = (e, idx) => { setDragIdx(idx); e.dataTransfer.effectAllowed = 'move'; };
  const onDragOver  = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    reorderLayers(dragIdx, idx);
    setDragIdx(idx);
  };
  const onDragEnd = () => setDragIdx(null);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-2 h-8 border-b border-studio-border bg-studio-bg/50 flex-shrink-0">
        <span className="text-[10px] font-bold text-studio-muted uppercase tracking-wider">Layers</span>
        <div className="flex gap-0.5">
          {[['text','T'],['shape','◆']].map(([type,icon]) => (
            <button key={type}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-studio-border text-studio-muted hover:text-studio-text text-xs transition-colors"
              title={`Add ${type}`} onClick={() => addLayer(type)}>{icon}</button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {layers.length === 0 && (
          <div className="p-3 text-center">
            <div className="text-2xl mb-1">✦</div>
            <div className="text-xs text-studio-muted">No layers yet</div>
            <div className="text-[10px] text-studio-muted/60 mt-0.5">Load a template or add layers</div>
          </div>
        )}

        {/* Render reversed: top of list = top of visual stack */}
        {[...layers].reverse().map((layer, rIdx) => {
          const actualIdx = layers.length - 1 - rIdx;
          return (
            <LayerRow
              key={layer.id}
              layer={layer}
              selected={layer.id === selectedLayerId}
              onSelect={() => selectLayer(layer.id)}
              onToggleVisible={() => updateLayer(layer.id, { visible: !layer.visible })}
              onToggleLock={() => updateLayer(layer.id, { locked:  !layer.locked })}
              onDelete={() => deleteLayer(layer.id)}
              onDuplicate={() => duplicateLayer(layer.id)}
              idx={actualIdx}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
            />
          );
        })}
      </div>
    </div>
  );
}

function LayerRow({ layer, selected, onSelect, onToggleVisible, onToggleLock, onDelete, onDuplicate, idx, onDragStart, onDragOver, onDragEnd }) {
  const [hover, setHover] = useState(false);
  const icon  = TYPE_ICON[layer.type]  || '?';
  const color = TYPE_COLOR[layer.type] || '#6b6b8a';

  return (
    <div
      className={`flex items-center gap-1.5 px-1.5 border-b border-studio-border/40 cursor-pointer group
        ${selected ? 'bg-indigo-950/60' : 'hover:bg-studio-border/20'}
        ${!layer.visible ? 'opacity-40' : ''}`}
      style={{ height: 32 }}
      onClick={onSelect}
      draggable
      onDragStart={e => onDragStart(e, idx)}
      onDragOver={e  => onDragOver(e, idx)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Type badge */}
      <div className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold flex-shrink-0"
        style={{ background: color + '22', color }}>
        {icon}
      </div>

      {/* Name */}
      <span className="text-xs flex-1 truncate text-studio-text">{layer.name}</span>

      {/* Controls */}
      {(hover || selected) && (
        <div className="flex items-center gap-0.5 flex-shrink-0" onClick={e => e.stopPropagation()}>
          <IconBtn icon={layer.visible ? '👁' : '🚫'} onClick={onToggleVisible} title="Toggle visibility" />
          <IconBtn icon={layer.locked  ? '🔒' : '🔓'} onClick={onToggleLock}    title="Toggle lock"       active={layer.locked} />
          <IconBtn icon="⧉"  onClick={onDuplicate} title="Duplicate" />
          <IconBtn icon="×"  onClick={onDelete}    title="Delete" danger />
        </div>
      )}

      {/* Selected indicator */}
      {selected && <div className="w-0.5 h-full bg-studio-accent absolute left-0 top-0 rounded-r" />}
    </div>
  );
}

function IconBtn({ icon, onClick, title, active, danger }) {
  return (
    <button
      title={title}
      className={`w-5 h-5 flex items-center justify-center rounded text-[10px] transition-colors
        ${danger  ? 'text-studio-muted hover:text-red-400 hover:bg-red-900/20' :
          active  ? 'text-yellow-400' :
                    'text-studio-muted hover:text-studio-text hover:bg-studio-border'}`}
      onClick={onClick}
    >{icon}</button>
  );
}
