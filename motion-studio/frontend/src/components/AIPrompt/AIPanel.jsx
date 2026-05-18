import React, { useState } from 'react';
import { useStudio } from '../../store/useStudio.js';
import { api } from '../../utils/api.js';

const STYLE_PRESETS = [
  'Neon / Cyberpunk', 'Minimalist / Clean', 'Retro / Vintage',
  'Corporate / Professional', 'Playful / Cartoon', 'Cinematic / Dark',
];

const PROMPT_EXAMPLES = [
  'Kinetic typography intro, 10s, bold white text on black, bounce and fade',
  'Logo reveal with particles, 5s, purple gradient, spring easing',
  'Lower third title card, 3s, professional blue, slide in from left',
  'Countdown timer 5 to 0, neon green, glitch effect',
  'Social media outro, 8s, colorful, with subscribe button animation',
];

export default function AIPanel() {
  const { template, setTemplate, isGenerating, setIsGenerating, aiSuggestions, setAiSuggestions } = useStudio();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('');
  const [duration, setDuration] = useState(5);
  const [error, setError] = useState('');
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [applyingIdx, setApplyingIdx] = useState(null);

  const generate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError('');
    try {
      const { template: t } = await api.generateTemplate(prompt, style, duration);
      setTemplate(t);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const getSuggestions = async () => {
    setSuggestLoading(true);
    setError('');
    try {
      const { suggestions } = await api.getSuggestions(template);
      setAiSuggestions(suggestions || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setSuggestLoading(false);
    }
  };

  const applySuggestion = async (idx, suggestion) => {
    setApplyingIdx(idx);
    try {
      const { template: updated } = await api.applySuggestion(template, suggestion.description);
      setTemplate(updated);
      setAiSuggestions(aiSuggestions.filter((_, i) => i !== idx));
    } catch (e) {
      setError(e.message);
    } finally {
      setApplyingIdx(null);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Generate section */}
      <div className="p-3 border-b border-studio-border">
        <div className="text-xs font-semibold text-studio-muted uppercase tracking-wider mb-2">
          ✦ Generate Template
        </div>

        <textarea
          className="input resize-none text-sm"
          rows={4}
          placeholder="Describe your animation... e.g. 'Kinetic typography intro, 10 seconds, neon style, with bounce and fade transitions'"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) generate(); }}
        />

        <div className="flex gap-2 mt-2">
          <select className="input text-xs flex-1" value={style} onChange={e => setStyle(e.target.value)}>
            <option value="">Style preset…</option>
            {STYLE_PRESETS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input className="input text-xs w-20" type="number" min={1} max={300} value={duration}
            onChange={e => setDuration(parseInt(e.target.value) || 5)}
            title="Duration (seconds)" placeholder="Dur (s)" />
        </div>

        <button
          className="btn btn-primary w-full mt-2 flex items-center justify-center gap-2"
          onClick={generate}
          disabled={isGenerating || !prompt.trim()}
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating…
            </>
          ) : '✦ Generate with AI'}
        </button>

        {error && <div className="mt-2 text-xs text-red-400 bg-red-900/20 rounded p-2">{error}</div>}
      </div>

      {/* Example prompts */}
      <div className="p-3 border-b border-studio-border">
        <div className="text-xs font-semibold text-studio-muted uppercase tracking-wider mb-2">Examples</div>
        <div className="flex flex-col gap-1">
          {PROMPT_EXAMPLES.map((ex, i) => (
            <button
              key={i}
              className="text-left text-xs text-studio-muted hover:text-studio-text hover:bg-studio-border rounded px-2 py-1 transition-colors"
              onClick={() => setPrompt(ex)}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* AI Suggestions */}
      <div className="p-3 flex-1">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold text-studio-muted uppercase tracking-wider">AI Suggestions</div>
          <button
            className="btn btn-ghost text-xs px-2 py-1"
            onClick={getSuggestions}
            disabled={suggestLoading || template.layers.length === 0}
          >
            {suggestLoading ? '…' : '↻ Analyze'}
          </button>
        </div>

        {aiSuggestions.length === 0 && (
          <p className="text-xs text-studio-muted">
            Click "Analyze" to get AI suggestions for improving your current template.
          </p>
        )}

        <div className="flex flex-col gap-2">
          {aiSuggestions.map((s, i) => (
            <div key={i} className="bg-studio-bg rounded border border-studio-border p-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold text-studio-text">{s.title}</div>
                  <div className="text-xs text-studio-muted mt-0.5">{s.description}</div>
                  <div className="mt-1">
                    <span className="text-[10px] bg-studio-accent/20 text-studio-accent rounded px-1.5 py-0.5">
                      {s.category}
                    </span>
                  </div>
                </div>
                <button
                  className="btn btn-primary text-xs px-2 py-1 flex-shrink-0"
                  onClick={() => applySuggestion(i, s)}
                  disabled={applyingIdx === i}
                >
                  {applyingIdx === i ? '…' : 'Apply'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
