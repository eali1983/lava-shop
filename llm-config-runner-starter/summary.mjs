import fs from 'fs';

const CONFIG_PATH = './llm_config_full.json';

function loadConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}

function summarize(cfg) {
  const providers = [];
  const models = [];
  for (const [k, v] of Object.entries(cfg)) {
    if (k === 'openai' || k === 'anthropic' || (v && typeof v === 'object' && !Array.isArray(v))) {
      providers.push(k);
    }
  }
  // Find model-like entries
  for (const [k, v] of Object.entries(cfg)) {
    if (v && typeof v === 'object' && (v.type || v.maxTokens || v.contextWindow || v.cost)) {
      models.push(k);
    }
  }
  return { providers, modelsCount: models.length };
}

try {
  const cfg = loadConfig();
  const sum = summarize(cfg);
  console.log('— LLM Config Summary —');
  console.log('Providers detected:', sum.providers.join(', ') || '(none)');
  console.log('Model-like entries (approx):', sum.modelsCount);
} catch (e) {
  console.error('Failed to summarize config:', e.message);
  process.exit(1);
}
