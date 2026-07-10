# CLAUDE.md — Instruções para Agentes de IA

## 1. Propósito deste arquivo

Este documento é a instrução operacional principal para qualquer agente de IA que trabalhe no projeto **Fael Records / Vibecodex Portfolio**.

O agente deve:

1. compreender o contexto antes de alterar arquivos;
2. preservar arquitetura, design system e segurança;
3. produzir mudanças pequenas, verificáveis e reversíveis;
4. executar validações antes de declarar uma tarefa concluída;
5. atualizar documentação quando alterar contratos, componentes ou fluxos.

## 2. Objetivo do projeto

Criar um site premium para centralizar:

- ferramentas, agentes e skills de IA;
- utilidades e downloads;
- materiais de design;
- portfólio do desenvolvedor;
- conteúdo administrável por um painel visual em `/adm`.

### Rotas principais

- `/` → redireciona para `/home`;
- `/home` → experiência pública;
- `/adm` → autenticação e painel administrativo.

## 3. Stack oficial

### Frontend

- React
- TypeScript em modo estrito
- Vite
- React Router
- TanStack Query
- React Hook Form
- Zod
- dnd-kit
- Lucide React
- CSS Tokens + Tailwind CSS ou CSS Modules conforme configuração do repositório
- Vitest + Testing Library
- Playwright

### Backend

- Node.js LTS
- TypeScript
- Fastify
- Zod ou TypeBox para schemas
- PostgreSQL
- ORM aprovado no projeto
- Argon2id
- JWT curto + refresh token rotativo em cookie HttpOnly
- Object Storage compatível com S3
- Pino para logs

### Infraestrutura

- GitHub Pages para frontend estático
- GitHub Actions para CI/CD
- serviço externo para API Node.js
- banco e storage gerenciados
- domínio público `portfolio.vibecodex.pro`
- domínio de API configurável por variável de ambiente

## 4. Fontes de verdade

A prioridade de decisão é:

1. requisitos explícitos do proprietário;
2. `ARCHITECTURE.md`;
3. `RULES.md`;
4. `DESIGN-SYSTEM.md`;
5. `API.md`;
6. `COMPONENTS.md`;
7. testes automatizados;
8. implementação existente.

Quando documentação e código divergirem, o agente deve identificar a divergência e corrigir a fonte incorreta na mesma tarefa.

## 5. Estrutura de pastas

```text
.
├── .github/
│   └── workflows/
├── apps/
│   ├── web/
│   │   ├── public/
│   │   ├── scripts/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── assets/
│   │   │   ├── components/
│   │   │   ├── features/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   ├── pages/
│   │   │   ├── styles/
│   │   │   └── types/
│   │   ├── home/index.html
│   │   ├── adm/index.html
│   │   └── index.html
│   └── api/
│       └── src/
│           ├── app/
│           ├── config/
│           ├── db/
│           ├── modules/
│           ├── plugins/
│           ├── shared/
│           └── tests/
├── packages/
│   ├── contracts/
│   ├── design-tokens/
│   └── eslint-config/
├── docs/
├── CLAUDE.md
├── RULES.md
├── COMPONENTS.md
├── API.md
├── DESIGN-SYSTEM.md
└── ARCHITECTURE.md
```

## 6. Convenções de código

### TypeScript

- `strict: true` é obrigatório.
- Não usar `any` sem justificativa documentada.
- Preferir `unknown` e narrowing explícito.
- Não duplicar tipos de API; importar de `packages/contracts`.
- Funções públicas devem ter retorno inferível ou explicitamente tipado quando melhorar o contrato.
- Usar union discriminada para estados complexos.

```ts
// Correto
type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };
```

### React

- Componentes funcionais.
- Props imutáveis.
- Composição antes de boolean props excessivas.
- Estado local para UI local; servidor via React Query.
- Não usar `useEffect` para derivar valores.
- Não realizar fetch diretamente em componentes visuais.
- Componentes devem suportar teclado e leitores de tela.

```tsx
type ToolCardProps = {
  tool: ToolSummary;
  onOpen?: (toolId: string) => void;
};

export function ToolCard({ tool, onOpen }: ToolCardProps) {
  return (
    <article aria-labelledby={`tool-${tool.id}`}>
      <h3 id={`tool-${tool.id}`}>{tool.title}</h3>
      <button type="button" onClick={() => onOpen?.(tool.id)}>
        Abrir ferramenta
      </button>
    </article>
  );
}
```

### Backend

- Organizar por módulo de negócio.
- Controller apenas interpreta HTTP.
- Service contém regra de negócio.
- Repository acessa dados.
- Schema valida entrada e saída.
- Erros de domínio não devem expor stack trace ao cliente.
- Toda escrita administrativa gera registro de auditoria.

## 7. Como criar uma nova funcionalidade

1. Localizar o módulo responsável.
2. Confirmar o contrato de dados.
3. Definir critérios de aceite.
4. Criar ou atualizar schemas em `packages/contracts`.
5. Implementar backend antes de acoplar a interface quando houver persistência.
6. Criar camada de API no frontend.
7. Criar hooks de consulta/mutação.
8. Criar componentes de apresentação.
9. Tratar loading, erro, vazio, sucesso e permissão negada.
10. Adicionar testes.
11. Atualizar documentação.
12. Executar checks do projeto.

