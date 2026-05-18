import React, { useEffect, useState } from 'react';
import { useStudio } from '../store/useStudio.js';
import { api } from '../utils/api.js';

export default function LibraryPanel() {
  const { setTemplate } = useStudio();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { templates: ts } = await api.listTemplates();
      setTemplates(ts);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const open = async (id) => {
    try {
      const { template } = await api.getTemplate(id);
      setTemplate(template);
    } catch (e) {
      setError(e.message);
    }
  };

  const del = async (id, e) => {
    e.stopPropagation();
    try {
      await api.deleteTemplate(id);
      setTemplates(ts => ts.filter(t => t.id !== id));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="p-3 flex flex-col gap-3 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-studio-muted uppercase tracking-wider">Saved Projects</div>
        <button className="btn btn-ghost text-xs" onClick={load}>↻</button>
      </div>

      {error && <div className="text-xs text-red-400">{error}</div>}

      {loading && <div className="text-xs text-studio-muted">Loading…</div>}

      {!loading && templates.length === 0 && (
        <div className="text-xs text-studio-muted text-center py-8">
          No saved projects yet.<br />Use the Save button to store your work.
        </div>
      )}

      <div className="flex flex-col gap-2">
        {templates.map(t => (
          <div
            key={t.id}
            className="flex items-center gap-2 p-2 rounded border border-studio-border hover:border-studio-accent/40 cursor-pointer group"
            onClick={() => open(t.id)}
          >
            <div className="w-10 h-8 rounded bg-studio-bg border border-studio-border flex items-center justify-center text-xs text-studio-muted flex-shrink-0">
              ▶
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-studio-text truncate">{t.name}</div>
              <div className="text-[10px] text-studio-muted">{t.duration}s</div>
            </div>
            <button
              className="opacity-0 group-hover:opacity-100 btn btn-ghost text-xs text-red-400 hover:text-red-300 px-1"
              onClick={e => del(t.id, e)}
            >×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
