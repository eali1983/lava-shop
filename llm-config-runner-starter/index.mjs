import express from 'express';
import fs from 'fs';

const CONFIG_PATH = './llm_config_full.json';

function loadConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
  return JSON.parse(raw);
}

function flattenModels(cfg) {
  const out = [];
  if (!cfg || !cfg.gates) return out;
  for (const [providerKey, providerVal] of Object.entries(cfg.gates || {})) {
    // providerVal may hold models (e.g., openai, anthropic blocks in your JSON)
    // In your supplied JSON, some providers are at top-level too; we handle both cases.
  }
  // Additionally, check top-level direct provider blocks (openai, anthropic)
  for (const [topKey, topVal] of Object.entries(cfg || {})) {
    if (topKey === 'openai' || topKey === 'anthropic') {
      // Expect: { chat: {...}, embedding: {...} } or detailed maps in user payload
      const sections = [];
      if (typeof topVal === 'object' && !Array.isArray(topVal)) {
        for (const [sectionKey, sectionVal] of Object.entries(topVal)) {
          if (typeof sectionVal === 'object') {
            for (const [modelKey, modelVal] of Object.entries(sectionVal)) {
              if (typeof modelVal === 'object') {
                out.push({
                  provider: topKey,
                  name: modelKey,
                  type: modelVal.type || sectionKey,
                  maxTokens: modelVal.maxTokens,
                  contextWindow: modelVal.contextWindow,
                  cost: modelVal.cost || modelVal.pricing || null
                });
              }
            }
          }
        }
      }
    }
  }
  // Also scan any other top-level model-like entries
  for (const [k, v] of Object.entries(cfg || {})) {
    if (typeof v === 'object' && v && v.type && (v.maxTokens || v.contextWindow)) {
      out.push({
        provider: 'unknown',
        name: k,
        type: v.type,
        maxTokens: v.maxTokens,
        contextWindow: v.contextWindow,
        cost: v.cost || null
      });
    }
  }
  // Deduplicate by name/provider
  const seen = new Set();
  return out.filter(m => {
    const key = `${m.provider}:${m.name}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const app = express();

app.get('/health', (_, res) => res.json({ ok: true }));

app.get('/config/providers', (_, res) => {
  try {
    const cfg = loadConfig();
    const providers = Object.keys(cfg).filter(k =>
      ['openai','anthropic','google','mistral','groq'].includes(k) || typeof cfg[k] === 'object'
    );
    res.json({ providers });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/config/models', (_, res) => {
  try {
    const cfg = loadConfig();
    res.json({ models: flattenModels(cfg) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/config/model/:name', (req, res) => {
  try {
    const name = req.params.name;
    const cfg = loadConfig();

    // Try direct top-level hit
    if (cfg[name]) return res.json({ name, ...cfg[name] });

    // Search common providers
    const providers = ['openai','anthropic','google','mistral','groq'];
    for (const p of providers) {
      if (cfg[p]) {
        for (const [sectionKey, sectionVal] of Object.entries(cfg[p])) {
          if (sectionVal && sectionVal[name]) {
            return res.json({ provider: p, section: sectionKey, name, ...sectionVal[name] });
          }
        }
      }
    }
    return res.status(404).json({ error: `Model ${name} not found` });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () => {
  console.log(`[llm-config-runner] server listening on http://localhost:${PORT}`);
  console.log(`Config path: ${CONFIG_PATH}`);
});
