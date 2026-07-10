import { readFile } from 'node:fs/promises';

const content = JSON.parse(await readFile('public/content/site.json', 'utf8'));
const required = ['version', 'brand', 'hero', 'sections', 'footer'];
const missing = required.filter((key) => !(key in content));
if (missing.length) {
  throw new Error(`site.json inválido. Campos ausentes: ${missing.join(', ')}`);
}
if (!Array.isArray(content.sections)) throw new Error('sections deve ser um array.');
const ids = content.sections.map((section) => section.id);
if (new Set(ids).size !== ids.length) throw new Error('IDs de seção duplicados.');
console.log(`Conteúdo válido: ${content.sections.length} seções.`);
