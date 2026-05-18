# Motion Studio — Setup Guide

## Prerequisites
- Node.js 18+
- An Anthropic API key

## Quick Start

### 1. Install dependencies

```bash
cd motion-studio

# Install frontend deps
cd frontend && npm install && cd ..

# Install backend deps
cd backend && npm install && cd ..
```

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 3. Run in development

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd backend
node server.js
# Runs on http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

Open http://localhost:5173 in your browser.

---

## Features

| Feature | How to use |
|---|---|
| Add layers | Click T / ◆ / 🖼 in the toolbar, or drag onto canvas |
| AI generate | Click "✦ AI" panel → type prompt → Generate |
| Edit properties | Select a layer → right panel shows all properties |
| Keyframes | Click the ◆ button next to any property while time is set |
| Playback | Use the transport bar (▶ / ⏸) |
| Undo/Redo | Ctrl+Z / Ctrl+Y |
| Delete layer | Select + Delete key, or × in layer list |
| Save project | Click 💾 Save (stored as JSON in backend/data/templates/) |
| Export JSON | Export panel → JSON Template |
| Export video | Export panel → WebM Video (requires puppeteer) |
| Export AE script | Export panel → After Effects Script |

## Example AI prompts
- `Kinetic typography intro, 10 seconds, neon style, bounce and fade`
- `Logo reveal with purple particles, 5 seconds, spring easing`
- `Lower third title card, 3 seconds, professional blue, slide from left`
- `Countdown 5 to 0, neon green glow, glitch effect`

## Project structure

```
motion-studio/
├── frontend/               React + Vite + Tailwind
│   └── src/
│       ├── App.jsx         Root layout
│       ├── store/          Zustand state (useStudio.js)
│       ├── utils/          Animation math + API client
│       └── components/
│           ├── Canvas/     Drag/drop canvas renderer
│           ├── Timeline/   Keyframe timeline editor
│           ├── PropertyPanel/  Transform & style inspector
│           ├── AIPrompt/   AI generation + suggestions
│           ├── Toolbar/    Top toolbar & layer tools
│           ├── LayerList   Left panel layer list
│           ├── ExportPanel Export options
│           └── LibraryPanel Saved projects library
└── backend/                Node.js + Express
    ├── server.js
    └── routes/
        ├── ai.js           Claude API integration
        ├── templates.js    CRUD for saved projects
        └── export.js       JSON / WebM / AE export
```

## Deploy to cloud

1. Build frontend: `cd frontend && npm run build`
2. Serve `frontend/dist` as static files from the backend or a CDN
3. Set `ANTHROPIC_API_KEY` in your cloud environment
4. Deploy backend to any Node.js host (Railway, Render, Fly.io, etc.)
