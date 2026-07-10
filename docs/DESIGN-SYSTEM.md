# DESIGN-SYSTEM.md — Fael Records / Vibecodex

## 1. Princípios visuais

O design deve transmitir:

- tecnologia autoral;
- sofisticação sem excesso decorativo;
- clareza editorial;
- contraste forte;
- movimento controlado;
- sensação de produto premium;
- consistência entre site público e painel administrativo.

A referência de liquid glass é reinterpretada com preto profundo e acento cobre `#C15F3C`.

## 2. Cores

### 2.1 Tokens principais

```css
:root {
  --color-black: #000000;
  --color-bg: #070707;
  --color-surface-1: #0d0d0d;
  --color-surface-2: #141414;
  --color-surface-3: #1b1b1b;

  --color-text: #f5f2ef;
  --color-text-muted: rgba(245, 242, 239, 0.72);
  --color-text-subtle: rgba(245, 242, 239, 0.52);
  --color-text-disabled: rgba(245, 242, 239, 0.34);

  --color-accent: #c15f3c;
  --color-accent-hover: #d2704b;
  --color-accent-active: #a94f32;
  --color-accent-soft: rgba(193, 95, 60, 0.16);
  --color-accent-faint: rgba(193, 95, 60, 0.08);

  --color-success: #62b47d;
  --color-warning: #d6a85f;
  --color-danger: #dc6c67;
  --color-info: #78a9d4;
}
```

### 2.2 Uso

| Token | Uso |
|---|---|
| `--color-bg` | fundo global |
| `--color-surface-1` | cards e painéis |
| `--color-text` | títulos e conteúdo principal |
| `--color-text-muted` | parágrafos e metadata |
| `--color-accent` | CTA, foco, detalhe de marca |
| `--color-accent-soft` | fundos selecionados |
| status | apenas feedback funcional |

### 2.3 Regras

- o acento não deve dominar mais de aproximadamente 10–15% da composição;
- status não substitui texto ou ícone;
- branco puro deve ser evitado em grandes áreas;
- gradientes devem usar preto, transparência e acento, sem arco-íris;
- contraste deve atender WCAG 2.2 AA.

## 3. Tipografia

### Famílias

```css
:root {
  --font-display: 'Poppins', system-ui, sans-serif;
  --font-serif: 'Source Serif 4', Georgia, serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

- **Poppins**: interface, títulos e corpo;
- **Source Serif 4**: ênfase editorial itálica em títulos;
- **JetBrains Mono**: labels técnicas, código e metadata pontual.

### Escala

| Token | Desktop | Mobile | Line-height |
|---|---:|---:|---:|
| `display-xl` | 88 px | 52 px | 0.96 |
| `display-lg` | 72 px | 44 px | 1.00 |
| `h1` | 56 px | 38 px | 1.05 |
| `h2` | 42 px | 32 px | 1.10 |
| `h3` | 30 px | 24 px | 1.20 |
| `h4` | 22 px | 20 px | 1.25 |
| `body-lg` | 18 px | 17 px | 1.65 |
| `body` | 16 px | 16 px | 1.60 |
| `small` | 14 px | 14 px | 1.50 |
| `caption` | 12 px | 12 px | 1.40 |

### Regras

- headings usam peso 500;
- hero pode usar tracking negativo entre `-0.03em` e `-0.06em`;
- textos longos devem limitar largura entre 55 e 72 caracteres;
- caixa alta somente em labels curtas;
- serif itálica apenas para ênfase intencional.

### Exemplo

```html
<h1>
  Uma central para o seu
  <em>ecossistema criativo de IA.</em>
</h1>
```

## 4. Espaçamentos

Escala base de 4 px:

```css
--space-0: 0;
--space-1: 0.25rem;  /* 4 */
--space-2: 0.5rem;   /* 8 */
--space-3: 0.75rem;  /* 12 */
--space-4: 1rem;     /* 16 */
--space-5: 1.25rem;  /* 20 */
--space-6: 1.5rem;   /* 24 */
--space-8: 2rem;     /* 32 */
--space-10: 2.5rem;  /* 40 */
--space-12: 3rem;    /* 48 */
--space-16: 4rem;    /* 64 */
--space-20: 5rem;    /* 80 */
--space-24: 6rem;    /* 96 */
--space-32: 8rem;    /* 128 */
```

### Espaçamento de seções

```css
.section {
  padding-block: clamp(5rem, 9vw, 9rem);
}
```

## 5. Border radius

```css
--radius-xs: 0.5rem;
--radius-sm: 0.75rem;
--radius-md: 1rem;
--radius-lg: 1.5rem;
--radius-xl: 2rem;
--radius-2xl: 2.5rem;
--radius-pill: 999px;
```

O token base do produto é `1rem`.

## 6. Liquid Glass

### 6.1 Glass leve

```css
.liquid-glass {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.018);
  background-blend-mode: luminosity;
  backdrop-filter: blur(8px) saturate(110%);
  box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.10);
}

