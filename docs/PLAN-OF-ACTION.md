# Fael Records — Plano de Ação

## 1. Visão do projeto

O **Fael Records** será o portfólio e hub público do ecossistema **Vibecodex**, centralizando:

- agentes e skills de inteligência artificial;
- ferramentas próprias de IA;
- utilidades e arquivos para download;
- materiais e recursos de design;
- apresentação profissional do trabalho de desenvolvimento;
- um painel administrativo visual para manutenção do conteúdo.

### Domínios e rotas

| Endereço | Função |
|---|---|
| `https://portfolio.vibecodex.pro/` | Redireciona para `/home` |
| `https://portfolio.vibecodex.pro/home` | Site público |
| `https://portfolio.vibecodex.pro/adm` | Login e painel administrativo |
| `https://api-portfolio.vibecodex.pro/api/v1` | API segura do painel e do conteúdo |

## 2. Decisão técnica principal

O GitHub Pages será usado apenas para o **frontend estático**. Ele publica HTML, CSS e JavaScript, mas não executa um servidor Node.js persistente. Portanto:

- **React + TypeScript + Vite**: frontend público e painel `/adm`;
- **GitHub Pages + GitHub Actions**: build e publicação do frontend;
- **Node.js + Fastify**: API externa;
- **PostgreSQL**: conteúdo, versões, usuários e auditoria;
- **Object Storage**: imagens, vídeos e arquivos para download;
- **cookie HttpOnly + JWT rotativo**: sessão administrativa;
- **Argon2id**: hash da senha;
- **React Query**: sincronização com a API;
- **dnd-kit**: editor visual e ordenação por arrastar e soltar.

> A credencial administrativa nunca será inserida no código, no bundle do React ou no repositório. A senha inicial deve existir apenas como segredo de ambiente no backend e ser trocada antes da publicação definitiva.

## 3. Direção visual

### Conceito

Uma interface premium, futurista e autoral, inspirada no liquid glass da referência, mas adaptada para a identidade **Vibecodex**:

- preto profundo como base;
- branco quente para conteúdo;
- `#C15F3C` como único acento cromático principal;
- vidro líquido com contraste controlado;
- composição editorial e assimétrica;
- tipografia ampla, com boa hierarquia;
- movimento suave e funcional;
- imagens criadas especificamente para o projeto, sem aparência genérica de banco de imagens.

### Hero

Estrutura em dois painéis no desktop:

- painel principal com marca, chamada “Vibecodex”, CTA e categorias;
- painel secundário com destaques, atalhos e cards de ferramentas;
- vídeo ou motion background escuro, abstrato e tecnológico;
- versão mobile em painel único, sem perda de conteúdo.

## 4. Arquitetura de conteúdo

### Seções iniciais

1. Header
2. Hero Section
3. Propósito do site
4. Ferramentas de IA
5. Utilidades
6. Materiais de design
7. FAQ
8. Footer

### Tipos de item

| Tipo | Exemplos de dados |
|---|---|
| Ferramenta de IA | nome, descrição, imagem, URL, categoria, status, tags |
| Utilidade | título, descrição, arquivo, versão, tamanho, instruções |
| Material de design | título, capa, formato, licença, arquivo ou link |
| FAQ | pergunta, resposta, ordem, visibilidade |
| Seção customizada | título, texto, mídia, CTA, layout e tema |

## 5. Escopo do editor administrativo

O `/adm` será um editor visual simplificado, inspirado em construtores como Elementor, sem tentar reproduzir toda a complexidade deles.

### Recursos da primeira versão

- login administrativo;
- dashboard com resumo do conteúdo;
- criar, editar, duplicar, ocultar e excluir seções;
- reordenar seções por drag and drop;
- adicionar blocos pré-definidos;
- editar textos, links, imagens e arquivos;
- cadastrar ferramentas de IA, utilidades e materiais;
- biblioteca de mídia;
- pré-visualização desktop, tablet e mobile;
- rascunho e publicação;
- histórico básico de alterações;
- confirmação para ações destrutivas;
- logout e expiração de sessão.

### Templates de seção iniciais

- Hero dividido
- Hero centralizado
- Texto + imagem
- Grid de cards
- Bento grid
- Lista de downloads
- Galeria de materiais
- Destaque com CTA
- FAQ
- Faixa de métricas
- Depoimento ou citação
- Bloco de código/documentação
- Spacer controlado

## 6. Fases de execução

### Fase 0 — Segurança e preparação

- criar backup do `index.html`, `assets` e `CNAME` atuais;
- proteger a branch `main`;
- ativar Dependabot e secret scanning;
- remover qualquer senha eventualmente adicionada ao histórico;
- criar `.env.example` sem valores reais;
- definir ambientes `development`, `preview` e `production`.

**Critério de aceite:** nenhum segredo no repositório e rollback disponível.

### Fase 1 — Fundação do projeto

- migrar para React + TypeScript + Vite;
- configurar ESLint, Prettier, Vitest e Playwright;
- instalar Tailwind CSS ou camada de tokens CSS;
- configurar aliases e estrutura de pastas;
- configurar rotas físicas para `/home` e `/adm`;
- criar workflow de GitHub Actions.

**Critério de aceite:** build reproduzível e publicação de preview sem erros.

### Fase 2 — Design system e ativos visuais

- criar logotipo/monograma digital de Fael Records/Vibecodex;
- criar background motion do hero;
- criar thumbnails das categorias;
- criar textura e elementos de interface;
- gerar cada imagem separadamente;
- revisar composição e coerência;
- exportar em AVIF/WebP e fallback quando necessário;
- implementar tokens, componentes glass e estados.

