import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useStudio } from '../../store/useStudio.js';
import { computeLayerProps } from '../../utils/animation.js';

export default function Canvas() {
  const {
    template, currentTime, selectedLayerId, zoom,
    selectLayer, deselectLayer, updateLayerProperty, addKeyframe, setZoom,
  } = useStudio();

  const containerRef   = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [hovered, setHovered]   = useState(null);

  const { width, height, background, layers } = template;

  // ── Fit canvas to viewport on load ────────────────────────────────────────
  useEffect(() => {
    const fit = () => {
      const el = containerRef.current?.parentElement?.parentElement;
      if (!el) return;
      const vw = el.clientWidth  - 80;
      const vh = el.clientHeight - 80;
      const scale = Math.min(vw / width, vh / height, 1);
      setZoom(Math.max(0.1, +scale.toFixed(2)));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height]);

  // ── Drag logic ─────────────────────────────────────────────────────────────
  const onLayerMouseDown = useCallback((e, layerId) => {
    e.stopPropagation();
    selectLayer(layerId);
    const layer = template.layers.find(l => l.id === layerId);
    if (!layer || layer.locked) return;
    setDragging({
      layerId,
      startX: e.clientX,
      startY: e.clientY,
      origX:  layer.properties.x,
      origY:  layer.properties.y,
    });
  }, [template.layers, selectLayer]);

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e) => {
      const dx = (e.clientX - dragging.startX) / zoom;
      const dy = (e.clientY - dragging.startY) / zoom;
      updateLayerProperty(dragging.layerId, 'x', dragging.origX + dx);
      updateLayerProperty(dragging.layerId, 'y', dragging.origY + dy);
    };
    const onUp = () => {
      const layer = template.layers.find(l => l.id === dragging.layerId);
      if (layer) {
        addKeyframe(dragging.layerId, 'x', currentTime, layer.properties.x);
        addKeyframe(dragging.layerId, 'y', currentTime, layer.properties.y);
      }
      setDragging(null);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging, zoom, currentTime, template.layers, updateLayerProperty, addKeyframe]);

  // ── Drop ───────────────────────────────────────────────────────────────────
  const onCanvasDrop = useCallback((e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('layer-type');
    if (!type) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top)  / zoom;
    const id = useStudio.getState().addLayer(type);
    setTimeout(() => {
      useStudio.getState().updateLayerProperty(id, 'x', x);
      useStudio.getState().updateLayerProperty(id, 'y', y);
    }, 0);
  }, [zoom]);

  // ── Wheel zoom ─────────────────────────────────────────────────────────────
  const onWheel = useCallback((e) => {
    if (!e.ctrlKey && !e.metaKey) return;
    e.preventDefault();
    setZoom(zoom + (e.deltaY < 0 ? 0.05 : -0.05));
  }, [zoom, setZoom]);

  useEffect(() => {
    const el = containerRef.current?.parentElement;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  const canvasStyle = {
    width,
    height,
    background,
    position: 'relative',
    overflow: 'hidden',
    flexShrink: 0,
    boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
  };

  return (
    <div
      className="flex-1 flex items-center justify-center overflow-hidden bg-[#060609] relative"
      onClick={() => deselectLayer()}
      onDrop={onCanvasDrop}
      onDragOver={e => e.preventDefault()}
    >
      {/* Grid dots background */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle, #3a3a50 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
        <div ref={containerRef} style={canvasStyle}>
          {[...layers].reverse().map(layer => {
            if (!layer.visible) return null;
            return (
              <CanvasLayer
                key={layer.id}
                layer={layer}
                time={currentTime}
                selected={layer.id === selectedLayerId}
                hovered={layer.id === hovered}
                onMouseDown={onLayerMouseDown}
                onMouseEnter={() => setHovered(layer.id)}
                onMouseLeave={() => setHovered(null)}
              />
            );
          })}
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-3 right-3 text-xs text-studio-muted bg-studio-panel/80 backdrop-blur px-2 py-1 rounded border border-studio-border">
        {Math.round(zoom * 100)}% · Ctrl+Scroll to zoom
      </div>
    </div>
  );
}

function CanvasLayer({ layer, time, selected, hovered, onMouseDown, onMouseEnter, onMouseLeave }) {
  const computed = computeLayerProps(layer, time);
  const p = layer.properties;

  // Build CSS transform — supports full 3D
  const has3D = computed.rotateX !== 0 || computed.rotateY !== 0;
  const transformStr = [
    has3D ? `perspective(${computed.perspective}px)` : '',
    computed.rotateX !== 0 ? `rotateX(${computed.rotateX}deg)` : '',
    computed.rotateY !== 0 ? `rotateY(${computed.rotateY}deg)` : '',
    `rotate(${computed.rotation}deg)`,
    `scale(${computed.scaleX},${computed.scaleY})`,
    computed.skewX !== 0 ? `skewX(${computed.skewX}deg)` : '',
    computed.skewY !== 0 ? `skewY(${computed.skewY}deg)` : '',
  ].filter(Boolean).join(' ');

  // CSS filter (blur, brightness)
  const filterParts = [];
  if (computed.blur      > 0) filterParts.push(`blur(${computed.blur}px)`);
  if (computed.brightness !== 1) filterParts.push(`brightness(${computed.brightness})`);

  const style = {
    position:        'absolute',
    left:            computed.x - computed.width  / 2,
    top:             computed.y - computed.height / 2,
    width:           computed.width,
    height:          computed.height,
    opacity:         computed.opacity,
    transform:       transformStr,
    transformOrigin: 'center center',
    transformStyle:  has3D ? 'preserve-3d' : undefined,
    backfaceVisibility: 'hidden',
    cursor:          layer.locked ? 'default' : 'move',
    userSelect:      'none',
    mixBlendMode:    layer.blendMode || 'normal',
    filter:          filterParts.length ? filterParts.join(' ') : undefined,
    outline:         selected ? '2px solid #6366f1' : hovered && !layer.locked ? '1px dashed rgba(99,102,241,0.5)' : 'none',
    outlineOffset:   '1px',
    transition:      'outline 0.1s',
    display:         'flex',
    alignItems:      'center',
    justifyContent:  'center',
  };

  let content = null;

  if (layer.type === 'text') {
    content = (
      <div style={{
        width:         '100%',
        height:        '100%',
        display:       'flex',
        alignItems:    'center',
        justifyContent: p.textAlign === 'left' ? 'flex-start' : p.textAlign === 'right' ? 'flex-end' : 'center',
        fontSize:      (p.fontSize || 48) + 'px',
        fontFamily:    p.fontFamily || 'Inter, sans-serif',
        fontWeight:    p.fontWeight || '700',
        color:         p.color || '#ffffff',
        textAlign:     p.textAlign || 'center',
        letterSpacing: (p.letterSpacing || 0) + 'px',
        whiteSpace:    'pre-wrap',
        wordBreak:     'break-word',
        lineHeight:    1.2,
        padding:       '4px 8px',
      }}>
        {p.text || 'Text'}
      </div>
    );
  } else if (layer.type === 'shape') {
    const shapeStyle = {
      width:        '100%',
      height:       '100%',
      background:   p.fill || '#6366f1',
      borderRadius: p.shapeType === 'circle' ? '50%' : (p.borderRadius || 0) + 'px',
      border:       p.strokeWidth > 0 ? `${p.strokeWidth}px solid ${p.stroke || 'transparent'}` : 'none',
    };
    if (p.shapeType === 'triangle') {
      content = (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'visible' }}>
          <div style={{
            width: 0, height: 0, position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            borderLeft:   `${computed.width / 2}px solid transparent`,
            borderRight:  `${computed.width / 2}px solid transparent`,
            borderBottom: `${computed.height}px solid ${p.fill || '#6366f1'}`,
          }} />
        </div>
      );
    } else {
      content = <div style={shapeStyle} />;
    }
  } else if (layer.type === 'image') {
    content = p.src ? (
      <img src={p.src} alt="" style={{ width: '100%', height: '100%', objectFit: p.objectFit || 'cover', borderRadius: (p.borderRadius || 0) + 'px' }} />
    ) : (
      <div style={{ width: '100%', height: '100%', background: '#1a1a22', border: '1.5px dashed #3a3a50', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#6b6b8a', fontSize: 12 }}>Drop image URL in Properties</span>
      </div>
    );
  }

  return (
    <div
      style={style}
      onMouseDown={e => onMouseDown(e, layer.id)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {content}
      {selected && !layer.locked && <ResizeHandles />}
    </div>
  );
}

function ResizeHandles() {
  const positions = [
    { top: -4, left: -4,   cursor: 'nw-resize' },
    { top: -4, right: -4,  cursor: 'ne-resize' },
    { bottom: -4, left: -4,  cursor: 'sw-resize' },
    { bottom: -4, right: -4, cursor: 'se-resize' },
    { top: '50%', right: -4, cursor: 'e-resize',  transform: 'translateY(-50%)' },
    { top: '50%', left:  -4, cursor: 'w-resize',  transform: 'translateY(-50%)' },
    { top: -4, left: '50%', cursor: 'n-resize',  transform: 'translateX(-50%)' },
    { bottom: -4, left: '50%', cursor: 's-resize', transform: 'translateX(-50%)' },
  ];
  return (
    <>
      {positions.map((pos, i) => (
        <div key={i} style={{
          position: 'absolute', width: 8, height: 8,
          background: '#6366f1', border: '1.5px solid #fff',
          borderRadius: 2, zIndex: 10,
          ...pos,
        }} />
      ))}
    </>
  );
}