.liquid-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.38),
    rgba(255, 255, 255, 0.12) 22%,
    transparent 42%,
    transparent 62%,
    rgba(193, 95, 60, 0.16) 82%,
    rgba(193, 95, 60, 0.32)
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}
```

### 6.2 Glass forte

```css
.liquid-glass-strong {
  position: relative;
  overflow: hidden;
  background: rgba(8, 8, 8, 0.34);
  backdrop-filter: blur(42px) saturate(120%);
  box-shadow:
    0 24px 70px rgba(0, 0, 0, 0.32),
    inset 0 1px 1px rgba(255, 255, 255, 0.14);
}
```

### Fallback

```css
@supports not (backdrop-filter: blur(1px)) {
  .liquid-glass,
  .liquid-glass-strong {
    background: rgba(14, 14, 14, 0.94);
  }
}
```

## 7. Sombras

```css
--shadow-sm: 0 8px 24px rgba(0, 0, 0, 0.20);
--shadow-md: 0 18px 48px rgba(0, 0, 0, 0.28);
--shadow-lg: 0 30px 90px rgba(0, 0, 0, 0.38);
--shadow-accent: 0 18px 50px rgba(193, 95, 60, 0.18);
```

Sombras devem dar profundidade, não criar contorno borrado permanente.

## 8. Grid

### Container

```css
.container {
  width: min(100% - 2rem, 90rem);
  margin-inline: auto;
}
```

### Desktop

- 12 colunas;
- gutter de 24–32 px;
- margem lateral fluida;
- largura máxima de 1440 px para conteúdo principal.

### Tablet

- 8 colunas;
- gutter de 20–24 px.

### Mobile

- 4 colunas;
- gutter de 16 px;
- margem lateral mínima de 16 px.

## 9. Breakpoints

```css
--bp-sm: 30rem;   /* 480 */
--bp-md: 48rem;   /* 768 */
--bp-lg: 64rem;   /* 1024 */
--bp-xl: 80rem;   /* 1280 */
--bp-2xl: 96rem;  /* 1536 */
```

Usar breakpoints quando o conteúdo pedir, não apenas por dispositivo.

## 10. Botões

### Variantes

| Variante | Uso |
|---|---|
| `primary` | ação principal |
| `secondary` | ação alternativa |
| `glass` | ações dentro do hero e cards |
| `ghost` | ações de baixa prioridade |
| `danger` | exclusão e ações destrutivas |
| `icon` | ação apenas com ícone e label acessível |

### Tamanhos

- `sm`: 36 px;
- `md`: 44 px;
- `lg`: 52 px;
- área mínima recomendada de toque: 44×44 px.

### Estados

```text
Default → Hover: leve elevação e maior luminância
Hover → Active: scale(0.98)
Focus-visible: anel cobre + offset escuro
Disabled: opacidade reduzida, sem hover, cursor adequado
Loading: conteúdo preserva largura e exibe progresso
```

### Exemplo

```tsx
<Button variant="primary" size="lg" trailingIcon={<ArrowRight />}>
  Conhecer ferramentas
