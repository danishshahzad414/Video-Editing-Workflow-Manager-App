import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useStudio } from '../../store/useStudio.js';
import {
  ENTRANCE_STYLES, EXIT_STYLES, EASING_OPTIONS,
  applyEntranceAnimation, applyExitAnimation,
} from '../../utils/animationPresets.js';

const TABS = ['Edit', 'Motion', 'Transform', 'Keyframes'];
const FONTS = [
  'Inter, sans-serif', 'Georgia, serif', 'Courier New, monospace',
  '"Helvetica Neue", sans-serif', 'Arial, sans-serif', 'Verdana, sans-serif',
  '"Times New Roman", serif', 'Impact, sans-serif', 'system-ui, sans-serif',
];

export default function PropertyPanel() {
  const { template, selectedLayerId, currentTime,
    updateLayerProperty, updateLayer, addKeyframe, updateTemplate } = useStudio();
  const [tab, setTab] = useState('Edit');
  const layer = template.layers.find(l => l.id === selectedLayerId);

  if (!layer) return <TemplateProperties />;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Layer name header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-studio-border bg-studio-bg/60 flex-shrink-0">
        <span className="text-xs font-semibold text-studio-text truncate flex-1">{layer.name}</span>
        <span className="text-[10px] text-studio-muted bg-studio-border px-1.5 py-0.5 rounded">{layer.type}</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-studio-border flex-shrink-0">
        {TABS.map(t => (
          <button
            key={t}
            className={`flex-1 py-1.5 text-[11px] font-medium transition-colors
              ${tab === t ? 'text-studio-accent border-b-2 border-studio-accent bg-studio-accent/5' : 'text-studio-muted hover:text-studio-text'}`}
            onClick={() => setTab(t)}
          >{t}</button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {tab === 'Edit'      && <EditTab      layer={layer} updateLayerProperty={updateLayerProperty} updateLayer={updateLayer} />}
        {tab === 'Motion'    && <MotionTab    layer={layer} duration={template.duration} />}
        {tab === 'Transform' && <TransformTab layer={layer} time={currentTime} updateLayerProperty={updateLayerProperty} addKeyframe={addKeyframe} />}
        {tab === 'Keyframes' && <KeyframesTab layer={layer} time={currentTime} updateLayerProperty={updateLayerProperty} addKeyframe={addKeyframe} />}
      </div>
    </div>
  );
}

// ── EDIT TAB ────────────────────────────────────────────────────────────────
function EditTab({ layer, updateLayerProperty, updateLayer }) {
  const p = layer.properties;

  return (
    <div className="p-3 flex flex-col gap-3">
      {/* Visibility + lock */}
      <div className="flex gap-3">
        <Toggle label="Visible" value={layer.visible} onChange={v => updateLayer(layer.id, { visible: v })} />
        <Toggle label="Locked"  value={layer.locked}  onChange={v => updateLayer(layer.id, { locked:  v })} />
      </div>

      {/* Text-specific */}
      {layer.type === 'text' && (
        <>
          <Field label="Text Content">
            <textarea
              className="input resize-none text-sm leading-relaxed"
              rows={3}
              value={p.text || ''}
              onChange={e => updateLayerProperty(layer.id, 'text', e.target.value)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-2">
            <Field label="Font Size">
              <div className="flex items-center gap-1">
                <input className="input" type="number" min={6} max={400} value={p.fontSize || 48}
                  onChange={e => updateLayerProperty(layer.id, 'fontSize', +e.target.value)} />
                <span className="text-xs text-studio-muted">px</span>
              </div>
            </Field>
            <Field label="Weight">
              <select className="input" value={p.fontWeight || '700'}
                onChange={e => updateLayerProperty(layer.id, 'fontWeight', e.target.value)}>
                {[['100','Thin'],['300','Light'],['400','Regular'],['500','Medium'],['600','SemiBold'],['700','Bold'],['800','ExtraBold'],['900','Black']].map(([v,l]) =>
                  <option key={v} value={v}>{l}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Font Family">
            <select className="input" value={p.fontFamily || 'Inter, sans-serif'}
              onChange={e => updateLayerProperty(layer.id, 'fontFamily', e.target.value)}>
              {FONTS.map(f => <option key={f} value={f}>{f.split(',')[0]}</option>)}
            </select>
          </Field>

          <Field label="Text Color">
            <ColorField value={p.color || '#ffffff'} onChange={c => updateLayerProperty(layer.id, 'color', c)} />
          </Field>

          <div className="grid grid-cols-2 gap-2">
            <Field label="Align">
              <div className="flex gap-1">
                {['left','center','right'].map(a => (
                  <button key={a}
                    className={`flex-1 py-1 text-xs rounded border transition-colors
                      ${p.textAlign === a ? 'border-studio-accent bg-studio-accent/20 text-studio-accent' : 'border-studio-border text-studio-muted hover:border-studio-accent/40'}`}
                    onClick={() => updateLayerProperty(layer.id, 'textAlign', a)}>
                    {a === 'left' ? '⬤⬤' : a === 'center' ? '⬤⬤' : '⬤⬤'}
                    {a[0].toUpperCase()}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Tracking">
              <div className="flex items-center gap-1">
                <input className="input" type="number" step={0.5} value={p.letterSpacing || 0}
                  onChange={e => updateLayerProperty(layer.id, 'letterSpacing', +e.target.value)} />
                <span className="text-xs text-studio-muted">px</span>
              </div>
            </Field>
          </div>
        </>
      )}

      {/* Shape-specific */}
      {layer.type === 'shape' && (
        <>
          <Field label="Shape Type">
            <div className="flex gap-1">
              {[['rectangle','▭'],['circle','●'],['triangle','▲']].map(([v,icon]) => (
                <button key={v}
                  className={`flex-1 py-2 text-sm rounded border transition-colors
                    ${p.shapeType === v ? 'border-studio-accent bg-studio-accent/20 text-studio-accent' : 'border-studio-border text-studio-muted hover:border-studio-accent/40'}`}
                  onClick={() => updateLayerProperty(layer.id, 'shapeType', v)}>
                  {icon}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Fill Color">
            <ColorField value={p.fill || '#6366f1'} onChange={c => updateLayerProperty(layer.id, 'fill', c)} />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Stroke Color">
              <ColorField value={p.stroke || 'transparent'} onChange={c => updateLayerProperty(layer.id, 'stroke', c)} />
            </Field>
            <Field label="Stroke W">
              <input className="input" type="number" min={0} value={p.strokeWidth || 0}
                onChange={e => updateLayerProperty(layer.id, 'strokeWidth', +e.target.value)} />
            </Field>
          </div>
          <Field label="Corner Radius">
            <Slider min={0} max={200} value={p.borderRadius || 0}
              onChange={v => updateLayerProperty(layer.id, 'borderRadius', v)} />
          </Field>
        </>
      )}

      {/* Image */}
      {layer.type === 'image' && (
        <Field label="Image URL">
          <input className="input text-xs" placeholder="https://..." value={p.src || ''}
            onChange={e => updateLayerProperty(layer.id, 'src', e.target.value)} />
        </Field>
      )}

      {/* Blend mode — all types */}
      <Field label="Blend Mode">
        <select className="input" value={layer.blendMode || 'normal'}
          onChange={e => updateLayer(layer.id, { blendMode: e.target.value })}>
          {['normal','multiply','screen','overlay','darken','lighten','color-dodge','color-burn','hard-light','soft-light','difference','exclusion'].map(m =>
            <option key={m} value={m}>{m}</option>)}
        </select>
      </Field>
    </div>
  );
}

// ── MOTION TAB ──────────────────────────────────────────────────────────────
function MotionTab({ layer, duration }) {
  const { updateLayer } = useStudio();

  // Store motion settings on the layer itself for easy re-apply
  const motion = layer.motion || {
    entrance: 'fade-in', entranceStart: 0, entranceDuration: 0.6, entranceEasing: 'ease-out', entranceOffset: 120,
    exit: 'none',        exitStart: duration - 0.6,   exitDuration: 0.5,    exitEasing: 'ease-in',
  };

  const setMotion = (updates) => {
    const newMotion = { ...motion, ...updates };
    // Apply the animations and update the layer's keyframes
    let kf = applyEntranceAnimation(layer, newMotion.entrance, {
      startTime: newMotion.entranceStart,
      duration:  newMotion.entranceDuration,
      easing:    newMotion.entranceEasing,
      offsetAmount: newMotion.entranceOffset,
    });
    kf = applyExitAnimation({ ...layer, keyframes: kf }, newMotion.exit, {
      startTime: newMotion.exitStart,
      duration:  newMotion.exitDuration,
      easing:    newMotion.exitEasing,
    });
    updateLayer(layer.id, { motion: newMotion, keyframes: kf });
  };

  return (
    <div className="p-3 flex flex-col gap-4">
      {/* Entrance */}
      <Section title="✦ Entrance Animation">
        <div className="grid grid-cols-2 gap-1.5 mb-3">
          {ENTRANCE_STYLES.map(s => (
            <button
              key={s.id}
              title={s.desc}
              className={`flex items-center gap-1.5 px-2 py-2 rounded border text-left transition-all
                ${motion.entrance === s.id
                  ? 'border-studio-accent bg-studio-accent/15 text-studio-text'
                  : 'border-studio-border text-studio-muted hover:border-studio-accent/40 hover:bg-studio-accent/5'}`}
              onClick={() => setMotion({ entrance: s.id })}
            >
              <span className="text-base w-5 text-center flex-shrink-0">{s.icon}</span>
              <span className="text-[11px] font-medium truncate">{s.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Field label="Start (s)">
            <input className="input" type="number" min={0} step={0.1} value={motion.entranceStart}
              onChange={e => setMotion({ entranceStart: +e.target.value })} />
          </Field>
          <Field label="Duration (s)">
            <input className="input" type="number" min={0.1} step={0.1} value={motion.entranceDuration}
              onChange={e => setMotion({ entranceDuration: +e.target.value })} />
          </Field>
        </div>
        <Field label="Easing">
          <select className="input" value={motion.entranceEasing}
            onChange={e => setMotion({ entranceEasing: e.target.value })}>
            {EASING_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </Field>
        {['slide-left','slide-right','slide-up','slide-down'].includes(motion.entrance) && (
          <Field label="Slide Offset (px)">
            <Slider min={20} max={500} value={motion.entranceOffset || 120}
              onChange={v => setMotion({ entranceOffset: v })} />
          </Field>
        )}
      </Section>

      {/* Exit */}
      <Section title="✦ Exit Animation">
        <div className="grid grid-cols-3 gap-1.5 mb-3">
          {EXIT_STYLES.map(s => (
            <button
              key={s.id}
              className={`flex items-center gap-1 px-2 py-2 rounded border text-left transition-all
                ${motion.exit === s.id
                  ? 'border-studio-accent bg-studio-accent/15 text-studio-text'
                  : 'border-studio-border text-studio-muted hover:border-studio-accent/40'}`}
              onClick={() => setMotion({ exit: s.id })}
            >
              <span className="text-sm w-4 text-center">{s.icon}</span>
              <span className="text-[10px] font-medium truncate">{s.name}</span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Start (s)">
            <input className="input" type="number" min={0} step={0.1} value={motion.exitStart}
              onChange={e => setMotion({ exitStart: +e.target.value })} />
          </Field>
          <Field label="Duration (s)">
            <input className="input" type="number" min={0.1} step={0.1} value={motion.exitDuration}
              onChange={e => setMotion({ exitDuration: +e.target.value })} />
          </Field>
        </div>
      </Section>

      <button
        className="btn btn-primary w-full mt-1"
        onClick={() => setMotion({})}
      >↻ Re-apply Animation</button>
    </div>
  );
}

// ── TRANSFORM TAB ────────────────────────────────────────────────────────────
function TransformTab({ layer, time, updateLayerProperty, addKeyframe }) {
  const p = layer.properties;

  const NumField = ({ label, prop, step = 1, min, max }) => (
    <Field label={label}>
      <div className="flex items-center gap-1">
        <input className="input" type="number" step={step} min={min} max={max}
          value={typeof p[prop] === 'number' ? +p[prop].toFixed(2) : (p[prop] ?? 0)}
          onChange={e => updateLayerProperty(layer.id, prop, +e.target.value)} />
        <button
          title="Set keyframe"
          className={`w-6 h-6 rounded text-[10px] flex-shrink-0 flex items-center justify-center transition-colors
            ${(layer.keyframes?.[prop]?.length ?? 0) > 0
              ? 'bg-studio-accent text-white'
              : 'bg-studio-border text-studio-muted hover:bg-studio-accent/30'}`}
          onClick={() => addKeyframe(layer.id, prop, time, p[prop] ?? 0)}
        >◆</button>
      </div>
    </Field>
  );

  return (
    <div className="p-3 flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <NumField label="X" prop="x" />
        <NumField label="Y" prop="y" />
        <NumField label="Width"  prop="width"  min={1} />
        <NumField label="Height" prop="height" min={1} />
      </div>
      <Field label="Rotation">
        <Slider min={-180} max={180} value={p.rotation || 0}
          onChange={v => updateLayerProperty(layer.id, 'rotation', v)} />
      </Field>
      <Field label="Opacity">
        <Slider min={0} max={1} step={0.01} value={p.opacity ?? 1}
          onChange={v => updateLayerProperty(layer.id, 'opacity', v)}
          display={v => `${Math.round(v * 100)}%`} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Scale X">
          <input className="input" type="number" step={0.01} value={+(p.scaleX ?? 1).toFixed(2)}
            onChange={e => updateLayerProperty(layer.id, 'scaleX', +e.target.value)} />
        </Field>
        <Field label="Scale Y">
          <input className="input" type="number" step={0.01} value={+(p.scaleY ?? 1).toFixed(2)}
            onChange={e => updateLayerProperty(layer.id, 'scaleY', +e.target.value)} />
        </Field>
      </div>

      {/* 3D section */}
      <div className="border-t border-studio-border pt-2 mt-1">
        <div className="text-[10px] font-bold text-studio-muted uppercase tracking-wider mb-2">3D Transforms</div>
        <Field label="Perspective">
          <Slider min={100} max={2000} step={50} value={p.perspective ?? 800}
            onChange={v => updateLayerProperty(layer.id, 'perspective', v)} />
        </Field>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Field label="Rotate X°">
            <input className="input" type="number" step={1} min={-180} max={180} value={+(p.rotateX ?? 0)}
              onChange={e => updateLayerProperty(layer.id, 'rotateX', +e.target.value)} />
          </Field>
          <Field label="Rotate Y°">
            <input className="input" type="number" step={1} min={-180} max={180} value={+(p.rotateY ?? 0)}
              onChange={e => updateLayerProperty(layer.id, 'rotateY', +e.target.value)} />
          </Field>
          <Field label="Skew X°">
            <input className="input" type="number" step={1} value={+(p.skewX ?? 0)}
              onChange={e => updateLayerProperty(layer.id, 'skewX', +e.target.value)} />
          </Field>
          <Field label="Skew Y°">
            <input className="input" type="number" step={1} value={+(p.skewY ?? 0)}
              onChange={e => updateLayerProperty(layer.id, 'skewY', +e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Visual Effects */}
      <div className="border-t border-studio-border pt-2 mt-1">
        <div className="text-[10px] font-bold text-studio-muted uppercase tracking-wider mb-2">Visual Effects</div>
        <Field label="Blur (px)">
          <Slider min={0} max={40} value={p.blur ?? 0}
            onChange={v => updateLayerProperty(layer.id, 'blur', v)} />
        </Field>
        <Field label="Brightness">
          <Slider min={0} max={3} step={0.05} value={p.brightness ?? 1}
            onChange={v => updateLayerProperty(layer.id, 'brightness', v)}
            display={v => `${Math.round(v * 100)}%`} />
        </Field>
      </div>
    </div>
  );
}

// ── KEYFRAMES TAB ─────────────────────────────────────────────────────────────
function KeyframesTab({ layer, time, updateLayerProperty, addKeyframe }) {
  const p  = layer.properties;
  const kf = layer.keyframes || {};
  const { deleteKeyframe } = useStudio();

  const PROPS = ['x','y','width','height','opacity','rotation','scaleX','scaleY','rotateX','rotateY','skewX','skewY','blur','brightness'];

  return (
    <div className="p-3 flex flex-col gap-3">
      <p className="text-xs text-studio-muted">
        ◆ click to add keyframe at current time ({time.toFixed(2)}s).<br/>
        Right-click a keyframe to delete it.
      </p>
      {PROPS.map(prop => {
        const frames = kf[prop] || [];
        return (
          <div key={prop} className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-studio-muted font-medium">{prop}</span>
              <button
                className="text-[10px] bg-studio-border hover:bg-studio-accent/30 text-studio-muted hover:text-white px-1.5 py-0.5 rounded transition-colors"
                onClick={() => addKeyframe(layer.id, prop, time, p[prop] ?? 0)}
              >+ Add @ {time.toFixed(1)}s</button>
            </div>
            <div className="flex flex-wrap gap-1">
              {frames.length === 0
                ? <span className="text-[10px] text-studio-muted/50 italic">No keyframes</span>
                : frames.map((k, i) => (
                  <button
                    key={i}
                    title={`t=${k.time.toFixed(2)} v=${typeof k.value === 'number' ? k.value.toFixed(2) : k.value} [${k.easing}] — right-click to delete`}
                    className="text-[10px] bg-studio-accent/20 text-studio-accent border border-studio-accent/30 rounded px-1.5 py-0.5 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400 transition-colors"
                    onContextMenu={e => { e.preventDefault(); deleteKeyframe(layer.id, prop, k.time); }}
                  >
                    {k.time.toFixed(1)}s
                  </button>
                ))
              }
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── TEMPLATE PROPERTIES (no layer selected) ──────────────────────────────────
function TemplateProperties() {
  const { template, updateTemplate } = useStudio();
  return (
    <div className="p-3 flex flex-col gap-3 overflow-y-auto h-full">
      <div className="text-xs font-semibold text-studio-muted uppercase tracking-wider">Project Settings</div>
      <Field label="Name">
        <input className="input" value={template.name}
          onChange={e => updateTemplate({ name: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Duration (s)">
          <input className="input" type="number" min={1} max={300} value={template.duration}
            onChange={e => updateTemplate({ duration: parseFloat(e.target.value) || 5 })} />
        </Field>
        <Field label="FPS">
          <select className="input" value={template.fps}
            onChange={e => updateTemplate({ fps: parseInt(e.target.value) })}>
            {[24, 30, 60].map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </Field>
        <Field label="Width">
          <input className="input" type="number" value={template.width}
            onChange={e => updateTemplate({ width: parseInt(e.target.value) || 1280 })} />
        </Field>
        <Field label="Height">
          <input className="input" type="number" value={template.height}
            onChange={e => updateTemplate({ height: parseInt(e.target.value) || 720 })} />
        </Field>
      </div>
      <Field label="Background Color">
        <ColorField value={template.background} onChange={c => updateTemplate({ background: c })} />
      </Field>
      <div className="mt-2 p-2 bg-studio-bg rounded border border-studio-border text-xs text-studio-muted">
        Select a layer on the canvas or from the layer list to edit it.<br/>
        Use the <strong className="text-studio-text">Motion</strong> tab to add entrance animations with one click.
      </div>
    </div>
  );
}

// ── SHARED COMPONENTS ──────────────────────────────────────────────────────────

function Section({ title, children }) {
  return (
    <div>
      <div className="text-[11px] font-semibold text-studio-muted uppercase tracking-wider mb-2">{title}</div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] text-studio-muted">{label}</span>
      {children}
    </div>
  );
}

function Toggle({ label, value, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        className={`w-8 h-4 rounded-full transition-colors relative ${value ? 'bg-studio-accent' : 'bg-studio-border'}`}
        onClick={() => onChange(!value)}
      >
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${value ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-xs text-studio-muted">{label}</span>
    </label>
  );
}

function Slider({ min, max, step = 1, value, onChange, display }) {
  return (
    <div className="flex items-center gap-2">
      <input
        className="flex-1 accent-indigo-500 h-1.5"
        type="range" min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(+e.target.value)}
        style={{ cursor: 'pointer' }}
      />
      <span className="text-xs text-studio-text w-10 text-right flex-shrink-0">
        {display ? display(value) : value}
      </span>
    </div>
  );
}

function ColorField({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const safe = value && value !== 'transparent' ? value : '#000000';
  return (
    <div className="relative">
      <div
        className="flex items-center gap-2 cursor-pointer input"
        onClick={() => setOpen(v => !v)}
      >
        <div className="w-5 h-5 rounded border border-white/10 flex-shrink-0"
          style={{ background: value === 'transparent' ? 'repeating-conic-gradient(#aaa 0% 25%, #fff 0% 50%) 0 0 / 8px 8px' : value }} />
        <span className="text-xs font-mono truncate">{value}</span>
      </div>
      {open && (
        <div className="absolute z-50 top-full left-0 mt-1 p-3 bg-studio-panel border border-studio-border rounded-lg shadow-2xl"
          style={{ minWidth: 220 }}>
          <HexColorPicker color={safe} onChange={onChange} style={{ width: '100%' }} />
          <input className="input mt-2 font-mono text-xs" value={value}
            onChange={e => onChange(e.target.value)} />
          <div className="flex gap-1 mt-2">
            <button className="btn btn-ghost text-xs flex-1" onClick={() => onChange('transparent')}>Transparent</button>
            <button className="btn btn-primary text-xs flex-1" onClick={() => setOpen(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
