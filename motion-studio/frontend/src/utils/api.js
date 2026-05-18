const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  // AI
  generateTemplate: (prompt, style, duration) =>
    request('/ai/generate', { method: 'POST', body: JSON.stringify({ prompt, style, duration }) }),
  getSuggestions: (template, focus) =>
    request('/ai/suggest', { method: 'POST', body: JSON.stringify({ template, focus }) }),
  applySuggestion: (template, suggestion) =>
    request('/ai/apply-suggestion', { method: 'POST', body: JSON.stringify({ template, suggestion }) }),

  // Templates
  listTemplates: () => request('/templates'),
  getTemplate: (id) => request(`/templates/${id}`),
  saveTemplate: (template) =>
    request('/templates', { method: 'POST', body: JSON.stringify({ template }) }),
  deleteTemplate: (id) =>
    request(`/templates/${id}`, { method: 'DELETE' }),

  // Export
  exportJSON: async (template) => {
    const res = await fetch(BASE + '/export/json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template }),
    });
    const blob = await res.blob();
    downloadBlob(blob, `${template.name || 'template'}.json`);
  },
  exportVideo: async (template) => {
    const res = await fetch(BASE + '/export/video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template }),
    });
    const blob = await res.blob();
    downloadBlob(blob, `${template.name || 'animation'}.webm`);
  },
  exportAEScript: async (template) => {
    const res = await fetch(BASE + '/export/aescript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template }),
    });
    const blob = await res.blob();
    downloadBlob(blob, `${template.name || 'template'}.jsx`);
  },
};

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
