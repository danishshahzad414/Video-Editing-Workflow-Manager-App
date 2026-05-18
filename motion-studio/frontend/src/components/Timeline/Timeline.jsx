import React, { useRef, useCallback, useEffect } from 'react';
import { useStudio } from '../../store/useStudio.js';
import { formatTime } from '../../utils/animation.js';

const TRACK_HEIGHT = 32;
const LABEL_WIDTH = 180;
const PX_PER_SEC = 60;

export default function Timeline() {
  const {
    template, currentTime, selectedLayerId, isPlaying,
    setCurrentTime, setIsPlaying, selectLayer, deleteLayer,
    addKeyframe, deleteKeyframe,
  } = useStudio();

  const { layers, duration, fps } = template;
  const rulerRef = useRef(null);
  const scrubbing = useRef(false);

  // ── Scrub on ruler ──────────────────────────────────────────────────────
  const getTimeFromX = useCallback((clientX) => {
    const rect = rulerRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    const x = clientX - rect.left;
    return Math.max(0, Math.min(x / PX_PER_SEC, duration));
  }, [duration]);

  const onRulerMouseDown = useCallback((e) => {
    scrubbing.current = true;
    setIsPlaying(false);
    setCurrentTime(getTimeFromX(e.clientX));
  }, [getTimeFromX, setCurrentTime, setIsPlaying]);

  useEffect(() => {
    const onMove = (e) => { if (scrubbing.current) setCurrentTime(getTimeFromX(e.clientX)); };
    const onUp = () => { scrubbing.current = false; };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [getTimeFromX, setCurrentTime]);

  const totalWidth = Math.max(duration * PX_PER_SEC + 60, 600);

  return (
    <div className="flex flex-col border-t border-studio-border select-none" style={{ height: 220 }}>
      {/* Transport bar */}
      <TransportBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Layer labels */}
        <div className="flex flex-col bg-studio-panel border-r border-studio-border overflow-y-auto overflow-x-hidden flex-shrink-0" style={{ width: LABEL_WIDTH }}>
          <div style={{ height: 24 }} className="border-b border-studio-border bg-studio-bg" />
          {layers.map((layer, i) => (
            <LayerLabel key={layer.id} layer={layer} selected={layer.id === selectedLayerId}
              onSelect={() => selectLayer(layer.id)}
              onDelete={() => deleteLayer(layer.id)}
            />
          ))}
        </div>

        {/* Tracks + ruler */}
        <div className="flex-1 overflow-auto relative">
          <div style={{ width: totalWidth, position: 'relative' }}>
            {/* Ruler */}
            <div
              ref={rulerRef}
              style={{ height: 24, width: totalWidth, position: 'sticky', top: 0, zIndex: 10 }}
              className="bg-studio-bg border-b border-studio-border cursor-pointer timeline-grid"
              onMouseDown={onRulerMouseDown}
            >
              {Array.from({ length: Math.ceil(duration) + 1 }, (_, i) => (
                <div
                  key={i}
                  style={{ position: 'absolute', left: i * PX_PER_SEC, top: 0, width: 1, height: 24 }}
                >
                  <div style={{ position: 'absolute', top: 4, left: 3, fontSize: 9, color: '#6b6b8a', whiteSpace: 'nowrap' }}>
                    {formatTime(i, fps)}
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: 1, height: 8, background: '#2a2a38' }} />
                </div>
              ))}

              {/* Playhead */}
              <div
                style={{
                  position: 'absolute', left: currentTime * PX_PER_SEC, top: 0,
                  width: 1, height: '100vh', background: '#6366f1', zIndex: 20, pointerEvents: 'none',
                }}
              >
                <div style={{ width: 8, height: 8, background: '#6366f1', borderRadius: '50%', marginLeft: -3.5 }} />
              </div>
            </div>

            {/* Layer tracks */}
            {layers.map((layer) => (
              <LayerTrack
                key={layer.id}
                layer={layer}
                selected={layer.id === selectedLayerId}
                currentTime={currentTime}
                duration={duration}
                pxPerSec={PX_PER_SEC}
                onDeleteKeyframe={deleteKeyframe}
                onAddKeyframe={addKeyframe}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TransportBar() {
  const { currentTime, isPlaying, playbackSpeed, isLooping, template,
    setCurrentTime, setIsPlaying, setPlaybackSpeed, setIsLooping } = useStudio();
  const { duration, fps } = template;
  const raf = useRef(null);
  const lastTime = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      lastTime.current = performance.now();
      const tick = (now) => {
        const dt = (now - lastTime.current) / 1000;
        lastTime.current = now;
        const next = useStudio.getState().currentTime + dt * useStudio.getState().playbackSpeed;
        if (next >= duration) {
          if (useStudio.getState().isLooping) setCurrentTime(0);
          else { setCurrentTime(duration); setIsPlaying(false); return; }
        } else {
          setCurrentTime(next);
        }
        raf.current = requestAnimationFrame(tick);
      };
      raf.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(raf.current);
    }
    return () => cancelAnimationFrame(raf.current);
  }, [isPlaying, duration, setCurrentTime, setIsPlaying]);

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 bg-studio-panel border-b border-studio-border text-sm">
      <button className="btn btn-ghost" onClick={() => setCurrentTime(0)}>⏮</button>
      <button className="btn btn-ghost" onClick={() => setCurrentTime(Math.max(0, currentTime - 1 / fps))}>◀</button>
      <button
        className="btn btn-primary px-4"
        onClick={() => setIsPlaying(!isPlaying)}
      >
        {isPlaying ? '⏸' : '▶'}
      </button>
      <button className="btn btn-ghost" onClick={() => setCurrentTime(Math.min(duration, currentTime + 1 / fps))}>▶</button>
      <button className="btn btn-ghost" onClick={() => setCurrentTime(duration)}>⏭</button>

      <span className="text-studio-muted font-mono text-xs ml-2">
        {formatTime(currentTime, fps)} / {formatTime(duration, fps)}
      </span>

      <div className="flex items-center gap-1 ml-auto">
        <span className="text-studio-muted text-xs">Speed:</span>
        {[0.25, 0.5, 1, 1.5, 2].map(s => (
          <button key={s} className={`btn text-xs px-2 py-0.5 ${playbackSpeed === s ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setPlaybackSpeed(s)}>{s}x</button>
        ))}
        <button
          className={`btn text-xs px-2 py-0.5 ml-2 ${isLooping ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setIsLooping(!isLooping)}
        >⟳ Loop</button>
      </div>
    </div>
  );
}

function LayerLabel({ layer, selected, onSelect, onDelete }) {
  return (
    <div
      className={`flex items-center gap-1 px-2 border-b border-studio-border cursor-pointer group
        ${selected ? 'bg-indigo-900/30' : 'hover:bg-studio-border/30'}`}
      style={{ height: TRACK_HEIGHT }}
      onClick={onSelect}
    >
      <span className="text-xs mr-1">
        {layer.type === 'text' ? 'T' : layer.type === 'shape' ? '◆' : '🖼'}
      </span>
      <span className="text-xs flex-1 truncate text-studio-text">{layer.name}</span>
      <button
        className="opacity-0 group-hover:opacity-100 text-studio-muted hover:text-red-400 text-xs px-1"
        onClick={e => { e.stopPropagation(); onDelete(); }}
      >×</button>
    </div>
  );
}

function LayerTrack({ layer, selected, currentTime, duration, pxPerSec, onDeleteKeyframe, onAddKeyframe }) {
  const animatedProps = Object.keys(layer.keyframes || {});

  return (
    <div
      className={`border-b border-studio-border relative ${selected ? 'bg-indigo-900/10' : ''}`}
      style={{ height: TRACK_HEIGHT, width: duration * pxPerSec }}
    >
      {/* Duration bar */}
      <div
        className="absolute top-1/2 -translate-y-1/2 rounded"
        style={{
          left: 0, width: duration * pxPerSec,
          height: 6, background: selected ? '#3730a3' : '#2a2a38',
        }}
      />

      {/* Keyframe diamonds for each animated property */}
      {animatedProps.flatMap(prop =>
        (layer.keyframes[prop] || []).map((kf, i) => (
          <KeyframeDiamond
            key={`${prop}-${i}`}
            time={kf.time}
            prop={prop}
            pxPerSec={pxPerSec}
            onDelete={() => onDeleteKeyframe(layer.id, prop, kf.time)}
          />
        ))
      )}

      {/* Playhead indicator */}
      <div
        style={{
          position: 'absolute', left: currentTime * pxPerSec,
          top: 0, width: 1, height: '100%',
          background: 'rgba(99,102,241,0.4)', pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function KeyframeDiamond({ time, prop, pxPerSec, onDelete }) {
  return (
    <div
      title={`${prop} @ ${time.toFixed(2)}s`}
      className="keyframe-diamond absolute z-10"
      style={{ left: time * pxPerSec - 5, top: '50%', marginTop: -5 }}
      onContextMenu={e => { e.preventDefault(); onDelete(); }}
    />
  );
}
