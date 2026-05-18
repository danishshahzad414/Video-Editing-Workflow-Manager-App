import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

export const router = express.Router();

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TEMPLATE_SYSTEM_PROMPT = `You are a motion graphics expert AI. Generate motion graphics templates as valid JSON.

The JSON format must follow this schema:
{
  "name": string,
  "duration": number (seconds),
  "fps": number,
  "width": number,
  "height": number,
  "background": string (CSS color),
  "layers": [
    {
      "id": string,
      "name": string,
      "type": "text" | "shape" | "image" | "group",
      "visible": boolean,
      "locked": boolean,
      "blendMode": "normal" | "multiply" | "screen" | "overlay",
      "properties": {
        "x": number,
        "y": number,
        "width": number,
        "height": number,
        "rotation": number,
        "opacity": number,
        "scaleX": number,
        "scaleY": number,
        // For text:
        "text": string,
        "fontSize": number,
        "fontFamily": string,
        "fontWeight": string,
        "color": string,
        "textAlign": string,
        "letterSpacing": number,
        // For shape:
        "shapeType": "rectangle" | "circle" | "triangle" | "line",
        "fill": string,
        "stroke": string,
        "strokeWidth": number,
        "borderRadius": number
      },
      "keyframes": {
        "propertyName": [
          { "time": number, "value": any, "easing": "linear" | "ease" | "ease-in" | "ease-out" | "ease-in-out" | "bounce" | "spring" }
        ]
      }
    }
  ]
}

Always return ONLY valid JSON with no markdown, no explanation. Generate creative, visually appealing templates with smooth animations.`;

// Generate template from AI prompt
router.post('/generate', async (req, res) => {
  try {
    const { prompt, style, duration } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt required' });

    const userMessage = `Create a motion graphics template: "${prompt}"
${duration ? `Duration: ${duration} seconds` : ''}
${style ? `Style: ${style}` : ''}

Return ONLY the JSON template, no markdown.`;

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: TEMPLATE_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    });

    const content = message.content[0].text.trim();

    // Strip markdown code fences if present
    const jsonStr = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    let template;
    try {
      template = JSON.parse(jsonStr);
    } catch {
      return res.status(500).json({ error: 'AI returned invalid JSON', raw: content });
    }

    // Ensure required fields
    template.id = template.id || `tpl_${Date.now()}`;
    template.createdAt = new Date().toISOString();

    res.json({ template });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get AI suggestions for improving current template
router.post('/suggest', async (req, res) => {
  try {
    const { template, focus } = req.body;
    if (!template) return res.status(400).json({ error: 'Template required' });

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `Review this motion graphics template and give 3-5 specific improvement suggestions${focus ? ` focused on ${focus}` : ''}.
Template: ${JSON.stringify(template, null, 2)}

Return JSON: { "suggestions": [{ "title": string, "description": string, "category": "timing" | "visual" | "animation" | "composition" }] }`
      }],
    });

    const content = message.content[0].text.trim();
    const jsonStr = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const result = JSON.parse(jsonStr);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Apply a specific AI suggestion to the template
router.post('/apply-suggestion', async (req, res) => {
  try {
    const { template, suggestion } = req.body;

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 4096,
      system: TEMPLATE_SYSTEM_PROMPT,
      messages: [{
        role: 'user',
        content: `Apply this improvement to the template: "${suggestion}"
Current template: ${JSON.stringify(template)}
Return the COMPLETE updated template JSON only.`
      }],
    });

    const content = message.content[0].text.trim();
    const jsonStr = content.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
    const updated = JSON.parse(jsonStr);
    res.json({ template: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
