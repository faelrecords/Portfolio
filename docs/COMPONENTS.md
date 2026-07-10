# COMPONENTS.md — Catálogo de Componentes

## 1. Convenções gerais

### Nomeação

- componente: `PascalCase`;
- arquivo: mesmo nome do componente;
- props: `<Nome>Props`;
- hook relacionado: `use<Nome>`;
- teste: `<Nome>.test.tsx`;
- story/showcase: `<Nome>.stories.tsx` quando a ferramenta estiver configurada.

### Props compartilhadas

```ts
type CommonProps = {
  className?: string;
  id?: string;
  testId?: string;
};
```

`className` só deve existir quando composição externa for necessária. Não expor props que permitam quebrar invariantes do design system.

---

# 2. Componentes de layout público

## 2.1 `PublicAppShell`

**Objetivo:** aplicar providers, skip link, header, área principal e footer do site público.

**Quando utilizar:** em todas as páginas públicas.

**Quando NÃO utilizar:** no painel `/adm` ou dentro de outro shell.

**Props:**

```ts
type PublicAppShellProps = {
  children: React.ReactNode;
  headerMode?: 'overlay' | 'solid';
};
```

**Exemplo:**

```tsx
<PublicAppShell headerMode="overlay">
  <HomePageContent />
</PublicAppShell>
```

**Relacionados:** `SiteHeader`, `SiteFooter`, `SkipLink`.

**Nomenclatura:** shells terminam em `AppShell`.

## 2.2 `SiteHeader`

**Objetivo:** exibir marca, navegação e menu mobile.

**Quando utilizar:** topo das páginas públicas.

**Quando NÃO utilizar:** como cabeçalho interno de card ou painel administrativo.

**Props:**

```ts
type SiteHeaderProps = {
  navigation: NavigationItem[];
  instagramUrl: string;
  mode?: 'overlay' | 'solid';
};
```

**Exemplo:**

```tsx
<SiteHeader navigation={mainNavigation} instagramUrl="https://instagram.com/fael.records" />
```

**Relacionados:** `BrandMark`, `MobileMenu`, `GlassButton`.

**Nomenclatura:** headers globais usam prefixo `Site`.

## 2.3 `MobileMenu`

**Objetivo:** disponibilizar navegação em telas compactas.

**Quando utilizar:** quando a navegação horizontal não couber.

**Quando NÃO utilizar:** para menus contextuais pequenos.

**Props:**

```ts
type MobileMenuProps = {
  open: boolean;
  items: NavigationItem[];
  onOpenChange: (open: boolean) => void;
};
```

**Exemplo:**

```tsx
<MobileMenu open={open} items={items} onOpenChange={setOpen} />
```

**Relacionados:** `SiteHeader`, `Drawer`, `IconButton`.

**Nomenclatura:** menus de contexto devem ter nome específico, como `ResourceActionsMenu`.

## 2.4 `SiteFooter`

**Objetivo:** encerrar a experiência com navegação, autoria, contato e redes.

**Quando utilizar:** final de páginas públicas.

**Quando NÃO utilizar:** painel administrativo.

**Props:**

```ts
type SiteFooterProps = {
  navigation: NavigationItem[];
  socialLinks: SocialLink[];
  copyright: string;
};
```

**Exemplo:**

```tsx
<SiteFooter navigation={footerNavigation} socialLinks={socialLinks} copyright="Fael Records" />
```

**Relacionados:** `BrandMark`, `ExternalLink`.

**Nomenclatura:** footer global usa `SiteFooter`.

---

# 3. Primitivos visuais

## 3.1 `BrandMark`

**Objetivo:** renderizar símbolo e wordmark oficiais.

**Quando utilizar:** header, hero, footer, login e Open Graph visual.

**Quando NÃO utilizar:** como ícone genérico.

**Props:**

```ts
type BrandMarkProps = {
  variant?: 'symbol' | 'wordmark' | 'lockup';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  inverted?: boolean;
};
```

**Exemplo:**

