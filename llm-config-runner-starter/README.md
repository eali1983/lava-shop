# LLM Config Runner

A tiny Node.js starter to **run** your single-file config (`llm_config_full.json`) and expose:
- a CLI to inspect providers/models
- a local HTTP server to read config and return parts of it
- schema validation with clear errors

## Quick start

```bash
# 1) Put your llm_config_full.json in this folder
#    (or rename your file to exactly llm_config_full.json)

# 2) Install deps
npm install

# 3) Validate the config
npm run validate

# 4) Print a summary
npm run summary

# 5) Start a local server at http://localhost:8787
npm start
```

## Endpoints

- `GET /health` → ok
- `GET /config/providers` → provider names
- `GET /config/models` → flat list of models with provider, type, contextWindow, maxTokens, cost
- `GET /config/model/:name` → details for a given model key (e.g., `gpt-4o`, `claude-3-5-sonnet`)

## Notes

- If your file is named differently or in another path, edit `CONFIG_PATH` in `index.mjs` and `validate.mjs`.
- This runner **does not call any external AI APIs**; it only loads and validates your config.