**Critério de aceite:** todos os ativos possuem fonte, proporção, compressão e texto alternativo definidos.

### Fase 3 — Site público

- implementar header e navegação;
- implementar hero responsivo;
- implementar propósito;
- implementar coleções de ferramentas, utilidades e design;
- implementar busca e filtros;
- implementar FAQ e footer;
- configurar SEO, Open Graph, sitemap e dados estruturados;
- configurar estados de carregamento, erro e vazio.

**Critério de aceite:** site funcional em 360 px, 768 px, 1024 px, 1440 px e telas ultrawide.

### Fase 4 — Backend e autenticação

- criar API Node.js/Fastify;
- modelar PostgreSQL;
- configurar storage;
- criar usuário administrador inicial por seed seguro;
- implementar login, refresh, logout e sessão;
- adicionar rate limiting, CORS, auditoria e validação;
- criar endpoints de conteúdo, mídia, rascunho e publicação.

**Critério de aceite:** nenhuma operação de escrita funciona sem sessão válida.

### Fase 5 — Editor visual

- implementar layout administrativo;
- criar paleta de blocos;
- criar canvas e inspetor de propriedades;
- implementar reordenação e duplicação;
- criar formulários por schema;
- implementar preview responsivo;
- implementar autosave de rascunho com debounce;
- implementar publicação transacional.

**Critério de aceite:** um administrador consegue criar uma nova seção e publicá-la sem editar código.

### Fase 6 — Integração e implantação

- conectar frontend à API de produção;
- configurar DNS da API;
- manter `portfolio.vibecodex.pro` no GitHub Pages;
- configurar HTTPS;
- configurar monitoramento de disponibilidade e erros;
- validar cache e invalidação após publicação.

**Critério de aceite:** `/home` e `/adm` abrem diretamente sem 404 e o conteúdo publicado aparece no site.

### Fase 7 — Qualidade e lançamento

- testes unitários, integração e E2E;
- auditoria de acessibilidade;
- auditoria Lighthouse;
- revisão de segurança;
- revisão editorial;
- teste de uploads e downloads;
- teste de recuperação de senha e sessão expirada;
- documentação de operação e backup.

**Critério de aceite:** checklist de produção integralmente aprovado.

## 7. Plano de imagens e ativos

Cada imagem deve ser criada antes da implementação e tratada como um ativo de produto.

| Ativo | Uso | Formato recomendado |
|---|---|---|
| `hero-background` | vídeo/loop abstrato do hero | MP4 + WebM + poster AVIF |
| `brand-mark` | logo/monograma | SVG |
| `ai-tools-cover` | coleção Ferramentas de IA | AVIF/WebP |
| `utilities-cover` | coleção Utilidades | AVIF/WebP |
| `design-cover` | coleção Design | AVIF/WebP |
| `default-tool-thumbnail` | fallback de cards | SVG/AVIF |
| `og-cover` | compartilhamento social | JPG 1200×630 |
| `favicon` | navegador e PWA | SVG + PNG |

### Regras de produção

- não gerar texto dentro das imagens, salvo quando fizer parte intencional do conceito;
- não usar logos de terceiros sem autorização;
- manter foco visual compatível com sobreposição de texto;
- evitar elementos importantes nas bordas;
- produzir versões desktop e mobile quando o recorte automático prejudicar a composição;
- registrar prompt, versão e licença de cada ativo.

## 8. Metas de qualidade

- Lighthouse Performance: alvo mínimo 90 em produção;
- Accessibility: alvo mínimo 95;
- SEO: alvo mínimo 95;
- Best Practices: alvo mínimo 95;
- LCP: até 2,5 s em cenário de referência;
- CLS: até 0,1;
- INP: até 200 ms;
- navegação completa por teclado;
- contraste WCAG 2.2 AA;
- nenhuma senha, token ou chave no frontend;
- nenhum erro de console em produção.

## 9. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| GitHub Pages não executa backend | API externa e frontend estático |
| Rotas `/home` e `/adm` retornarem 404 | gerar entradas físicas `home/index.html` e `adm/index.html` |
| Senha exposta no bundle | autenticação exclusivamente no backend e hash Argon2id |
| Uploads deixarem o repositório pesado | usar object storage externo |
| Vídeo prejudicar performance | poster, lazy loading, compressão e fallback estático |
| Editor visual ficar complexo demais | blocos restritos e schemas predefinidos |
| Conteúdo quebrar o layout | limites de caracteres, preview e validação |
| Dependência excessiva | adapters, contratos tipados e orçamento de dependências |

## 10. Ordem recomendada de implementação

1. Segurança e backup
2. Scaffolding React/Vite
3. Design system
4. Assets do hero e coleções
5. Site público com conteúdo mockado
6. API e banco
7. Autenticação
8. CRUD de conteúdo
9. Biblioteca de mídia
10. Editor de blocos
11. Publicação e cache
12. Testes e lançamento

## 11. Definição de pronto do projeto

O projeto será considerado pronto quando:

- o domínio abrir `/home` corretamente;
- o site possuir todas as seções previstas;
- o administrador puder entrar em `/adm` com credencial segura;
- seções, links, imagens e downloads puderem ser gerenciados sem código;
- o site possuir preview responsivo;
- o fluxo de rascunho/publicação funcionar;
- os arquivos estiverem hospedados e protegidos conforme a regra de acesso;
- houver testes, logs, backups e documentação;
- nenhuma informação sensível estiver no repositório.