```tsx
<BrandMark variant="lockup" size="md" />
```

**Relacionados:** `SiteHeader`, `HeroSection`.

**Nomenclatura:** ativos de marca usam `Brand`.

## 3.2 `GlassPanel`

**Objetivo:** superfície liquid glass consistente.

**Quando utilizar:** painéis sobre mídia, bento cards e agrupamentos premium.

**Quando NÃO utilizar:** em todas as superfícies; excesso reduz hierarquia e performance.

**Props:**

```ts
type GlassPanelProps = {
  children: React.ReactNode;
  strength?: 'light' | 'strong';
  radius?: 'md' | 'lg' | 'xl' | '2xl';
  as?: 'div' | 'section' | 'article' | 'aside';
};
```

**Exemplo:**

```tsx
<GlassPanel strength="strong" radius="2xl" as="section">
  <HeroContent />
</GlassPanel>
```

**Relacionados:** `GlassButton`, `FeatureCard`.

**Nomenclatura:** componentes glass usam prefixo `Glass`.

## 3.3 `Button`

**Objetivo:** ação principal ou secundária com estados padronizados.

**Quando utilizar:** submissão, criação, confirmação e ações locais.

**Quando NÃO utilizar:** navegação para outra URL; use `LinkButton`.

**Props:**

```ts
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'glass' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
```

**Exemplo:**

```tsx
<Button variant="primary" trailingIcon={<ArrowRight aria-hidden="true" />}>
  Publicar
</Button>
```

**Relacionados:** `IconButton`, `LinkButton`.

**Nomenclatura:** variante não entra no nome, salvo comportamento semanticamente diferente.

## 3.4 `LinkButton`

**Objetivo:** apresentar um link com aparência de botão.

**Quando utilizar:** CTA que navega para seção, rota ou site externo.

**Quando NÃO utilizar:** ações sem mudança de URL.

**Props:**

```ts
type LinkButtonProps = {
  href: string;
  external?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
};
```

**Exemplo:**

```tsx
<LinkButton href="#ferramentas" variant="glass" size="lg">
  Conhecer ferramentas
</LinkButton>
```

**Relacionados:** `Button`, `ExternalLink`.

**Nomenclatura:** usar `LinkButton`, não `ButtonLink`.

## 3.5 `IconButton`

**Objetivo:** ação compacta baseada em ícone.

**Quando utilizar:** fechar, adicionar, editar, navegar em controles compactos.

**Quando NÃO utilizar:** quando o significado não for reconhecível sem texto.

**Props:**

```ts
type IconButtonProps = {
  label: string;
  icon: React.ReactNode;
  variant?: 'glass' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>;
```

**Exemplo:**

```tsx
<IconButton label="Adicionar seção" icon={<Plus aria-hidden="true" />} />
```

**Relacionados:** `Tooltip`, `Button`.

**Nomenclatura:** nome genérico apenas porque é um primitivo real.

## 3.6 `SectionHeading`

**Objetivo:** padronizar eyebrow, título, ênfase serif e descrição.

**Quando utilizar:** início de seções públicas.

**Quando NÃO utilizar:** títulos pequenos de cards.

**Props:**

```ts
type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  emphasis?: string;
  description?: string;
  align?: 'left' | 'center';
  as?: 'h1' | 'h2';
};
```

**Exemplo:**

```tsx
<SectionHeading
  eyebrow="PROPÓSITO"
  title="Conhecimento que vira"
  emphasis="execução."
  description="Uma biblioteca viva de ferramentas, agentes e recursos."
/>
```

**Relacionados:** `HeroSection`.

**Nomenclatura:** headings de seção usam `SectionHeading`.

## 3.7 `TagPill`

**Objetivo:** exibir categoria ou atributo curto.

**Quando utilizar:** tags de ferramentas, filtros informativos e categorias.

**Quando NÃO utilizar:** botão de filtro interativo; use `FilterChip`.

**Props:**

```ts
type TagPillProps = {
  children: React.ReactNode;
  tone?: 'neutral' | 'accent';
};
```

