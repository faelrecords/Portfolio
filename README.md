# Fael Records — Vibecodex

Portfólio imersivo da Fael Records, com uma cena de buraco negro renderizada em tempo real e uma apresentação das plataformas do ecossistema Vibecodex.

## Desenvolvimento

```bash
npm ci
npm run dev
```

## Validação

```bash
npm run lint
npm run validate:content
npm run build
```

Os textos, projetos, status e links ficam centralizados em `src/content/portfolio.json`.

## Publicação

Todo push na branch `main` executa a validação e publica automaticamente o conteúdo de `dist`. O domínio configurado é `portfolio.vibecodex.pro`.
