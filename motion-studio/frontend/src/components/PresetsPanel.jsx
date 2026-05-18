import React, { useState, useEffect, useRef } from 'react';
import { useStudio } from '../store/useStudio.js';
import { PRESET_TEMPLATES } from '../data/presets.js';
import { MOTION_GRAPHICS } from '../data/motionGraphics.js';
import { SOCIAL_TEMPLATES } from '../data/socialTemplates.js';
import { PREMIUM_TEMPLATES } from '../data/premiumTemplates.js';
import { computeLayerProps } from '../utils/animation.js';

const GROUPS = [
  { label: '📱 Social',    items: SOCIAL_TEMPLATES  },
  { label: '⭐ Premium',   items: PREMIUM_TEMPLATES },
  { label: '🎨 Templates', items: PRESET_TEMPLATES  },
  { label: '✦ Motion',    items: MOTION_GRAPHICS   },
];

export default function PresetsPanel() {
  const { setTemplate, template: currentTemplate } = useStudio();
  const [activeGroup, setActiveGroup] = useState(0);
  const [selected, setSelected]       = useState(null); // loaded preset id
  const [editMode, setEditMode]       = useState(null); // preset being quick-edited
  const [search, setSearch]           = useState('');

  const items = GROUPS[activeGroup].items.filter(p =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const load = (preset) => {
    setTemplate(JSON.parse(JSON.stringify(preset)));
    setSelected(preset.id);
    setEditMode(null);
  };

  const openEdit = (preset, e) => {
    e.stopPropagation();
    if (!preset.schema) return;
    // Load it first, then open edit mode
    const clone = JSON.parse(JSON.stringify(preset));
    setTemplate(clone);
    setSelected(preset.id);
    setEditMode(preset.id);
  };

  if (editMode) {
    const preset = [...SOCIAL_TEMPLATES, ...PREMIUM_TEMPLATES, ...PRESET_TEMPLATES, ...MOTION_GRAPHICS]
      .find(p => p.id === editMode);
    return (
      <QuickEditForm
        preset={preset}
        onBack={() => setEditMode(null)}
      />
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search */}
      <div className="px-2 pt-2 pb-1 flex-shrink-0">
        <input
          className="input text-xs"
          placeholder="Search templates…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Group tabs */}
      <div className="flex border-b border-studio-border flex-shrink-0">
        {GROUPS.map((g, i) => (
          <button key={i}
            className={`flex-1 py-1.5 text-[10px] font-semibold transition-colors whitespace-nowrap px-1
              ${activeGroup === i ? 'text-studio-accent border-b-2 border-studio-accent bg-studio-accent/5' : 'text-studio-muted hover:text-studio-text'}`}
            onClick={() => { setActiveGroup(i); setSearch(''); }}
          >{g.label}</button>
        ))}
      </div>

      {/* Template grid */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-2">
        {items.length === 0 && (
          <div className="text-xs text-studio-muted text-center py-8">No templates found</div>
        )}
        {items.map((preset, i) => (
          <PresetCard
            key={preset.id}
            preset={preset}
            isLoaded={selected === preset.id}
            onLoad={() => load(preset)}
            onEdit={preset.schema ? (e) => openEdit(preset, e) : null}
          />
        ))}
      </div>
    </div>
  );
}

// ── Animated preview card ───────────────────────────────────────────────────
function PresetCard({ preset, isLoaded, onLoad, onEdit }) {
  return (
    <div
      className={`rounded-lg border overflow-hidden cursor-pointer group transition-all
        ${isLoaded
          ? 'border-studio-accent bg-studio-accent/5'
          : 'border-studio-border bg-studio-bg hover:border-studio-accent/40'}`}
      onClick={onLoad}
    >
      {/* Animated canvas preview */}
      <AnimatedPreview preset={preset} />

      {/* Info row */}
      <div className="px-2.5 py-2 flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-studio-text truncate">{preset.name}</div>
          <div className="text-[10px] text-studio-muted mt-0.5 flex items-center gap-1.5">
            {preset.category && <span className="bg-studio-border px-1.5 py-0.5 rounded">{preset.category}</span>}
            <span>{preset.duration}s · {preset.layers.length} layers</span>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {onEdit && (
            <button
              className="text-[10px] px-2 py-1 rounded border border-studio-border text-studio-muted hover:text-studio-text hover:border-studio-accent/40 transition-colors"
              onClick={onEdit}
            >Edit ✏️</button>
          )}
          <span className={`text-[10px] font-medium ${isLoaded ? 'text-studio-accent' : 'text-studio-muted group-hover:text-studio-accent'}`}>
            {isLoaded ? '✓' : '→'}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Canvas preview that animates continuously ───────────────────────────────
function AnimatedPreview({ preset }) {
  const canvasRef  = useRef(null);
  const raf        = useRef(null);
  const startTime  = useRef(performance.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    const scaleX = W / preset.width;
    const scaleY = H / preset.height;

    const draw = () => {
      const elapsed = (performance.now() - startTime.current) / 1000;
      const time    = elapsed % preset.duration;

      // Background
      ctx.fillStyle = preset.background || '#000';
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.scale(scaleX, scaleY);

      const visLayers = [...preset.layers].filter(l => l.visible);
      visLayers.forEach(layer => {
        const comp = computeLayerProps(layer, time);
        const p    = layer.properties;

        ctx.save();
        ctx.globalAlpha = comp.opacity;
        ctx.translate(comp.x, comp.y);
        ctx.rotate((comp.rotation * Math.PI) / 180);
        ctx.scale(comp.scaleX || 1, comp.scaleY || 1);

        const hw = comp.width  / 2;
        const hh = comp.height / 2;

        if (layer.type === 'shape') {
          const fill = p.fill && p.fill !== 'transparent' ? p.fill : null;
          if (fill) ctx.fillStyle = fill;

          ctx.beginPath();
          if (p.shapeType === 'circle') {
            ctx.arc(0, 0, Math.min(hw, hh), 0, Math.PI * 2);
          } else if (p.shapeType === 'triangle') {
            ctx.moveTo(0, -hh); ctx.lineTo(hw, hh); ctx.lineTo(-hw, hh); ctx.closePath();
          } else {
            const r = Math.min(p.borderRadius || 0, hw, hh);
            ctx.roundRect(-hw, -hh, comp.width, comp.height, r);
          }
          if (fill) ctx.fill();
          if (p.strokeWidth > 0 && p.stroke && p.stroke !== 'transparent') {
            ctx.strokeStyle = p.stroke;
            ctx.lineWidth   = p.strokeWidth;
            ctx.stroke();
          }
        } else if (layer.type === 'text') {
          const fs = Math.max(1, (p.fontSize || 24) * (scaleX < scaleY ? 1 : 1));
          ctx.font        = `${p.fontWeight || '700'} ${p.fontSize || 24}px ${(p.fontFamily || 'Inter').split(',')[0].trim()}`;
          ctx.fillStyle   = p.color || '#ffffff';
          ctx.textAlign   = p.textAlign || 'center';
          ctx.textBaseline = 'middle';
          const lines = (p.text || '').split('\n');
          const lh    = (p.fontSize || 24) * 1.25;
          lines.forEach((line, i) => {
            const yOff = -((lines.length - 1) * lh) / 2 + i * lh;
            ctx.fillText(line, 0, yOff);
          });
        }
        ctx.restore();
      });

      ctx.restore();
      raf.current = requestAnimationFrame(draw);
    };

    raf.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf.current);
  }, [preset]);

  return (
    <canvas
      ref={canvasRef}
      width={240}
      height={135}
      style={{ width: '100%', height: 135, display: 'block', background: preset.background || '#000', pointerEvents: 'none' }}
    />
  );
}

// ── Quick-edit form for social templates ────────────────────────────────────
function QuickEditForm({ preset, onBack }) {
  const { template, updateLayerProperty } = useStudio();
  const [values, setValues] = useState(() => {
    const init = {};
    preset.schema?.forEach(field => {
      const layer = template.layers.find(l => l.id === field.layerId);
      if (layer) init[field.id] = layer.properties[field.property] ?? '';
    });
    return init;
  });

  const handleChange = (field, value) => {
    setValues(v => ({ ...v, [field.id]: value }));
    updateLayerProperty(field.layerId, field.property, value);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-studio-border bg-studio-bg/60 flex-shrink-0">
        <button className="btn btn-ghost text-xs px-2" onClick={onBack}>← Back</button>
        <span className="text-xs font-semibold text-studio-text truncate">{preset.name}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        <p className="text-xs text-studio-muted">
          Edit these fields to customise the template. Changes appear live in the canvas.
        </p>

        {preset.schema?.map(field => (
          <div key={field.id} className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-studio-muted">{field.label}</label>
            {field.property === 'color' || field.property === 'fill' ? (
              <ColorFieldSimple
                value={values[field.id] || '#ffffff'}
                onChange={v => handleChange(field, v)}
              />
            ) : (
              <textarea
                className="input text-sm resize-none"
                rows={2}
                value={values[field.id] || ''}
                onChange={e => handleChange(field, e.target.value)}
              />
            )}
          </div>
        ))}

        <div className="border-t border-studio-border pt-3 text-xs text-studio-muted">
          For advanced edits (fonts, timing, animations) — select a layer on the canvas and use the <strong className="text-studio-text">Properties</strong> panel.
        </div>
      </div>
    </div>
  );
}

function ColorFieldSimple({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <input type="color" value={value.startsWith('#') ? value : '#6366f1'}
        onChange={e => onChange(e.target.value)}
        className="w-10 h-8 rounded cursor-pointer border border-studio-border bg-transparent" />
      <input className="input flex-1 font-mono text-xs" value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}
