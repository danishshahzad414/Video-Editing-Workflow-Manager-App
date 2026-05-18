import express from 'express';
import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs-extra';
import { fileURLToPath } from 'url';

export const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXPORT_DIR = path.join(__dirname, '../exports');
fs.ensureDirSync(EXPORT_DIR);

// Export as JSON
router.post('/json', async (req, res) => {
  const { template } = req.body;
  if (!template) return res.status(400).json({ error: 'Template required' });
  res.setHeader('Content-Disposition', `attachment; filename="${template.name || 'template'}.json"`);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(template, null, 2));
});

// Export as WebM via Puppeteer screen capture
router.post('/video', async (req, res) => {
  const { template, format = 'webm' } = req.body;
  if (!template) return res.status(400).json({ error: 'Template required' });

  const outputFile = path.join(EXPORT_DIR, `export_${Date.now()}.${format}`);

  try {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: template.width || 1920, height: template.height || 1080 });

    // Render the template using the player HTML
    const playerHTML = generatePlayerHTML(template);
    await page.setContent(playerHTML, { waitUntil: 'networkidle0' });

    // Start recording
    const recorder = await page.screencast({ path: outputFile });
    await page.waitForTimeout((template.duration || 5) * 1000 + 500);
    await recorder.stop();
    await browser.close();

    res.download(outputFile, `${template.name || 'animation'}.${format}`, () => {
      fs.remove(outputFile).catch(() => {});
    });
  } catch (err) {
    console.error('Export error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Export as After Effects JSX script
router.post('/aescript', async (req, res) => {
  const { template } = req.body;
  if (!template) return res.status(400).json({ error: 'Template required' });

  const jsx = generateAEScript(template);
  res.setHeader('Content-Disposition', `attachment; filename="${template.name || 'template'}.jsx"`);
  res.setHeader('Content-Type', 'text/plain');
  res.send(jsx);
});

function generatePlayerHTML(template) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { width: ${template.width}px; height: ${template.height}px; overflow: hidden; background: ${template.background || '#000'}; }
.layer { position: absolute; transform-origin: center center; }
</style>
</head>
<body>
<div id="canvas" style="width:${template.width}px;height:${template.height}px;position:relative;overflow:hidden;background:${template.background}">
</div>
<script>
const template = ${JSON.stringify(template)};
const canvas = document.getElementById('canvas');
const startTime = performance.now();

// Create layer elements
const layerEls = {};
template.layers.forEach(layer => {
  if (!layer.visible) return;
  const el = document.createElement('div');
  el.id = layer.id;
  el.className = 'layer';
  if (layer.type === 'text') {
    el.innerText = layer.properties.text || '';
    el.style.fontSize = (layer.properties.fontSize || 48) + 'px';
    el.style.fontFamily = layer.properties.fontFamily || 'sans-serif';
    el.style.fontWeight = layer.properties.fontWeight || 'normal';
    el.style.color = layer.properties.color || '#ffffff';
    el.style.textAlign = layer.properties.textAlign || 'center';
    el.style.letterSpacing = (layer.properties.letterSpacing || 0) + 'px';
    el.style.whiteSpace = 'nowrap';
  } else if (layer.type === 'shape') {
    el.style.background = layer.properties.fill || '#ffffff';
    if (layer.properties.shapeType === 'circle') el.style.borderRadius = '50%';
    else if (layer.properties.borderRadius) el.style.borderRadius = layer.properties.borderRadius + 'px';
    if (layer.properties.stroke) {
      el.style.border = layer.properties.strokeWidth + 'px solid ' + layer.properties.stroke;
    }
  }
  canvas.appendChild(el);
  layerEls[layer.id] = el;
});

function lerp(a, b, t) { return a + (b - a) * t; }
function applyEasing(t, easing) {
  switch(easing) {
    case 'ease-in': return t * t;
    case 'ease-out': return t * (2 - t);
    case 'ease-in-out': return t < 0.5 ? 2*t*t : -1+(4-2*t)*t;
    case 'bounce': {
      if (t < 1/2.75) return 7.5625*t*t;
      else if (t < 2/2.75) { t -= 1.5/2.75; return 7.5625*t*t+0.75; }
      else if (t < 2.5/2.75) { t -= 2.25/2.75; return 7.5625*t*t+0.9375; }
      else { t -= 2.625/2.75; return 7.5625*t*t+0.984375; }
    }
    default: return t;
  }
}

function getInterpolatedValue(keyframes, time) {
  if (!keyframes || keyframes.length === 0) return null;
  if (keyframes.length === 1) return keyframes[0].value;
  if (time <= keyframes[0].time) return keyframes[0].value;
  if (time >= keyframes[keyframes.length-1].time) return keyframes[keyframes.length-1].value;
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i], b = keyframes[i+1];
    if (time >= a.time && time <= b.time) {
      const t = applyEasing((time - a.time) / (b.time - a.time), b.easing || 'ease');
      if (typeof a.value === 'number') return lerp(a.value, b.value, t);
      return t < 0.5 ? a.value : b.value;
    }
  }
}