**Exemplo:**

```tsx
<TagPill tone="accent">Agentes</TagPill>
```

**Relacionados:** `FilterChip`, `ResourceCard`.

**Nomenclatura:** `Pill` para conteúdo estático; `Chip` para interação.

---

# 4. Seções públicas

## 4.1 `HeroSection`

**Objetivo:** apresentar Vibecodex, proposta de valor e CTA principal.

**Quando utilizar:** primeira seção de `/home`.

**Quando NÃO utilizar:** em páginas internas pequenas ou múltiplas vezes na mesma página.

**Props:**

```ts
type HeroSectionProps = {
  eyebrow: string;
  title: string;
  italicTitle?: string;
  description: string;
  primaryCta: LinkAction;
  pills: string[];
  background: ResponsiveVideoAsset;
  featuredItems: FeaturedItem[];
};
```

**Exemplo:**

```tsx
<HeroSection
  eyebrow="FAEL RECORDS"
  title="Vibecodex"
  italicTitle="Ideias transformadas em ferramentas."
  description="Agentes, skills, design e utilidades em um único ecossistema."
  primaryCta={{ label: 'Conhecer ferramentas', href: '#ferramentas' }}
  pills={['Agentes', 'Skills', 'Design']}
  background={heroVideo}
  featuredItems={featuredItems}
/>
```

**Relacionados:** `GlassPanel`, `BrandMark`, `FeatureCard`.

**Nomenclatura:** a seção principal usa nome singular `HeroSection`.

## 4.2 `PurposeSection`

**Objetivo:** explicar por que o site existe e o valor do acervo.

**Quando utilizar:** após o hero.

**Quando NÃO utilizar:** para listar recursos.

**Props:**

```ts
type PurposeSectionProps = {
  heading: SectionHeadingContent;
  statements: PurposeStatement[];
  media?: MediaAsset;
};
```

**Exemplo:**

```tsx
<PurposeSection heading={purposeHeading} statements={purposeStatements} />
```

**Relacionados:** `SectionHeading`, `MetricCard`.

**Nomenclatura:** seções terminam em `Section`.

## 4.3 `ResourceCollectionSection`

**Objetivo:** exibir uma coleção de ferramentas, utilidades ou materiais.

**Quando utilizar:** para grids filtráveis de recursos.

**Quando NÃO utilizar:** para cards editoriais sem modelo de recurso.

**Props:**

```ts
type ResourceCollectionSectionProps = {
  id: string;
  heading: SectionHeadingContent;
  kind: 'aiTool' | 'utility' | 'designMaterial';
  items: ResourceSummary[];
  filters?: ResourceFilter[];
  searchable?: boolean;
};
```

**Exemplo:**

```tsx
<ResourceCollectionSection
  id="ferramentas"
  heading={toolsHeading}
  kind="aiTool"
  items={tools}
  searchable
/>
```

**Relacionados:** `ResourceGrid`, `FilterBar`, `SearchInput`.

**Nomenclatura:** coleção genérica usa `Resource`; casos especiais devem compor este componente.

## 4.4 `FAQSection`

**Objetivo:** responder perguntas recorrentes com boa semântica.

**Quando utilizar:** dúvidas curtas e frequentes.

**Quando NÃO utilizar:** documentação longa ou tutoriais.

**Props:**

```ts
type FAQSectionProps = {
  heading: SectionHeadingContent;
  items: FAQItem[];
  allowMultiple?: boolean;
};
```

**Exemplo:**

```tsx
<FAQSection heading={faqHeading} items={faqs} />
```

**Relacionados:** `Accordion`, `SectionHeading`.

**Nomenclatura:** siglas reconhecidas permanecem em caixa alta.

## 4.5 `CTABannerSection`

**Objetivo:** destacar uma ação final sem competir com o hero.

**Quando utilizar:** próximo ao footer ou entre coleções.

**Quando NÃO utilizar:** para mensagens sem ação.

**Props:**

