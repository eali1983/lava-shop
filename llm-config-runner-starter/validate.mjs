import fs from 'fs';
import Ajv from 'ajv';

const CONFIG_PATH = './llm_config_full.json';
const SCHEMA_PATH = './config.schema.json';

const ajv = new Ajv({ allErrors: true, strict: false });

function readJSON(path) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
  } catch (e) {
    console.error(`Failed to read ${path}:`, e.message);
    process.exit(1);
  }
}

const schema = readJSON(SCHEMA_PATH);
const validate = ajv.compile(schema);
const data = readJSON(CONFIG_PATH);

const ok = validate(data);
if (!ok) {
  console.error('❌ Config failed validation:\n');
  for (const err of validate.errors) {
    console.error(`- ${err.instancePath || '(root)'} ${err.message}`);
  }
  process.exit(1);
}
console.log('✅ Config passed schema validation');
