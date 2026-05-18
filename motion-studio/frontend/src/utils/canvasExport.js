import { computeLayerProps, applyEasing } from './animation.js';

/**
 * Renders the template to a canvas at a given time and returns the canvas context.
 */
function renderFrame(template, time, canvas) {
  const ctx = canvas.getContext('2d');
  const { width, height, background, layers } = template;

  // Background
  ctx.fillStyle = background || '#000000';
  ctx.fillRect(0, 0, width, height);

  // Draw layers bottom-to-top (first in array = bottom)
  [...layers].forEach(layer => {
    if (!layer.visible) return;
    const p = layer.properties;
    const comp = computeLayerProps(layer, time);

    ctx.save();
    ctx.globalAlpha = comp.opacity;
    ctx.translate(comp.x, comp.y);
    ctx.rotate((comp.rotation * Math.PI) / 180);
    ctx.scale(comp.scaleX, comp.scaleY);

    const hw = comp.width / 2;
    const hh = comp.height / 2;

    if (layer.type === 'shape') {
      ctx.fillStyle = p.fill || '#6366f1';
      ctx.beginPath();
      if (p.shapeType === 'circle') {
        ctx.arc(0, 0, Math.min(hw, hh), 0, Math.PI * 2);
      } else if (p.shapeType === 'triangle') {
        ctx.moveTo(0, -hh);
        ctx.lineTo(hw, hh);
        ctx.lineTo(-hw, hh);
        ctx.closePath();
      } else {
        // Rectangle with optional border radius
        const r = Math.min(p.borderRadius || 0, hw, hh);
        ctx.moveTo(-hw + r, -hh);
        ctx.lineTo(hw - r, -hh);
        ctx.arcTo(hw, -hh, hw, -hh + r, r);
        ctx.lineTo(hw, hh - r);
        ctx.arcTo(hw, hh, hw - r, hh, r);
        ctx.lineTo(-hw + r, hh);
        ctx.arcTo(-hw, hh, -hw, hh - r, r);
        ctx.lineTo(-hw, -hh + r);
        ctx.arcTo(-hw, -hh, -hw + r, -hh, r);
        ctx.closePath();
      }
      ctx.fill();
      if (p.strokeWidth > 0 && p.stroke && p.stroke !== 'transparent') {
        ctx.strokeStyle = p.stroke;
        ctx.lineWidth = p.strokeWidth;
        ctx.stroke();
      }
    } else if (layer.type === 'text') {
      const fontSize = p.fontSize || 48;
      const fontWeight = p.fontWeight || '700';
      const fontFamily = (p.fontFamily || 'Inter, sans-serif').split(',')[0].trim();
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = p.color || '#ffffff';
      ctx.textAlign = p.textAlign || 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = (p.letterSpacing || 0) + 'px';

      const lines = (p.text || '').split('\n');
      const lineHeight = fontSize * 1.25;
      const totalH = lineHeight * (lines.length - 1);
      lines.forEach((line, i) => {
        const yOff = -totalH / 2 + i * lineHeight;
        ctx.fillText(line, 0, yOff);
      });
    }

    ctx.restore();
  });
}

/**
 * Exports the template as a WebM video blob using the MediaRecorder API.
 * Returns a Promise<Blob>.
 */
export async function exportToWebM(template, onProgress) {
  const { width, height, duration, fps } = template;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const stream = canvas.captureStream(fps);
  const recorder = new MediaRecorder(stream, {
    mimeType: getSupportedMimeType(),
    videoBitsPerSecond: 8_000_000,
  });

  const chunks = [];
  recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

  return new Promise((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: recorder.mimeType });
      resolve(blob);
    };
    recorder.onerror = reject;
    recorder.start();

    const totalFrames = Math.ceil(duration * fps);
    let frame = 0;

    function tick() {
      if (frame > totalFrames) {
        recorder.stop();
        return;
      }
      const time = frame / fps;
      renderFrame(template, time, canvas);
      onProgress?.(time / duration);
      frame++;
      // Use setTimeout to avoid blocking UI; 0ms = next task
      setTimeout(tick, 0);
    }

    tick();
  });
}

/**
 * Download a blob as a file.
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getSupportedMimeType() {
  const types = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];
  return types.find(t => MediaRecorder.isTypeSupported(t)) || 'video/webm';
}