```ts
type CTABannerSectionProps = {
  title: string;
  description?: string;
  action: LinkAction;
  media?: MediaAsset;
};
```

**Exemplo:**

```tsx
<CTABannerSection
  title="Explore o ecossistema Vibecodex"
  action={{ label: 'Ver ferramentas', href: '#ferramentas' }}
/>
```

**Relacionados:** `GlassPanel`, `LinkButton`.

**Nomenclatura:** usar `CTA` em caixa alta.

---

# 5. Recursos e descoberta

## 5.1 `ResourceCard`

**Objetivo:** apresentar um recurso de maneira consistente.

**Quando utilizar:** grids de ferramentas, utilidades e materiais.

**Quando NÃO utilizar:** seção inteira ou conteúdo sem destino.

**Props:**

```ts
type ResourceCardProps = {
  resource: ResourceSummary;
  variant?: 'default' | 'featured' | 'compact';
  onDownload?: (id: string) => void;
};
```

**Exemplo:**

```tsx
<ResourceCard resource={resource} variant="featured" />
```

**Relacionados:** `ResponsiveMedia`, `TagPill`, `DownloadButton`.

**Nomenclatura:** subtipos podem ser wrappers: `ToolCard`, `UtilityCard`.

## 5.2 `ResourceGrid`

**Objetivo:** organizar cards responsivamente.

**Quando utilizar:** listas visuais de recursos.

**Quando NÃO utilizar:** carrossel ou tabela administrativa.

**Props:**

```ts
type ResourceGridProps = {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
};
```

**Exemplo:**

```tsx
<ResourceGrid columns={3}>
  {items.map((item) => <ResourceCard key={item.id} resource={item} />)}
</ResourceGrid>
```

**Relacionados:** `ResourceCard`, `EmptyState`.

**Nomenclatura:** containers de coleção terminam em `Grid`, `List` ou `Carousel`.

## 5.3 `FilterBar`

**Objetivo:** agrupar filtros e busca de uma coleção.

**Quando utilizar:** coleções com múltiplas categorias.

**Quando NÃO utilizar:** quando há menos de dois filtros úteis.

**Props:**

```ts
type FilterBarProps = {
  filters: ResourceFilter[];
  activeFilters: string[];
  onFilterChange: (ids: string[]) => void;
  search?: SearchControlProps;
};
```

**Exemplo:**

```tsx
<FilterBar filters={filters} activeFilters={active} onFilterChange={setActive} />
```

**Relacionados:** `FilterChip`, `SearchInput`.

**Nomenclatura:** barra agregadora usa `Bar`.

## 5.4 `SearchInput`

**Objetivo:** busca acessível com debounce externo ou configurado.

**Quando utilizar:** listas que suportam busca textual.

**Quando NÃO utilizar:** filtro de opção fechada.

**Props:**

```ts
type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  loading?: boolean;
};
```

**Exemplo:**

```tsx
<SearchInput value={query} onChange={setQuery} label="Buscar ferramentas" />
```

**Relacionados:** `FilterBar`, `TextField`.

**Nomenclatura:** inputs específicos usam o sufixo `Input`.

## 5.5 `DownloadButton`

**Objetivo:** iniciar download e comunicar estado.

**Quando utilizar:** utilidades e materiais baixáveis.

**Quando NÃO utilizar:** links para páginas externas.

**Props:**

```ts
type DownloadButtonProps = {
  assetId: string;
  filename: string;
  sizeLabel?: string;
  onDownload?: (assetId: string) => Promise<void>;
};
```

**Exemplo:**

```tsx
<DownloadButton assetId={asset.id} filename={asset.filename} sizeLabel="2,4 MB" />
```

**Relacionados:** `Button`, `ResourceCard`.

**Nomenclatura:** ações específicas podem estender `Button` por composição.

## 5.6 `ResponsiveMedia`

**Objetivo:** renderizar imagem ou vídeo otimizado com fallback.

**Quando utilizar:** toda mídia de conteúdo.

**Quando NÃO utilizar:** ícones SVG inline.

**Props:**

