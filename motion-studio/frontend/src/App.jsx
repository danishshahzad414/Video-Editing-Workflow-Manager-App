import React, { useEffect, useCallback } from 'react';
import Toolbar      from './components/Toolbar/Toolbar.jsx';
import Canvas       from './components/Canvas/Canvas.jsx';
import Timeline     from './components/Timeline/Timeline.jsx';
import PropertyPanel from './components/PropertyPanel/PropertyPanel.jsx';
import AIPanel      from './components/AIPrompt/AIPanel.jsx';
import ExportPanel  from './components/ExportPanel.jsx';
import LibraryPanel from './components/LibraryPanel.jsx';
import PresetsPanel from './components/PresetsPanel.jsx';
import LayerList    from './components/LayerList.jsx';
import { useStudio } from './store/useStudio.js';

const RIGHT_PANELS = {
  presets:    PresetsPanel,
  properties: PropertyPanel,
  ai:         AIPanel,
  export:     ExportPanel,
  library:    LibraryPanel,
};

export default function App() {
  const { activePanel, undo, redo } = useStudio();

  // Global keyboard shortcuts
  const onKeyDown = useCallback((e) => {
    const target = e.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') { e.preventDefault(); undo(); }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) { e.preventDefault(); redo(); }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const { selectedLayerId, deleteLayer } = useStudio.getState();
      if (selectedLayerId) { e.preventDefault(); deleteLayer(selectedLayerId); }
    }
    if (e.key === 'Escape') useStudio.getState().deselectLayer();
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
      e.preventDefault();
      const { selectedLayerId, duplicateLayer } = useStudio.getState();
      if (selectedLayerId) duplicateLayer(selectedLayerId);
    }
  }, [undo, redo]);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  const RightPanel = RIGHT_PANELS[activePanel] || PresetsPanel;

  return (
    <div className="flex flex-col h-screen bg-studio-bg text-studio-text overflow-hidden">
      {/* Top toolbar */}
      <Toolbar />

      {/* Body */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left: Layers */}
        <div className="w-44 flex-shrink-0 flex flex-col border-r border-studio-border bg-studio-panel overflow-hidden">
          <LayerList />
        </div>

        {/* Center: Canvas */}
        <Canvas />

        {/* Right: Panel */}
        <div className="w-64 flex-shrink-0 flex flex-col border-l border-studio-border bg-studio-panel overflow-hidden">
          <RightPanel />
        </div>
      </div>

      {/* Bottom: Timeline */}
      <Timeline />
    </div>
  );
}