</Button>
```

## 11. Inputs

### Anatomia

- label;
- descrição opcional;
- campo;
- mensagem de erro;
- contador quando houver limite.

### Regras

- label visível;
- placeholder não substitui label;
- altura mínima de 44 px;
- erro vinculado por `aria-describedby`;
- foco com contraste forte;
- autocomplete apropriado;
- senha com opção de exibir/ocultar.

```text
Nome da ferramenta
[____________________________]
Use até 80 caracteres.
```

## 12. Cards

### Tipos

- `ToolCard`;
- `DownloadCard`;
- `DesignMaterialCard`;
- `FeatureCard`;
- `AdminSummaryCard`;
- `TemplateCard`.

### Regras

- título e ação claramente identificáveis;
- card inteiro clicável somente quando houver um único destino;
- não aninhar botão dentro de link clicável no card inteiro;
- imagem com proporção previsível;
- metadata não competir com título;
- hover não pode ser o único meio de descobrir ação.

### Exemplo visual

```text
┌─────────────────────────────────────┐
│ [imagem 16:10]                      │
│                                     │
│ FERRAMENTA DE IA                    │
│ Nome da ferramenta              ↗   │
│ Descrição objetiva em até 3 linhas. │
│ [Agente] [Automação]                │
└─────────────────────────────────────┘
```

## 13. Modais e dialogs

- usar apenas para tarefas focadas;
- título obrigatório;
- botão fechar com nome acessível;
- focus trap;
- `Escape` fecha quando seguro;
- clique fora não fecha ação destrutiva em andamento;
- retornar foco ao gatilho;
- conteúdo longo deve virar página ou drawer.

## 14. Tabelas

No painel administrativo:

- cabeçalho persistente quando útil;
- ordenação anunciada;
- ações em menu contextual;
- versão mobile em lista/cards quando a tabela perder legibilidade;
- skeleton preserva colunas;
- estado vazio orienta cadastro;
- paginação e filtros mantêm URL quando útil.

## 15. Ícones

- biblioteca padrão: Lucide React;
- tamanhos principais: 16, 18, 20, 24 e 32 px;
- `strokeWidth` consistente;
- ícone decorativo usa `aria-hidden="true"`;
- botão apenas com ícone exige `aria-label` ou tooltip acessível;
- não misturar famílias de ícones sem decisão de design.

## 16. Estados de interface

### Hover

- transformação máxima recomendada: `translateY(-2px)` ou `scale(1.02)`;
- CTA isolado pode chegar a `scale(1.05)`;
- não deslocar layout.

### Active

- resposta tátil curta;
- nunca esconder foco.

### Disabled

- comunicar indisponibilidade;
- não remover conteúdo necessário para compreensão;
- evitar tooltip como única explicação.

### Loading

- skeleton para conteúdo;
- spinner para ação curta;
- progresso para upload;
- botão mantém largura.

### Error

- linguagem objetiva;
- indicar correção;
- oferecer retry quando aplicável;
- não expor detalhes internos.

### Empty

- explicar por que está vazio;
- sugerir a próxima ação;
- evitar ilustração excessiva.

## 17. Movimento

```css
--duration-fast: 120ms;
--duration-base: 180ms;
--duration-slow: 320ms;
--ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
--ease-emphasis: cubic-bezier(0.16, 1, 0.3, 1);
```

### Regras

- movimento deve explicar hierarquia ou mudança de estado;
- parallax intenso é proibido;
- scroll animations devem ser discretas e não bloquear leitura;
- vídeo do hero deve pausar quando a página estiver oculta quando possível;
- reduced motion remove transformações não essenciais.

## 18. Responsividade

### Hero

- desktop: dois painéis 52/48;
- tablet: painel principal dominante e cards reduzidos;
- mobile: um painel, conteúdo em fluxo, sem esconder CTAs essenciais;
- vídeo pode virar poster estático em economia de dados ou reduced motion.

### Cards

```text
Mobile: 1 coluna
Tablet: 2 colunas
Desktop: 3 colunas
Wide: 3 ou 4, conforme largura mínima do card
```

### Editor administrativo

- desktop: sidebar + canvas + inspector;
- tablet: sidebar colapsável + canvas + drawer de propriedades;
- mobile: edição simplificada por formulários, sem drag and drop obrigatório.

## 19. Exemplos de composição

### Hero

```text
┌──────────────────────────┬─────────────────────┐
│ Logo              Menu   │ Redes       Conta  │
│                          │                     │
│        [marca]           │  Card ecossistema  │
│        VIBECODEX         │                     │
│  IA, design e código...  │                     │
│  [Conhecer ferramentas]  │  Cards em bento     │
│  [Agentes] [Skills] [...]│                     │
│                          │                     │
│  Citação editorial       │  Destaque recente   │
└──────────────────────────┴─────────────────────┘
```

### Seção de recursos

```text
LABEL
Ferramentas construídas para transformar intenção em execução.

[Filtros] [Busca........................]

[Card] [Card] [Card]
[Card] [Card] [Card]
```

## 20. Como criar novos componentes com consistência

1. identificar componente existente semelhante;
2. usar tokens, não valores soltos;
3. definir anatomia e estados;
4. definir comportamento responsivo;
5. definir semântica e acessibilidade;
6. criar variantes limitadas;
7. criar Storybook ou página de showcase quando disponível;
8. testar teclado e reduced motion;
9. documentar em `COMPONENTS.md`;
10. não alterar tokens globais para resolver um caso isolado.

## 21. Checklist visual

- [ ] alinhamento com grid;
- [ ] margens externas consistentes;
- [ ] ritmo vertical claro;
- [ ] contraste validado;
- [ ] foco visível;
- [ ] hover e active discretos;
- [ ] texto não ultrapassa limites;
- [ ] mídia não deforma;
- [ ] glass legível sobre o background;
- [ ] fallback sem blur;
- [ ] mobile sem overflow horizontal;
- [ ] conteúdo utilizável com reduced motion.