```ts
type ResponsiveMediaProps = {
  asset: MediaAsset;
  aspectRatio?: string;
  priority?: boolean;
  decorative?: boolean;
};
```

**Exemplo:**

```tsx
<ResponsiveMedia asset={resource.thumbnail} aspectRatio="16 / 10" />
```

**Relacionados:** `HeroBackground`, `ResourceCard`.

**Nomenclatura:** mídia adaptativa usa `ResponsiveMedia`.

---

# 6. Feedback e overlays

## 6.1 `EmptyState`

**Objetivo:** explicar ausência de conteúdo e orientar ação.

**Quando utilizar:** listas vazias, filtros sem resultado e biblioteca sem mídia.

**Quando NÃO utilizar:** loading ou erro.

**Props:**

```ts
type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
};
```

**Exemplo:**

```tsx
<EmptyState title="Nenhuma ferramenta encontrada" action={<Button>Limpar filtros</Button>} />
```

**Relacionados:** `ErrorState`, `Skeleton`.

**Nomenclatura:** estados terminam em `State`.

## 6.2 `ErrorState`

**Objetivo:** comunicar falha recuperável.

**Quando utilizar:** erro de carregamento ou processamento.

**Quando NÃO utilizar:** erro de campo de formulário.

**Props:**

```ts
type ErrorStateProps = {
  title: string;
  description?: string;
  onRetry?: () => void;
};
```

**Exemplo:**

```tsx
<ErrorState title="Não foi possível carregar" onRetry={refetch} />
```

**Relacionados:** `Toast`, `FieldError`.

**Nomenclatura:** usar nome sem detalhes técnicos.

## 6.3 `Modal`

**Objetivo:** base acessível para dialogs.

**Quando utilizar:** tarefas focadas, confirmação ou edição curta.

**Quando NÃO utilizar:** páginas complexas ou conteúdo extenso.

**Props:**

```ts
type ModalProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
  closeOnOverlay?: boolean;
};
```

**Exemplo:**

```tsx
<Modal open={open} title="Editar link" onOpenChange={setOpen}>
  <LinkForm />
</Modal>
```

**Relacionados:** `ConfirmDialog`, `Drawer`.

**Nomenclatura:** dialogs especializados terminam em `Dialog`.

## 6.4 `ConfirmDialog`

**Objetivo:** confirmar ação destrutiva ou irreversível.

**Quando utilizar:** excluir, arquivar ou descartar mudanças.

**Quando NÃO utilizar:** ações comuns e reversíveis.

**Props:**

```ts
type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  tone?: 'danger' | 'warning';
  onConfirm: () => Promise<void> | void;
  onOpenChange: (open: boolean) => void;
};
```

**Exemplo:**

```tsx
<ConfirmDialog
  open={open}
  title="Excluir seção?"
  description="A seção será movida para a lixeira."
  confirmLabel="Excluir"
  tone="danger"
  onConfirm={deleteSection}
  onOpenChange={setOpen}
/>
```

**Relacionados:** `Modal`, `Button`.

**Nomenclatura:** confirmações usam `ConfirmDialog`.

## 6.5 `ToastProvider`

**Objetivo:** exibir feedback breve de ações.

**Quando utilizar:** sucesso, falha recuperável e atualização concluída.

**Quando NÃO utilizar:** informação crítica que precisa permanecer visível.

**Props:** provider sem props obrigatórias além de `children`.

**Exemplo:**

```tsx
<ToastProvider>
  <App />
</ToastProvider>
```

**Relacionados:** `ErrorState`, `PublishBar`.

**Nomenclatura:** providers terminam em `Provider`.

---

# 7. Autenticação e administração

## 7.1 `AdminLoginForm`

**Objetivo:** autenticar o administrador com feedback seguro.

**Quando utilizar:** página `/adm` sem sessão.

**Quando NÃO utilizar:** alteração de senha ou criação de usuário.

**Props:**

```ts
type AdminLoginFormProps = {
  onSubmit: (credentials: LoginInput) => Promise<void>;
  loading?: boolean;
  error?: string;
};
```

