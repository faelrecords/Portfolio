# RULES.md — Regras Obrigatórias de Desenvolvimento

## 1. Escopo

Estas regras são obrigatórias para frontend, backend, infraestrutura, conteúdo e documentação do projeto **Fael Records / Vibecodex Portfolio**.

## 2. Convenções de código

### TypeScript

- modo estrito obrigatório;
- `any` proibido, salvo integração externa documentada;
- preferir funções puras para transformações;
- evitar mutação de parâmetros;
- usar `async/await` em vez de cadeias extensas de `.then()`;
- erros devem possuir tipo e código estável;
- valores externos devem ser validados por schema;
- contratos compartilhados devem vir de `packages/contracts`.

### React

- componentes funcionais e nomeados;
- hooks apenas no topo;
- não usar índice do array como `key` quando a ordem puder mudar;
- não derivar estado com `useEffect`;
- não acessar API diretamente em componentes de UI;
- não armazenar estado de servidor em Context sem motivo explícito;
- não usar `dangerouslySetInnerHTML` sem sanitização aprovada;
- componentes interativos devem possuir nome acessível.

### CSS

- usar tokens do design system;
- não usar valores arbitrários repetidos;
- não usar `!important`, salvo correção documentada de integração externa;
- não remover outline globalmente;
- efeitos glass devem possuir fallback sem `backdrop-filter`;
- animações devem respeitar `prefers-reduced-motion`;
- não usar transição em `all`.

```css
/* Correto */
.card {
  transition: transform 180ms ease, opacity 180ms ease;
}
```

## 3. Nomeação de arquivos

| Tipo | Regra | Exemplo |
|---|---|---|
| Componente React | PascalCase | `ToolCard.tsx` |
| Hook | camelCase com `use` | `useTools.ts` |
| Serviço | kebab-case | `tool-service.ts` |
| Schema | kebab-case + `.schema` | `tool-form.schema.ts` |
| Teste unitário | mesmo nome + `.test` | `ToolCard.test.tsx` |
| Teste E2E | kebab-case + `.spec` | `admin-login.spec.ts` |
| Tipo isolado | kebab-case | `content-block.ts` |
| Asset | kebab-case descritivo | `hero-background-mobile.avif` |
| Documento | UPPERCASE quando normativo | `ARCHITECTURE.md` |

## 4. Nomeação de componentes

- nomes descrevem função, não aparência genérica;
- evitar nomes como `Box`, `Container2`, `NewCard`, `ComponentFinal`;
- componentes de página terminam em `Page`;
- componentes de seção terminam em `Section`;
- formulários terminam em `Form`;
- diálogos terminam em `Dialog`;
- componentes administrativos podem usar prefixo semântico, não `Admin` em tudo quando já estiverem isolados na feature.

```text
Correto: ToolCard, MediaLibrary, PublishBar, FAQSection
Incorreto: GlassThing, CardNew, FormComponent, FinalHero
```

## 5. Organização de pastas

- organizar features por domínio;
- evitar pasta global `utils` sem contexto;
- um módulo não deve importar internals de outro módulo;
- exportações públicas passam por `index.ts` apenas quando isso não criar ciclos;
- componentes compartilhados devem ser realmente reutilizados;
- páginas apenas compõem features e layouts;
- acesso a banco fica no backend;
- contratos comuns não dependem do frontend ou backend.

## 6. Estrutura de commits

Formato:

```text
<tipo>(<escopo>): <descrição imperativa>
```

Tipos permitidos:

- `feat`
- `fix`
- `refactor`
- `perf`
- `test`
- `docs`
- `style`
- `build`
- `ci`
- `chore`
- `revert`

Exemplos:

```text
feat(editor): adiciona template de bento grid
fix(media): impede upload acima do limite
perf(home): carrega vídeo do hero após poster
```

### Regras de commit

- sem senha, token ou `.env` real;
- sem arquivos gerados desnecessários;
- sem commit com “final”, “ajustes”, “teste” ou “mudanças” como única descrição;
- mudanças incompatíveis devem usar `!` e seção `BREAKING CHANGE`;
- cada commit deve passar lint e typecheck.

## 7. Regras de segurança

- autenticação e autorização sempre no backend;
- senha com Argon2id;
- access token curto;
- refresh token rotativo e revogável;
- cookies `HttpOnly`, `Secure` e `SameSite` adequados;
- CORS restrito ao domínio autorizado;
- rate limit no login e upload;
- CSRF protegido para operações autenticadas por cookie;
- uploads validados por MIME real, extensão, tamanho e assinatura;
- nomes de arquivo gerados no servidor;
- conteúdo rich text sanitizado;
- queries parametrizadas ou ORM seguro;
- logs não podem conter senha, token, cookie ou corpo sensível;
- segredos apenas no gerenciador de ambiente do backend;
- usuário administrativo sem permissões além do necessário.

## 8. Regras de performance

### Metas

- LCP ≤ 2,5 s;
- CLS ≤ 0,1;
- INP ≤ 200 ms;
- bundle inicial deve permanecer dentro do orçamento definido no CI;
- imagens do hero devem ter poster estático;
- conteúdo abaixo da dobra deve usar lazy loading;
- fontes devem usar `font-display: swap`;
- requisições devem evitar waterfalls evitáveis.

