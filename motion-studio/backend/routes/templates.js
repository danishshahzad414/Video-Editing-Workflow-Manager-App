import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

export const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, '../data/templates');
fs.ensureDirSync(DATA_DIR);

// List all templates
router.get('/', async (req, res) => {
  try {
    const files = await fs.readdir(DATA_DIR);
    const templates = await Promise.all(
      files.filter(f => f.endsWith('.json')).map(async f => {
        const data = await fs.readJson(path.join(DATA_DIR, f));
        return { id: data.id, name: data.name, duration: data.duration, updatedAt: data.updatedAt, thumbnail: data.thumbnail };
      })
    );
    res.json({ templates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single template
router.get('/:id', async (req, res) => {
  try {
    const file = path.join(DATA_DIR, `${req.params.id}.json`);
    if (!await fs.pathExists(file)) return res.status(404).json({ error: 'Not found' });
    const data = await fs.readJson(file);
    res.json({ template: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Save / update template
router.post('/', async (req, res) => {
  try {
    const { template } = req.body;
    if (!template) return res.status(400).json({ error: 'Template required' });

    const id = template.id || uuidv4();
    const data = { ...template, id, updatedAt: new Date().toISOString() };
    await fs.writeJson(path.join(DATA_DIR, `${id}.json`), data, { spaces: 2 });
    res.json({ id, message: 'Saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete template
router.delete('/:id', async (req, res) => {
  try {
    const file = path.join(DATA_DIR, `${req.params.id}.json`);
    await fs.remove(file);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