**Exemplo:**

```tsx
<AdminLoginForm onSubmit={login} loading={loginMutation.isPending} />
```

**Relacionados:** `TextField`, `PasswordField`, `Button`.

**Nomenclatura:** formulários terminam em `Form`.

## 7.2 `ProtectedRoute`

**Objetivo:** impedir renderização administrativa sem sessão confirmada.

**Quando utilizar:** rotas privadas do painel.

**Quando NÃO utilizar:** como substituto da autorização do backend.

**Props:**

```ts
type ProtectedRouteProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};
```

**Exemplo:**

```tsx
<ProtectedRoute>
  <AdminDashboardPage />
</ProtectedRoute>
```

**Relacionados:** `SessionProvider`, `AdminLoginForm`.

**Nomenclatura:** guards de rota usam sufixo `Route` ou `Guard`.

## 7.3 `AdminAppShell`

**Objetivo:** compor sidebar, topbar, área de conteúdo e publish bar.

**Quando utilizar:** todas as telas autenticadas.

**Quando NÃO utilizar:** login ou site público.

**Props:**

```ts
type AdminAppShellProps = {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  topbar?: React.ReactNode;
};
```

**Exemplo:**

```tsx
<AdminAppShell sidebar={<AdminSidebar />}>
  <Outlet />
</AdminAppShell>
```

**Relacionados:** `AdminSidebar`, `PublishBar`.

**Nomenclatura:** shell administrativo usa `AdminAppShell`.

## 7.4 `AdminSidebar`

**Objetivo:** navegar entre dashboard, páginas, recursos, mídia e auditoria.

**Quando utilizar:** shell administrativo.

**Quando NÃO utilizar:** navegação pública.

**Props:**

```ts
type AdminSidebarProps = {
  items: AdminNavigationItem[];
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
};
```

**Exemplo:**

```tsx
<AdminSidebar items={adminNavigation} />
```

**Relacionados:** `AdminAppShell`, `UserMenu`.

**Nomenclatura:** navegação administrativa usa prefixo `Admin`.

## 7.5 `PublishBar`

**Objetivo:** mostrar estado do rascunho, autosave, preview e publicação.

**Quando utilizar:** editor de página ou recurso publicável.

**Quando NÃO utilizar:** telas somente leitura.

**Props:**

```ts
type PublishBarProps = {
  saveState: 'saved' | 'saving' | 'error' | 'dirty';
  canPublish: boolean;
  onPreview: () => void;
  onPublish: () => Promise<void>;
};
```

**Exemplo:**

```tsx
<PublishBar saveState="saved" canPublish onPreview={openPreview} onPublish={publish} />
```

**Relacionados:** `Button`, `PreviewFrame`.

**Nomenclatura:** barras persistentes terminam em `Bar`.

---

# 8. Editor visual

## 8.1 `SectionBuilder`

**Objetivo:** coordenar paleta, canvas, seleção, ordenação e inspetor.

**Quando utilizar:** edição visual de uma página.

**Quando NÃO utilizar:** formulário simples de recurso.

**Props:**

```ts
type SectionBuilderProps = {
  page: EditablePage;
  templates: BlockTemplate[];
  onChange: (page: EditablePage) => void;
  onSave: (page: EditablePage) => Promise<void>;
};
```

**Exemplo:**

```tsx
<SectionBuilder page={page} templates={templates} onChange={setPage} onSave={savePage} />
```

**Relacionados:** `BlockPalette`, `EditorCanvas`, `PropertyInspector`.

**Nomenclatura:** orquestradores visuais podem terminar em `Builder`.

## 8.2 `BlockPalette`

**Objetivo:** listar templates de seção disponíveis.

**Quando utilizar:** dentro do editor.

**Quando NÃO utilizar:** para listar seções já inseridas.

**Props:**

```ts
type BlockPaletteProps = {
  templates: BlockTemplate[];
  onInsert: (type: BlockType) => void;
};
```

**Exemplo:**