function tick() {
  const elapsed = (performance.now() - startTime) / 1000;
  const time = elapsed % template.duration;

  template.layers.forEach(layer => {
    const el = layerEls[layer.id];
    if (!el) return;
    const p = layer.properties;
    const kf = layer.keyframes || {};

    const x = getInterpolatedValue(kf.x, time) ?? p.x ?? 0;
    const y = getInterpolatedValue(kf.y, time) ?? p.y ?? 0;
    const opacity = getInterpolatedValue(kf.opacity, time) ?? p.opacity ?? 1;
    const rotation = getInterpolatedValue(kf.rotation, time) ?? p.rotation ?? 0;
    const scaleX = getInterpolatedValue(kf.scaleX, time) ?? p.scaleX ?? 1;
    const scaleY = getInterpolatedValue(kf.scaleY, time) ?? p.scaleY ?? 1;
    const width = getInterpolatedValue(kf.width, time) ?? p.width ?? 200;
    const height = getInterpolatedValue(kf.height, time) ?? p.height ?? 100;

    el.style.width = width + 'px';
    el.style.height = height + 'px';
    el.style.left = (x - width/2) + 'px';
    el.style.top = (y - height/2) + 'px';
    el.style.opacity = opacity;
    el.style.transform = 'rotate(' + rotation + 'deg) scale(' + scaleX + ',' + scaleY + ')';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
  });

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
</script>
</body>
</html>`;
}

function generateAEScript(template) {
  const lines = [
    `// After Effects Script generated by Motion Studio`,
    `// Template: ${template.name}`,
    `var comp = app.project.items.addComp("${template.name}", ${template.width}, ${template.height}, 1, ${template.duration}, ${template.fps || 30});`,
    `var solidLayer = comp.layers.addSolid([0,0,0], "Background", ${template.width}, ${template.height}, 1, ${template.duration});`,
    ``,
  ];

  template.layers.forEach((layer, i) => {
    const p = layer.properties;
    lines.push(`// Layer: ${layer.name}`);
    if (layer.type === 'text') {
      lines.push(`var textLayer${i} = comp.layers.addText("${(p.text || '').replace(/"/g, '\\"')}");`);
      lines.push(`textLayer${i}.name = "${layer.name}";`);
      lines.push(`var textProp${i} = textLayer${i}.property("Source Text").value;`);
      lines.push(`textProp${i}.fontSize = ${p.fontSize || 48};`);
      lines.push(`textProp${i}.font = "${p.fontFamily || 'Arial'}";`);
      lines.push(`textProp${i}.fillColor = hexToAEColor("${p.color || '#ffffff'}");`);
    } else if (layer.type === 'shape') {
      lines.push(`var shapeLayer${i} = comp.layers.addShape();`);
      lines.push(`shapeLayer${i}.name = "${layer.name}";`);
    }

    if (layer.keyframes) {
      Object.entries(layer.keyframes).forEach(([prop, kfs]) => {
        lines.push(`// Keyframes for ${prop}`);
        kfs.forEach(kf => {
          lines.push(`// time:${kf.time} value:${kf.value}`);
        });
      });
    }
    lines.push('');
  });

  lines.push(`
function hexToAEColor(hex) {
  var r = parseInt(hex.slice(1,3), 16)/255;
  var g = parseInt(hex.slice(3,5), 16)/255;
  var b = parseInt(hex.slice(5,7), 16)/255;
  return [r, g, b];
}`);

  return lines.join('\n');
}