### Obrigatório

- `srcset`/`sizes` para imagens responsivas;
- AVIF ou WebP quando compatível;
- width e height explícitos para mídia;
- code splitting por rota;
- importação direta de ícones;
- debounce em busca e autosave;
- virtualização para listas administrativas grandes;
- cache HTTP e React Query configurados por tipo de dado.

### Proibido

- vídeo 4K como download inicial sem adaptação;
- bibliotecas inteiras para uma função trivial;
- animações pesadas em scroll contínuo;
- imagens base64 grandes no bundle;
- re-render global por digitação em formulário;
- múltiplas fontes com muitos pesos.

## 9. Regras de acessibilidade

- conformidade WCAG 2.2 AA;
- HTML semântico antes de ARIA;
- `button` para ações e `a` para navegação;
- navegação completa por teclado;
- foco visível e previsível;
- skip link no site público e painel;
- modal com focus trap e retorno de foco;
- accordion com `aria-expanded` e associação correta;
- mensagens de erro ligadas aos campos;
- status assíncronos anunciados quando necessário;
- contraste mínimo conforme WCAG;
- mídia decorativa com `alt=""`;
- mídia informativa com texto alternativo objetivo;
- nenhuma informação apenas por cor, forma ou posição;
- áreas de toque adequadas em mobile.

## 10. Regras de SEO

- uma tag `h1` principal por página;
- hierarquia de headings sem saltos arbitrários;
- title e meta description exclusivos;
- canonical absoluto;
- Open Graph e Twitter Card;
- sitemap e robots;
- JSON-LD para `Person`, `WebSite`, `CollectionPage` e recursos quando aplicável;
- URLs permanentes e legíveis;
- links externos com indicação acessível;
- conteúdo público rastreável sem depender de interação;
- imagens compartilháveis com 1200×630;
- páginas administrativas com `noindex, nofollow`.

## 11. Regras de API

- prefixo `/api/v1`;
- JSON em `camelCase`;
- datas ISO 8601 em UTC;
- UUID para identificadores públicos;
- erros no envelope padrão;
- validação de entrada e resposta;
- paginação para coleções;
- idempotência em operações críticas quando aplicável;
- códigos HTTP semânticos;
- nenhuma stack trace em produção;
- documentação atualizada junto com o endpoint.

## 12. Regras para arquivos e mídia

- uploads nunca ficam no repositório principal em produção;
- arquivo deve possuir checksum;
- downloads devem usar nome amigável e seguro;
- limite de tamanho por categoria;
- imagens devem gerar variantes;
- vídeos devem possuir poster;
- arquivos executáveis são bloqueados por padrão;
- exclusão deve considerar referências existentes;
- exclusão definitiva exige confirmação e auditoria.

## 13. Boas práticas de UX

- toda ação deve produzir feedback;
- loading não deve deslocar layout;
- ações destrutivas exigem confirmação contextual;
- salvar e publicar são ações distintas;
- formulários preservam dados após erro recuperável;
- validação deve explicar como corrigir;
- empty states devem orientar próxima ação;
- interface administrativa deve prevenir conteúdo inválido;
- mobile não pode depender de hover;
- links externos devem abrir conforme expectativa e informar quando abrirem nova aba.

## 14. O que nunca deve ser feito

- hardcode de credencial;
- autenticação apenas no React;
- dados administrativos em `localStorage` sem necessidade e proteção;
- upload público irrestrito;
- `eval`, `new Function` ou execução de código do usuário;
- CSS ou JavaScript arbitrário inserido pelo editor;
- publicação de HTML não sanitizado;
- uso de índice como chave em listas ordenáveis;
- remover testes para “fazer passar”;
- ignorar erros de TypeScript;
- usar `// @ts-ignore` sem justificativa específica;
- duplicar componente existente;
- alterar o design system em um componente isolado;
- quebrar `/home` ou `/adm` em acesso direto;
- apagar conteúdo sem histórico ou confirmação;
- lançar sem backup do banco e storage.

## 15. Checklist antes de finalizar qualquer tarefa

### Requisito

- [ ] o comportamento corresponde ao pedido;
- [ ] critérios de aceite foram verificados;
- [ ] casos de erro foram tratados.

### Código

- [ ] nomes claros;
- [ ] sem duplicação desnecessária;
- [ ] sem `any` não justificado;
- [ ] sem código morto;
- [ ] sem segredos;
- [ ] contratos atualizados.

### Interface

- [ ] mobile, tablet e desktop;
- [ ] teclado;
- [ ] foco visível;
- [ ] loading, vazio, erro e sucesso;
- [ ] reduced motion;
- [ ] contraste adequado.

### Qualidade

- [ ] lint;
- [ ] typecheck;
- [ ] testes unitários;
- [ ] testes de integração relevantes;
- [ ] E2E do fluxo crítico;
- [ ] build de produção;
- [ ] console sem erros.

### Documentação e entrega

- [ ] docs atualizados;
- [ ] migration criada quando necessário;
- [ ] changelog/commit claro;
- [ ] riscos e limitações registrados;
- [ ] nenhuma mudança irreversível sem backup.
