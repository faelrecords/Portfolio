import { readFile } from "node:fs/promises";

const contentUrl = new URL("../src/content/portfolio.json", import.meta.url);
const content = JSON.parse(await readFile(contentUrl, "utf8"));
const errors = [];

const requiredText = (value, path) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    errors.push(`${path} precisa ser um texto preenchido.`);
  }
};

requiredText(content?.brand?.name, "brand.name");
requiredText(content?.brand?.wordmark, "brand.wordmark");
requiredText(content?.hero?.title, "hero.title");
requiredText(content?.hero?.description, "hero.description");

if (!Array.isArray(content?.projects) || content.projects.length === 0) {
  errors.push("projects precisa ter pelo menos um projeto.");
} else {
  const ids = new Set();
  for (const [index, project] of content.projects.entries()) {
    const base = `projects[${index}]`;
    requiredText(project.id, `${base}.id`);
    requiredText(project.title, `${base}.title`);
    requiredText(project.summary, `${base}.summary`);
    requiredText(project.status, `${base}.status`);
    if (ids.has(project.id)) errors.push(`${base}.id precisa ser único.`);
    ids.add(project.id);
    if (!Array.isArray(project.tags) || project.tags.length === 0) {
      errors.push(`${base}.tags precisa ter pelo menos uma tecnologia.`);
    }
    for (const field of ["launchUrl"]) {
      const value = project[field];
      if (value !== null && !/^https:\/\//.test(value)) {
        errors.push(`${base}.${field} precisa usar HTTPS ou ser null.`);
      }
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Conteúdo válido: ${content.projects.length} projetos encontrados.`);