```tsx
<BlockPalette templates={templates} onInsert={insertBlock} />
```

**Relacionados:** `TemplateCard`, `SectionBuilder`.

**Nomenclatura:** conjunto de itens arrastáveis usa `Palette`.

## 8.3 `EditorCanvas`

**Objetivo:** renderizar e ordenar seções editáveis.

**Quando utilizar:** área central do editor visual.

**Quando NÃO utilizar:** preview final sem controles.

**Props:**

```ts
type EditorCanvasProps = {
  sections: EditableSection[];
  selectedId?: string;
  viewport: PreviewViewport;
  onSelect: (id: string) => void;
  onReorder: (ids: string[]) => void;
};
```

**Exemplo:**

```tsx
<EditorCanvas
  sections={sections}
  selectedId={selectedId}
  viewport="desktop"
  onSelect={setSelectedId}
  onReorder={reorder}
/>
```

**Relacionados:** `SortableSection`, `ViewportSwitcher`.

**Nomenclatura:** área principal de edição usa `Canvas`.

## 8.4 `SortableSection`

**Objetivo:** envolver uma seção com seleção, drag handle e ações.

**Quando utilizar:** itens do `EditorCanvas`.

**Quando NÃO utilizar:** renderização pública.

**Props:**

```ts
type SortableSectionProps = {
  section: EditableSection;
  selected: boolean;
  onSelect: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
};
```

**Exemplo:**

```tsx
<SortableSection section={section} selected={selected} onSelect={select} onDuplicate={duplicate} onDelete={remove} />
```

**Relacionados:** `EditorCanvas`, `ConfirmDialog`.

**Nomenclatura:** itens dnd usam prefixo `Sortable`.

## 8.5 `PropertyInspector`

**Objetivo:** editar propriedades do bloco selecionado usando schema.

**Quando utilizar:** editor desktop e drawer em tablet.

**Quando NÃO utilizar:** edição de código arbitrário.

**Props:**

```ts
type PropertyInspectorProps = {
  section: EditableSection | null;
  schema: PropertySchema | null;
  onChange: (patch: SectionPatch) => void;
};
```

**Exemplo:**

```tsx
<PropertyInspector section={selectedSection} schema={schema} onChange={patchSection} />
```

**Relacionados:** `SchemaField`, `MediaPicker`.

**Nomenclatura:** painel de propriedades usa `Inspector`.

## 8.6 `PreviewFrame`

**Objetivo:** exibir preview isolado nos viewports definidos.

**Quando utilizar:** antes de publicar e no editor.

**Quando NÃO utilizar:** como container comum.

**Props:**

```ts
type PreviewFrameProps = {
  viewport: 'mobile' | 'tablet' | 'desktop';
  src?: string;
  children?: React.ReactNode;
};
```

**Exemplo:**

```tsx
<PreviewFrame viewport="mobile" src={previewUrl} />
```

**Relacionados:** `ViewportSwitcher`, `PublishBar`.

**Nomenclatura:** preview isolado usa `Frame`.

## 8.7 `ViewportSwitcher`

**Objetivo:** alternar preview entre mobile, tablet e desktop.

**Quando utilizar:** editor e preview.

**Quando NÃO utilizar:** controle de zoom genérico.

**Props:**

```ts
type ViewportSwitcherProps = {
  value: PreviewViewport;
  onChange: (value: PreviewViewport) => void;
};
```

**Exemplo:**

```tsx
<ViewportSwitcher value={viewport} onChange={setViewport} />
```

**Relacionados:** `PreviewFrame`, `EditorCanvas`.

**Nomenclatura:** alternadores exclusivos usam `Switcher`.

---

# 9. Mídia e formulários administrativos

## 9.1 `MediaLibrary`

**Objetivo:** pesquisar, selecionar, enviar e gerenciar assets.

**Quando utilizar:** rota de mídia e seleção em campos.

**Quando NÃO utilizar:** para uma única imagem fixa sem escolha.

**Props:**

