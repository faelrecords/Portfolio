import { defaultSite } from '../data/defaultSite';

export const DRAFT_KEY = 'fael-records-site-draft-v1';

export async function loadPublishedSite() {
  try {
    const response = await fetch(`/content/site.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return normalizeSite(await response.json());
  } catch (error) {
    console.warn('Não foi possível carregar site.json. Usando conteúdo padrão.', error);
    return structuredClone(defaultSite);
  }
}

export function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? normalizeSite(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function saveDraft(site) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(site));
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

export function normalizeSite(input) {
  const site = structuredClone(input || defaultSite);
  site.sections = Array.isArray(site.sections) ? site.sections : [];
  site.navigation = Array.isArray(site.navigation) ? site.navigation : [];
  return site;
}

export function downloadJson(site, filename = 'site.json') {
  const blob = new Blob([JSON.stringify(site, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function readJsonFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try { resolve(normalizeSite(JSON.parse(String(reader.result)))); }
      catch (error) { reject(error); }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export function createId(prefix = 'section') {
  return `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
}
