# Fael Records — Vibecodex

Portfólio e hub público para agentes de IA, skills, utilidades, materiais de design e projetos autorais.

## Entregue nesta versão

- landing page premium responsiva em React;
- rotas físicas `/home/` e `/adm/` compatíveis com GitHub Pages;
- design system preto, cobre `#C15F3C` e liquid glass;
- seções de propósito, ferramentas de IA, utilidades, design, manifesto, FAQ e CTA;
- filtros de cards e estados de conteúdo;
- painel administrativo com login;
- editor visual por seções e templates;
- criação, duplicação, exclusão, ordenação e visibilidade de seções;
- edição de textos, links, imagens, cards e perguntas;
- preview desktop, tablet e mobile;
- rascunho automático no navegador;
- importação e exportação de `site.json`;
- publicação direta no GitHub por token temporário;
- SEO, Open Graph, sitemap, robots e manifesto;
- workflow de deploy automático com GitHub Actions.

## Execução local

Requisitos:

- Node.js 22.12 ou superior;
- npm 10 ou superior.

```bash
npm install
npm run dev
```

Acesse:

- site: `http://localhost:5173/home/`
- painel: `http://localhost:5173/adm/`

No Windows, também é possível executar `ABRIR-LOCAL.bat`.

## Validação e build

```bash
npm run lint
npm run validate:content
npm run build
npm run preview
```

O build pronto fica em `dist/`.

## Publicação no GitHub Pages

O projeto já contém `.github/workflows/deploy.yml`.

1. Substitua o conteúdo do repositório `faelrecords/Portfolio` pelos arquivos desta pasta.
2. Faça commit e push para a branch `main`.
3. No GitHub, abra **Settings → Pages**.
4. Em **Build and deployment**, selecione **GitHub Actions**.
5. Confirme o domínio personalizado `portfolio.vibecodex.pro` nas configurações do Pages.
6. Aguarde o workflow **Deploy GitHub Pages** finalizar.

Instruções detalhadas: [DEPLOY-GITHUB.md](DEPLOY-GITHUB.md).

## Painel administrativo

A credencial solicitada foi configurada em `public/admin-config.json` usando PBKDF2-SHA256. A senha não aparece em texto puro no projeto.

Para trocar a credencial:

```bash
npm run admin:hash -- novo_usuario "nova_senha_forte"
npm run build
```

### Limite de segurança do GitHub Pages

GitHub Pages executa somente arquivos estáticos. Portanto, o login do `/adm/` funciona como uma barreira local de interface, mas não substitui autenticação de servidor.

A autorização efetiva para alterar o site é o **Fine-grained Personal Access Token** informado apenas no momento da publicação. O token:

- não é incluído no código;
- não é salvo em `localStorage`;
- não é enviado para terceiros;
- é usado diretamente contra a API oficial do GitHub;
- é apagado do formulário após a publicação e ao sair do painel.

Crie um token limitado exclusivamente ao repositório `Portfolio`, com permissão **Contents: Read and write**.

## Conteúdo

O conteúdo público está em:

```text
public/content/site.json
```

O painel altera esse arquivo ao publicar no GitHub. Também é possível editá-lo manualmente, desde que sua estrutura seja preservada.

## Assets

```text
public/assets/
├── favicon.svg
├── hero-field.svg
├── logo.svg
├── mark.svg
└── og-image.jpg
```

Os conceitos visuais gerados separadamente estão em `concept/`.

## Documentação técnica

A pasta `docs/` contém:

- `CLAUDE.md`
- `RULES.md`
- `ARCHITECTURE.md`
- `DESIGN-SYSTEM.md`
- `COMPONENTS.md`
- `API.md`
- `PLAN-OF-ACTION.md`
- `IMPLEMENTATION-NOTES.md`

## Estrutura principal

```text
.
├── .github/workflows/deploy.yml
├── adm/index.html
├── home/index.html
├── public/
│   ├── assets/
│   ├── content/site.json
│   ├── admin-config.json
│   └── CNAME
├── scripts/
├── src/
│   ├── admin/
│   ├── components/
│   ├── data/
│   ├── lib/
│   ├── public/
│   └── styles/
├── dist/
├── docs/
├── concept/
├── package.json
└── vite.config.js
```