### Exemplo de feature

```text
features/tools/
├── api/
│   ├── create-tool.ts
│   └── list-tools.ts
├── components/
│   ├── ToolCard.tsx
│   └── ToolForm.tsx
├── hooks/
│   ├── useCreateTool.ts
│   └── useTools.ts
├── schemas/
│   └── tool-form.schema.ts
├── types/
└── index.ts
```

## 8. Como escrever componentes

Todo componente novo deve responder:

- qual problema resolve;
- em qual camada está;
- se já existe componente equivalente;
- quais estados suporta;
- qual é sua semântica HTML;
- como funciona por teclado;
- como se comporta em mobile;
- como será testado.

### Regras

- um componente não deve misturar busca de dados e apresentação quando a separação for útil;
- componentes compartilhados ficam em `components/`;
- componentes exclusivos ficam dentro da feature;
- variantes visuais devem usar `variant`, não cópias do componente;
- classes devem usar tokens do design system;
- strings visíveis não devem ficar espalhadas quando forem reutilizadas.

## 9. Como lidar com bugs

### Processo obrigatório

1. Reproduzir o problema.
2. Registrar comportamento esperado e observado.
3. Encontrar a causa raiz.
4. Criar teste que falhe antes da correção quando viável.
5. Aplicar a menor correção segura.
6. Executar testes relacionados e regressão.
7. Verificar acessibilidade, performance e segurança afetadas.
8. Documentar mudança relevante.

### Proibido

- mascarar erro com `try/catch` vazio;
- adicionar timeout arbitrário para “resolver” condição de corrida;
- desabilitar lint ou teste sem explicar a causa;
- corrigir sintoma duplicando estado;
- alterar contrato público silenciosamente.

## 10. Como criar commits

Usar Conventional Commits em português ou inglês, mantendo consistência dentro da sequência de trabalho.

```text
feat(admin): adiciona reordenação de seções
fix(auth): renova sessão após expiração do access token
refactor(api): separa serviço e repositório de mídia
test(tools): cobre formulário de criação
chore(ci): adiciona auditoria de dependências
```

### Regras

- um commit deve representar uma mudança lógica;
- não incluir arquivos temporários;
- não incluir segredos;
- não misturar refactor amplo com feature funcional;
- mensagens devem explicar intenção, não apenas arquivo alterado.

## 11. Quando faltar contexto

O agente deve primeiro procurar contexto em:

1. documentação;
2. código próximo;
3. contratos e schemas;
4. testes;
5. histórico recente do Git.

Se ainda houver lacuna:

- não inventar regra de negócio;
- escolher a alternativa mais conservadora e reversível;
- registrar a suposição no resultado;
- não bloquear uma tarefa inteira por detalhe não crítico;
- pedir esclarecimento apenas quando a decisão puder causar perda de dados, falha de segurança ou mudança irreversível.

### Formato de resposta recomendado

```text
Contexto encontrado: ...
Lacuna: ...
Suposição aplicada: ...
Impacto: baixo/médio/alto
Arquivos alterados: ...
Validações executadas: ...
```

## 12. Boas práticas obrigatórias

- mobile first;
- semântica HTML;
- WCAG 2.2 AA;
- validação no cliente e no servidor;
- autenticação e autorização no servidor;
- princípio do menor privilégio;
- logs estruturados sem dados sensíveis;
- imagens responsivas e otimizadas;
- lazy loading abaixo da dobra;
- suporte a `prefers-reduced-motion`;
- estados de erro recuperáveis;
- cache com estratégia explícita;
- dependências mínimas;
- testes proporcionais ao risco;
- documentação atualizada;
- build sem warnings relevantes.

## 13. O que nunca deve ser feito

- nunca inserir senha, token, chave ou service role no frontend;
- nunca persistir senha em texto puro;
- nunca confiar que a rota `/adm` escondida é proteção;
- nunca permitir upload sem validação de tipo, tamanho e autorização;
- nunca usar HTML recebido do painel sem sanitização;
- nunca remover foco visível;
- nunca criar interação disponível apenas por hover;
- nunca usar cor como único indicador de estado;
- nunca quebrar URLs públicas sem redirecionamento;
- nunca adicionar pacote sem verificar necessidade e manutenção;
- nunca ignorar falha de teste para concluir a tarefa;
- nunca sobrescrever conteúdo existente sem backup ou transação;
- nunca recriar componente existente com nome diferente;
- nunca declarar conclusão sem executar validações.

## 14. Comandos de validação

O agente deve usar os scripts existentes no `package.json`. Exemplo esperado:

```bash
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run audit
```

## 15. Checklist de saída do agente

- [ ] requisito atendido;
- [ ] arquitetura preservada;
- [ ] nenhum segredo adicionado;
- [ ] lint aprovado;
- [ ] typecheck aprovado;
- [ ] testes aprovados;
- [ ] build aprovado;
- [ ] responsividade verificada;
- [ ] acessibilidade verificada;
- [ ] documentação atualizada;
- [ ] arquivos alterados listados;
- [ ] limitações ou suposições declaradas.