```ts
type MediaLibraryProps = {
  mode?: 'manage' | 'select';
  acceptedTypes?: MediaKind[];
  onSelect?: (asset: MediaAsset) => void;
};
```

**Exemplo:**

```tsx
<MediaLibrary mode="select" acceptedTypes={['image']} onSelect={setThumbnail} />
```

**Relacionados:** `UploadDropzone`, `MediaCard`, `MediaPicker`.

**Nomenclatura:** coleções completas usam `Library`.

## 9.2 `UploadDropzone`

**Objetivo:** receber arquivos por seleção ou arrastar e soltar.

**Quando utilizar:** biblioteca de mídia.

**Quando NÃO utilizar:** upload obrigatório em mobile sem alternativa de botão.

**Props:**

```ts
type UploadDropzoneProps = {
  accept: string[];
  maxSizeBytes: number;
  multiple?: boolean;
  onFiles: (files: File[]) => void;
};
```

**Exemplo:**

```tsx
<UploadDropzone accept={['image/png', 'image/webp']} maxSizeBytes={8_000_000} onFiles={upload} />
```

**Relacionados:** `UploadProgress`, `MediaLibrary`.

**Nomenclatura:** área drag and drop usa `Dropzone`.

## 9.3 `MediaPicker`

**Objetivo:** selecionar ou substituir mídia em um formulário.

**Quando utilizar:** thumbnail, background, poster e arquivos.

**Quando NÃO utilizar:** galeria completa de gerenciamento.

**Props:**

```ts
type MediaPickerProps = {
  value?: MediaAsset;
  kind: MediaKind;
  label: string;
  onChange: (asset?: MediaAsset) => void;
};
```

**Exemplo:**

```tsx
<MediaPicker value={thumbnail} kind="image" label="Capa" onChange={setThumbnail} />
```

**Relacionados:** `MediaLibrary`, `ResponsiveMedia`.

**Nomenclatura:** seleção abreviada usa `Picker`.

## 9.4 `ResourceForm`

**Objetivo:** criar ou editar ferramenta, utilidade ou material.

**Quando utilizar:** CRUD de recursos.

**Quando NÃO utilizar:** edição de seções da página.

**Props:**

```ts
type ResourceFormProps = {
  kind: ResourceKind;
  initialValue?: ResourceFormValue;
  onSubmit: (value: ResourceFormValue) => Promise<void>;
};
```

**Exemplo:**

```tsx
<ResourceForm kind="aiTool" initialValue={resource} onSubmit={saveResource} />
```

**Relacionados:** `MediaPicker`, `TagInput`, `SlugField`.

**Nomenclatura:** formulários de domínio usam o substantivo + `Form`.

## 9.5 `SlugField`

**Objetivo:** editar slug com normalização e validação.

**Quando utilizar:** recursos e páginas com URL própria.

**Quando NÃO utilizar:** IDs internos.

**Props:**

```ts
type SlugFieldProps = {
  value: string;
  sourceValue?: string;
  prefix?: string;
  onChange: (value: string) => void;
};
```

**Exemplo:**

```tsx
<SlugField value={slug} sourceValue={title} prefix="/recursos/" onChange={setSlug} />
```

**Relacionados:** `TextField`, `ResourceForm`.

**Nomenclatura:** campo especializado termina em `Field`.

---

# 10. Regras para novos componentes

Antes de criar um componente:

1. procurar componente equivalente;
2. escolher HTML semântico;
3. definir todas as props necessárias e nenhuma especulativa;
4. evitar mais de três boolean props independentes;
5. definir loading, error, empty e disabled quando aplicável;
6. usar tokens;
7. garantir teclado e foco;
8. testar mobile;
9. adicionar exemplo neste documento;
10. exportar apenas pela API pública da pasta.

### Exemplo de documentação para novo componente

```md
## `ComponentName`

**Objetivo:** ...
**Quando utilizar:** ...
**Quando NÃO utilizar:** ...
**Props:** ...
**Exemplo:** ...
**Relacionados:** ...
**Nomenclatura:** ...
```
