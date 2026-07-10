import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  CircleHelp,
  CloudUpload,
  Copy,
  Download,
  Eye,
  FileJson,
  GripVertical,
  ImagePlus,
  LayoutDashboard,
  Library,
  LoaderCircle,
  LogOut,
  Menu,
  Monitor,
  PanelLeftClose,
  Plus,
  RefreshCw,
  Save,
  Settings,
  Smartphone,
  Tablet,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { Brand } from '../components/Brand';
import { Icon } from '../components/Icon';
import { InstagramIcon } from '../components/InstagramIcon';
import { defaultSite } from '../data/defaultSite';
import {
  clearDraft,
  createId,
  downloadJson,
  loadDraft,
  loadPublishedSite,
  readJsonFile,
  saveDraft,
} from '../lib/content';
import { authenticateAdmin, endAdminSession, hasAdminSession, startAdminSession } from '../lib/adminAuth';
import { publishSiteJson, verifyGithubAccess } from '../lib/githubPublisher';
import { PublicSite } from '../public/PublicApp';

const templateCatalog = [
  { type: 'purpose', label: 'Propósito', icon: 'Orbit', description: 'Texto, pilares e métricas.' },
  { type: 'collection', label: 'Grid de recursos', icon: 'LayoutGrid', description: 'Cards filtráveis com links.' },
  { type: 'textMedia', label: 'Texto + mídia', icon: 'PanelTopOpen', description: 'Seção editorial com imagem.' },
  { type: 'quote', label: 'Manifesto', icon: 'Quote', description: 'Citação ampla de destaque.' },
  { type: 'faq', label: 'FAQ', icon: 'CircleHelp', description: 'Perguntas em acordeão.' },
  { type: 'cta', label: 'CTA', icon: 'MousePointerClick', description: 'Chamada final com botão.' },
];

function LoginView({ onSuccess }) {
  const [username, setUsername] = useState('rafaelrecords');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const valid = await authenticateAdmin(username.trim(), password);
      if (!valid) {
        setError('Usuário ou senha inválidos.');
        return;
      }
      startAdminSession();
      onSuccess();
    } catch (authError) {
      setError(authError.message || 'Não foi possível validar o acesso.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-ambient" aria-hidden="true" />
      <section className="login-card liquid-glass-strong" aria-labelledby="login-title">
        <Brand brand={defaultSite.brand} />
        <div className="login-copy">
          <p className="eyebrow"><span />Painel administrativo</p>
          <h1 id="login-title">Gerencie o <em>Vibecodex</em>.</h1>
          <p>Edite textos, links, cards e seções. Depois publique diretamente no repositório do GitHub.</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <label>
            <span>Usuário</span>
            <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required />
          </label>
          <label>
            <span>Senha</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="admin-primary-button" type="submit" disabled={loading}>
            {loading ? <LoaderCircle className="spin" size={18} /> : <ArrowRight size={18} />}
            Entrar no painel
          </button>
        </form>
        <p className="login-security"><Icon name="ShieldCheck" size={16} /> A senha não está armazenada em texto puro. A publicação exige autorização do GitHub.</p>
      </section>
    </main>
  );
}

function AdminButton({ children, variant = 'default', icon: IconComponent, ...props }) {
  return (
    <button className={`admin-button admin-button--${variant}`} type="button" {...props}>
      {IconComponent && <IconComponent size={16} />}
      {children}
    </button>
  );
}

function TextField({ label, value = '', onChange, type = 'text', placeholder = '', help = '', disabled = false }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input type={type} value={value} placeholder={placeholder} disabled={disabled} onChange={(event) => onChange(event.target.value)} />
      {help && <small>{help}</small>}
    </label>
  );
}

function TextArea({ label, value = '', onChange, rows = 4, help = '' }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <textarea value={value} rows={rows} onChange={(event) => onChange(event.target.value)} />
      {help && <small>{help}</small>}
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  );
}

function SwitchField({ label, checked, onChange }) {
  return (
    <label className="switch-field">
      <span>{label}</span>
      <button type="button" className={checked ? 'is-on' : ''} onClick={() => onChange(!checked)} aria-pressed={checked}>
        <span />
      </button>
    </label>
  );
}

function ImageField({ label, value = '', onChange }) {
  const fileRef = useRef(null);

  function handleFile(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    if (file.size > 1_500_000) {
      window.alert('Use uma imagem com no máximo 1,5 MB para evitar um site.json muito pesado.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <div className="admin-field image-field">
      <span>{label}</span>
      <div className="image-field__preview">
        {value ? <img src={value} alt="Prévia" /> : <ImagePlus size={28} />}
      </div>
      <div className="image-field__actions">
        <input ref={fileRef} hidden type="file" accept="image/*" onChange={(event) => handleFile(event.target.files?.[0])} />
        <AdminButton icon={Upload} onClick={() => fileRef.current?.click()}>Enviar</AdminButton>
        {value && <AdminButton variant="danger" icon={Trash2} onClick={() => onChange('')}>Remover</AdminButton>}
      </div>
      <input value={value.startsWith('data:') ? '' : value} placeholder="Ou cole a URL da imagem" onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function ReorderButtons({ index, length, onMove }) {
  return (
    <div className="mini-actions">
      <button type="button" onClick={() => onMove(index, index - 1)} disabled={index === 0} aria-label="Mover para cima"><ArrowUp size={14} /></button>
      <button type="button" onClick={() => onMove(index, index + 1)} disabled={index === length - 1} aria-label="Mover para baixo"><ArrowDown size={14} /></button>
    </div>
  );
}

function ListCard({ title, subtitle, children, onDelete, onDuplicate, index, length, onMove, collapsed, onToggle }) {
  return (
    <article className="list-editor-card">
      <header>
        <button type="button" className="list-editor-card__toggle" onClick={onToggle}>
          <ChevronDown size={16} className={collapsed ? '' : 'is-open'} />
          <span><strong>{title || 'Item sem título'}</strong>{subtitle && <small>{subtitle}</small>}</span>
        </button>
        <div className="list-editor-card__actions">
          {onMove && <ReorderButtons index={index} length={length} onMove={onMove} />}
          {onDuplicate && <button type="button" onClick={onDuplicate} aria-label="Duplicar"><Copy size={14} /></button>}
          {onDelete && <button type="button" onClick={onDelete} aria-label="Excluir"><Trash2 size={14} /></button>}
        </div>
      </header>
      {!collapsed && <div className="list-editor-card__body">{children}</div>}
    </article>
  );
}

function ResourceItemsEditor({ items, onChange }) {
  const [collapsed, setCollapsed] = useState({});

  function updateItem(index, patch) {
    onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  }
  function moveItem(from, to) {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  }
  function addItem() {
    onChange([...items, {
      id: createId('item'), title: 'Novo recurso', description: 'Descreva o material.', tags: ['Todos'], status: 'Novo', icon: 'Sparkles', href: '#', image: '',
    }]);
  }

  return (
    <div className="list-editor">
      {items.map((item, index) => (
        <ListCard
          key={item.id}
          title={item.title}
          subtitle={item.status}
          index={index}
          length={items.length}
          onMove={moveItem}
          collapsed={collapsed[item.id]}
          onToggle={() => setCollapsed((current) => ({ ...current, [item.id]: !current[item.id] }))}
          onDuplicate={() => onChange([...items.slice(0, index + 1), { ...structuredClone(item), id: createId('item'), title: `${item.title} — cópia` }, ...items.slice(index + 1)])}
          onDelete={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
        >
          <TextField label="Título" value={item.title} onChange={(value) => updateItem(index, { title: value })} />
          <TextArea label="Descrição" value={item.description} onChange={(value) => updateItem(index, { description: value })} />
          <div className="field-grid field-grid--2">
            <TextField label="Status / formato" value={item.status} onChange={(value) => updateItem(index, { status: value })} />
            <TextField label="Ícone Lucide" value={item.icon} onChange={(value) => updateItem(index, { icon: value })} help="Ex.: Bot, Download, Image, Sparkles" />
          </div>
          <TextField label="Tags" value={item.tags.join(', ')} onChange={(value) => updateItem(index, { tags: value.split(',').map((tag) => tag.trim()).filter(Boolean) })} />
          <TextField label="Link / download" value={item.href} onChange={(value) => updateItem(index, { href: value })} placeholder="https://..." />
          <ImageField label="Imagem opcional" value={item.image} onChange={(value) => updateItem(index, { image: value })} />
          <SwitchField label="Card em destaque" checked={Boolean(item.featured)} onChange={(value) => updateItem(index, { featured: value })} />
        </ListCard>
      ))}
      <AdminButton icon={Plus} onClick={addItem}>Adicionar recurso</AdminButton>
    </div>
  );
}

function FaqItemsEditor({ items, onChange }) {
  const [collapsed, setCollapsed] = useState({});
  const update = (index, patch) => onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, ...patch } : item));
  const move = (from, to) => {
    if (to < 0 || to >= items.length) return;
    const next = [...items];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };
  return (
    <div className="list-editor">
      {items.map((item, index) => (
        <ListCard
          key={`${item.question}-${index}`}
          title={item.question}
          index={index}
          length={items.length}
          onMove={move}
          collapsed={collapsed[index]}
          onToggle={() => setCollapsed((current) => ({ ...current, [index]: !current[index] }))}
          onDelete={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))}
        >
          <TextField label="Pergunta" value={item.question} onChange={(value) => update(index, { question: value })} />
          <TextArea label="Resposta" value={item.answer} onChange={(value) => update(index, { answer: value })} rows={5} />
        </ListCard>
      ))}
      <AdminButton icon={Plus} onClick={() => onChange([...items, { question: 'Nova pergunta', answer: 'Escreva a resposta.' }])}>Adicionar pergunta</AdminButton>
    </div>
  );
}

function PurposeEditor({ props, onChange }) {
  const updateCard = (index, patch) => onChange({ ...props, cards: props.cards.map((card, cardIndex) => cardIndex === index ? { ...card, ...patch } : card) });
  const updateMetric = (index, patch) => onChange({ ...props, metrics: props.metrics.map((metric, metricIndex) => metricIndex === index ? { ...metric, ...patch } : metric) });
  return (
    <>
      <TextField label="Rótulo" value={props.eyebrow} onChange={(value) => onChange({ ...props, eyebrow: value })} />
      <TextArea label="Título" value={props.title} onChange={(value) => onChange({ ...props, title: value })} rows={3} />
      <TextArea label="Texto principal" value={props.body} onChange={(value) => onChange({ ...props, body: value })} rows={6} />
      <div className="inspector-group"><h4>Pilares</h4>
        {props.cards.map((card, index) => (
          <div className="compact-fields" key={`${card.title}-${index}`}>
            <TextField label={`Pilar ${index + 1}`} value={card.title} onChange={(value) => updateCard(index, { title: value })} />
            <TextField label="Ícone" value={card.icon} onChange={(value) => updateCard(index, { icon: value })} />
            <TextArea label="Descrição" value={card.text} onChange={(value) => updateCard(index, { text: value })} rows={3} />
          </div>
        ))}
      </div>
      <div className="inspector-group"><h4>Métricas</h4>
        {props.metrics.map((metric, index) => (
          <div className="field-grid field-grid--2" key={`${metric.label}-${index}`}>
            <TextField label="Valor" value={metric.value} onChange={(value) => updateMetric(index, { value })} />
            <TextField label="Legenda" value={metric.label} onChange={(value) => updateMetric(index, { label: value })} />
          </div>
        ))}
      </div>
    </>
  );
}

function CollectionEditor({ props, onChange }) {
  return (
    <>
      <TextField label="Rótulo" value={props.eyebrow} onChange={(value) => onChange({ ...props, eyebrow: value })} />
      <TextArea label="Título" value={props.title} onChange={(value) => onChange({ ...props, title: value })} rows={3} />
      <TextArea label="Descrição" value={props.description} onChange={(value) => onChange({ ...props, description: value })} rows={4} />
      <SelectField
        label="Variação visual"
        value={props.variant}
        onChange={(value) => onChange({ ...props, variant: value })}
        options={[
          { value: 'ai', label: 'Ferramentas de IA' },
          { value: 'utility', label: 'Utilidades' },
          { value: 'design', label: 'Design' },
        ]}
      />
      <TextField label="Filtros" value={props.filters.join(', ')} onChange={(value) => onChange({ ...props, filters: value.split(',').map((item) => item.trim()).filter(Boolean) })} help="Separe por vírgula. Mantenha Todos como primeiro filtro." />
      <div className="inspector-group"><h4>Recursos</h4><ResourceItemsEditor items={props.items} onChange={(items) => onChange({ ...props, items })} /></div>
    </>
  );
}

function SectionInspector({ section, onChange }) {
  if (!section) return <div className="empty-inspector"><Settings size={28} /><p>Selecione uma seção para editar.</p></div>;
  const updateProps = (props) => onChange({ ...section, props });
  let editor;
  if (section.type === 'purpose') editor = <PurposeEditor props={section.props} onChange={updateProps} />;
  if (section.type === 'collection') editor = <CollectionEditor props={section.props} onChange={updateProps} />;
  if (section.type === 'faq') editor = (
    <>
      <TextField label="Rótulo" value={section.props.eyebrow} onChange={(value) => updateProps({ ...section.props, eyebrow: value })} />
      <TextField label="Título" value={section.props.title} onChange={(value) => updateProps({ ...section.props, title: value })} />
      <TextArea label="Descrição" value={section.props.description} onChange={(value) => updateProps({ ...section.props, description: value })} />
      <FaqItemsEditor items={section.props.items} onChange={(items) => updateProps({ ...section.props, items })} />
    </>
  );
  if (section.type === 'quote') editor = (
    <>
      <TextField label="Rótulo" value={section.props.eyebrow} onChange={(value) => updateProps({ ...section.props, eyebrow: value })} />
      <TextArea label="Citação" value={section.props.quote} onChange={(value) => updateProps({ ...section.props, quote: value })} rows={5} />
      <TextField label="Autor" value={section.props.author} onChange={(value) => updateProps({ ...section.props, author: value })} />
    </>
  );
  if (section.type === 'cta') editor = (
    <>
      <TextField label="Rótulo" value={section.props.eyebrow} onChange={(value) => updateProps({ ...section.props, eyebrow: value })} />
      <TextArea label="Título" value={section.props.title} onChange={(value) => updateProps({ ...section.props, title: value })} rows={4} />
      <TextArea label="Texto" value={section.props.body} onChange={(value) => updateProps({ ...section.props, body: value })} />
      <TextField label="Texto do botão" value={section.props.action.label} onChange={(value) => updateProps({ ...section.props, action: { ...section.props.action, label: value } })} />
      <TextField label="Link do botão" value={section.props.action.href} onChange={(value) => updateProps({ ...section.props, action: { ...section.props.action, href: value } })} />
    </>
  );
  if (section.type === 'textMedia') editor = (
    <>
      <TextField label="Rótulo" value={section.props.eyebrow} onChange={(value) => updateProps({ ...section.props, eyebrow: value })} />
      <TextArea label="Título" value={section.props.title} onChange={(value) => updateProps({ ...section.props, title: value })} rows={4} />
      <TextArea label="Texto" value={section.props.body} onChange={(value) => updateProps({ ...section.props, body: value })} rows={7} />
      <ImageField label="Imagem" value={section.props.image} onChange={(value) => updateProps({ ...section.props, image: value })} />
      <TextField label="Texto alternativo" value={section.props.imageAlt} onChange={(value) => updateProps({ ...section.props, imageAlt: value })} />
      <SwitchField label="Imagem à esquerda" checked={Boolean(section.props.reverse)} onChange={(value) => updateProps({ ...section.props, reverse: value })} />
      <TextField label="Texto do botão" value={section.props.action?.label || ''} onChange={(value) => updateProps({ ...section.props, action: { ...(section.props.action || {}), label: value } })} />
      <TextField label="Link" value={section.props.action?.href || ''} onChange={(value) => updateProps({ ...section.props, action: { ...(section.props.action || {}), href: value } })} />
    </>
  );

  return (
    <div className="section-inspector">
      <div className="inspector-group">
        <h4>Configuração da seção</h4>
        <TextField label="ID da seção" value={section.id} onChange={(value) => onChange({ ...section, id: value.replace(/[^a-z0-9-_]/gi, '-').toLowerCase() })} />
        <SwitchField label="Visível no site" checked={section.visible} onChange={(value) => onChange({ ...section, visible: value })} />
      </div>
      <div className="inspector-group"><h4>Conteúdo</h4>{editor}</div>
    </div>
  );
}

function HeroEditor({ site, onChange }) {
  const hero = site.hero;
  const brand = site.brand;
  const updateHero = (patch) => onChange({ ...site, hero: { ...hero, ...patch } });
  const updateBrand = (patch) => onChange({ ...site, brand: { ...brand, ...patch } });
  return (
    <div className="settings-editor">
      <div className="inspector-group">
        <h3>Marca</h3>
        <TextField label="Nome" value={brand.name} onChange={(value) => updateBrand({ name: value })} />
        <TextField label="Assinatura" value={brand.tagline} onChange={(value) => updateBrand({ tagline: value })} />
        <TextField label="Instagram" value={brand.instagram} onChange={(value) => updateBrand({ instagram: value })} />
        <TextField label="Rótulo do Instagram" value={brand.instagramLabel} onChange={(value) => updateBrand({ instagramLabel: value })} />
      </div>
      <div className="inspector-group">
        <h3>Hero</h3>
        <TextField label="Rótulo" value={hero.eyebrow} onChange={(value) => updateHero({ eyebrow: value })} />
        <div className="field-grid field-grid--2">
          <TextField label="Título" value={hero.title} onChange={(value) => updateHero({ title: value })} />
          <TextField label="Acento" value={hero.titleAccent} onChange={(value) => updateHero({ titleAccent: value })} />
        </div>
        <TextArea label="Descrição" value={hero.description} onChange={(value) => updateHero({ description: value })} rows={4} />
        <TextField label="Texto do botão" value={hero.primaryAction.label} onChange={(value) => updateHero({ primaryAction: { ...hero.primaryAction, label: value } })} />
        <TextField label="Destino do botão" value={hero.primaryAction.href} onChange={(value) => updateHero({ primaryAction: { ...hero.primaryAction, href: value } })} />
        <TextField label="Pílulas" value={hero.pills.join(', ')} onChange={(value) => updateHero({ pills: value.split(',').map((item) => item.trim()).filter(Boolean) })} />
        <TextArea label="Citação" value={hero.quote} onChange={(value) => updateHero({ quote: value })} />
      </div>
    </div>
  );
}

function FooterEditor({ site, onChange }) {
  const footer = site.footer;
  const update = (patch) => onChange({ ...site, footer: { ...footer, ...patch } });
  return (
    <div className="settings-editor">
      <div className="inspector-group">
        <h3>Rodapé</h3>
        <TextArea label="Mensagem" value={footer.statement} onChange={(value) => update({ statement: value })} />
        <TextField label="Copyright" value={footer.copyright} onChange={(value) => update({ copyright: value })} />
      </div>
      <div className="inspector-group">
        <h3>SEO</h3>
        <TextField label="Título da página" value={site.meta.title} onChange={(value) => onChange({ ...site, meta: { ...site.meta, title: value } })} />
        <TextArea label="Descrição" value={site.meta.description} onChange={(value) => onChange({ ...site, meta: { ...site.meta, description: value } })} />
      </div>
    </div>
  );
}

function createSection(type) {
  const id = createId(type);
  const common = { id, type, visible: true };
  if (type === 'purpose') return { ...common, props: structuredClone(defaultSite.sections.find((section) => section.type === 'purpose').props) };
  if (type === 'collection') return { ...common, props: { eyebrow: 'Nova coleção', title: 'Título da nova coleção', description: 'Descreva a coleção.', variant: 'ai', filters: ['Todos'], items: [] } };
  if (type === 'faq') return { ...common, props: { eyebrow: 'FAQ', title: 'Perguntas frequentes', description: 'Respostas importantes.', items: [{ question: 'Nova pergunta', answer: 'Escreva a resposta.' }] } };
  if (type === 'quote') return { ...common, props: { eyebrow: 'Manifesto', quote: 'Uma ideia forte merece uma apresentação à altura.', author: 'Fael Records' } };
  if (type === 'cta') return { ...common, props: { eyebrow: 'Próximo passo', title: 'Transforme a atenção em ação.', body: 'Escreva uma chamada clara.', action: { label: 'Abrir link', href: '#' } } };
  return { ...common, props: { eyebrow: 'Nova seção', title: 'Texto com mídia', body: 'Adicione o conteúdo desta seção.', image: '', imageAlt: '', reverse: false, action: { label: '', href: '#' } } };
}

function SectionList({ sections, selectedId, onSelect, onChange, onAdd, onClose }) {
  const [showTemplates, setShowTemplates] = useState(false);
  const dragId = useRef(null);

  function move(fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= sections.length) return;
    const next = [...sections];
    const [section] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, section);
    onChange(next);
  }

  function handleDrop(targetId) {
    const sourceId = dragId.current;
    if (!sourceId || sourceId === targetId) return;
    const sourceIndex = sections.findIndex((section) => section.id === sourceId);
    const targetIndex = sections.findIndex((section) => section.id === targetId);
    move(sourceIndex, targetIndex);
    dragId.current = null;
  }

  return (
    <aside className="admin-sections-panel">
      <div className="panel-heading">
        <div><span>Estrutura</span><strong>Seções da página</strong></div>
        <div className="panel-heading__actions">
          <button type="button" onClick={() => setShowTemplates(true)} aria-label="Adicionar seção"><Plus size={18} /></button>
          {onClose && <button className="panel-close-button" type="button" onClick={onClose} aria-label="Fechar painel"><X size={17} /></button>}
        </div>
      </div>
      <div className="section-tree">
        <button className="section-tree__fixed" type="button" onClick={() => onSelect('__hero')}><Icon name="PanelTop" size={17} /><span><strong>Header + Hero</strong><small>Seção fixa</small></span></button>
        {sections.map((section, index) => (
          <div
            className={`section-tree__item ${selectedId === section.id ? 'is-selected' : ''} ${section.visible ? '' : 'is-hidden'}`}
            key={section.id}
            draggable
            onDragStart={() => { dragId.current = section.id; }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => handleDrop(section.id)}
          >
            <button type="button" className="section-tree__select" onClick={() => onSelect(section.id)}>
              <GripVertical size={15} />
              <Icon name={templateCatalog.find((item) => item.type === section.type)?.icon || 'Box'} size={17} />
              <span><strong>{section.props.eyebrow || section.props.title || section.type}</strong><small>{section.type}</small></span>
            </button>
            <div className="section-tree__actions">
              <button type="button" onClick={() => move(index, index - 1)} disabled={index === 0}><ArrowUp size={13} /></button>
              <button type="button" onClick={() => move(index, index + 1)} disabled={index === sections.length - 1}><ArrowDown size={13} /></button>
            </div>
          </div>
        ))}
        <button className="section-tree__fixed" type="button" onClick={() => onSelect('__footer')}><Icon name="PanelBottom" size={17} /><span><strong>Footer + SEO</strong><small>Seção fixa</small></span></button>
      </div>
      <AdminButton icon={Plus} onClick={() => setShowTemplates(true)}>Adicionar seção</AdminButton>

      {showTemplates && (
        <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setShowTemplates(false)}>
          <section className="template-modal liquid-glass-strong" role="dialog" aria-modal="true" aria-labelledby="template-title">
            <header><div><span>Novo bloco</span><h2 id="template-title">Escolha um template</h2></div><button type="button" onClick={() => setShowTemplates(false)}><X /></button></header>
            <div className="template-grid">
              {templateCatalog.map((template) => (
                <button key={template.type} type="button" onClick={() => { onAdd(template.type); setShowTemplates(false); }}>
                  <span><Icon name={template.icon} size={25} /></span>
                  <strong>{template.label}</strong>
                  <small>{template.description}</small>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </aside>
  );
}

function PreviewCanvas({ site, device }) {
  const widths = { desktop: 1440, tablet: 820, mobile: 390 };
  return (
    <div className={`admin-preview admin-preview--${device}`}>
      <div className="admin-preview__browser" style={{ '--preview-width': `${widths[device]}px` }}>
        <div className="browser-bar"><span /><span /><span /><div>portfolio.vibecodex.pro/home</div></div>
        <div className="admin-preview__viewport">
          <div className="admin-preview__document"><PublicSite initialSite={site} preview /></div>
        </div>
      </div>
    </div>
  );
}

function PublishPanel({ site, onImport, onReset }) {
  const [token, setToken] = useState('');
  const [owner, setOwner] = useState('faelrecords');
  const [repo, setRepo] = useState('Portfolio');
  const [branch, setBranch] = useState('main');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);

  async function publish() {
    setStatus({ type: '', message: '' });
    if (!token.trim()) {
      setStatus({ type: 'error', message: 'Informe um token GitHub com permissão Contents: Read and write.' });
      return;
    }
    setLoading(true);
    try {
      await verifyGithubAccess({ token: token.trim(), owner, repo });
      const result = await publishSiteJson({ token: token.trim(), owner, repo, branch, site });
      setStatus({ type: 'success', message: `Conteúdo enviado. Commit ${result.commit.sha.slice(0, 7)} criado e o deploy será iniciado pelo GitHub Actions.` });
      setToken('');
    } catch (error) {
      setStatus({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="publish-view">
      <section className="publish-card liquid-glass">
        <div className="publish-card__icon"><FileJson /></div>
        <div><span>Backup local</span><h2>Exportar ou importar conteúdo</h2><p>O arquivo contém textos, links, configurações e imagens pequenas incorporadas.</p></div>
        <div className="publish-actions">
          <AdminButton icon={Download} onClick={() => downloadJson(site)}>Baixar site.json</AdminButton>
          <input ref={fileRef} hidden type="file" accept="application/json" onChange={(event) => event.target.files?.[0] && onImport(event.target.files[0])} />
          <AdminButton icon={Upload} onClick={() => fileRef.current?.click()}>Importar JSON</AdminButton>
          <AdminButton variant="danger" icon={RefreshCw} onClick={onReset}>Restaurar conteúdo publicado</AdminButton>
        </div>
      </section>

      <section className="publish-card publish-card--github liquid-glass-strong">
        <div className="publish-card__icon"><CloudUpload /></div>
        <div><span>Publicação</span><h2>Enviar para o GitHub</h2><p>O token permanece apenas na memória desta tela e é apagado depois da publicação ou ao sair.</p></div>
        <div className="github-form">
          <TextField label="Fine-grained personal access token" type="password" value={token} onChange={setToken} placeholder="github_pat_..." help="Permissão mínima: Contents — Read and write somente no repositório Portfolio." />
          <div className="field-grid field-grid--3">
            <TextField label="Proprietário" value={owner} onChange={setOwner} />
            <TextField label="Repositório" value={repo} onChange={setRepo} />
            <TextField label="Branch" value={branch} onChange={setBranch} />
          </div>
          {status.message && <div className={`publish-status publish-status--${status.type}`}>{status.type === 'success' ? <Check size={17} /> : <CircleHelp size={17} />}<span>{status.message}</span></div>}
          <button className="admin-primary-button" type="button" onClick={publish} disabled={loading}>
            {loading ? <LoaderCircle className="spin" size={18} /> : <CloudUpload size={18} />}
            Publicar alterações
          </button>
        </div>
      </section>
    </div>
  );
}

function DashboardSummary({ site, onNavigate }) {
  const resourceCount = site.sections.filter((section) => section.type === 'collection').reduce((count, section) => count + section.props.items.length, 0);
  const visibleCount = site.sections.filter((section) => section.visible).length;
  return (
    <div className="dashboard-view">
      <section className="dashboard-welcome liquid-glass-strong">
        <div><p className="eyebrow"><span />Central Vibecodex</p><h1>Seu portfólio está pronto para <em>evoluir.</em></h1><p>Edite o conteúdo visualmente, revise a prévia e publique no GitHub sem alterar código.</p><AdminButton icon={ArrowRight} variant="accent" onClick={() => onNavigate('editor')}>Abrir editor</AdminButton></div>
        <div className="dashboard-orbit" aria-hidden="true"><img src="/assets/mark.svg" alt="" /></div>
      </section>
      <div className="dashboard-stats">
        <article className="liquid-glass"><span>Seções visíveis</span><strong>{visibleCount}</strong><small>de {site.sections.length} seções</small></article>
        <article className="liquid-glass"><span>Recursos cadastrados</span><strong>{resourceCount}</strong><small>IA, utilidades e design</small></article>
        <article className="liquid-glass"><span>Versão do conteúdo</span><strong>v{site.version}</strong><small>Rascunho salvo localmente</small></article>
      </div>
      <div className="dashboard-quick-grid">
        <button className="liquid-glass" type="button" onClick={() => onNavigate('editor')}><LayoutDashboard /><span><strong>Editar página</strong><small>Seções, cards e conteúdo</small></span><ArrowRight /></button>
        <button className="liquid-glass" type="button" onClick={() => onNavigate('publish')}><CloudUpload /><span><strong>Publicar alterações</strong><small>Enviar conteúdo ao GitHub</small></span><ArrowRight /></button>
        <a className="liquid-glass" href="/home/" target="_blank" rel="noreferrer"><Eye /><span><strong>Visualizar site</strong><small>Abrir página pública</small></span><ArrowRight /></a>
      </div>
    </div>
  );
}

function EditorWorkspace({ site, setSite, selectedId, setSelectedId }) {
  const [device, setDevice] = useState('desktop');
  const [leftOpen, setLeftOpen] = useState(() => window.innerWidth > 720);
  const [inspectorOpen, setInspectorOpen] = useState(() => window.innerWidth > 960);
  const selectedSection = site.sections.find((section) => section.id === selectedId);

  function updateSections(sections) { setSite({ ...site, sections }); }
  function updateSection(nextSection) {
    setSite({ ...site, sections: site.sections.map((section) => section.id === nextSection.id || section.id === selectedId ? nextSection : section) });
    if (nextSection.id !== selectedId) setSelectedId(nextSection.id);
  }
  function addSection(type) {
    const section = createSection(type);
    setSite({ ...site, sections: [...site.sections, section] });
    setSelectedId(section.id);
  }
  function deleteSection() {
    if (!selectedSection) return;
    if (!window.confirm(`Excluir a seção “${selectedSection.props.eyebrow || selectedSection.props.title || selectedSection.id}”?`)) return;
    const remaining = site.sections.filter((section) => section.id !== selectedSection.id);
    setSite({ ...site, sections: remaining });
    setSelectedId(remaining[0]?.id || '__hero');
  }
  function duplicateSection() {
    if (!selectedSection) return;
    const index = site.sections.findIndex((section) => section.id === selectedSection.id);
    const copy = structuredClone(selectedSection);
    copy.id = createId(selectedSection.type);
    if (copy.props.eyebrow) copy.props.eyebrow += ' — cópia';
    const next = [...site.sections];
    next.splice(index + 1, 0, copy);
    setSite({ ...site, sections: next });
    setSelectedId(copy.id);
  }

  return (
    <div className={`editor-workspace ${leftOpen ? '' : 'is-left-collapsed'} ${inspectorOpen ? '' : 'is-inspector-collapsed'}`}>
      {leftOpen && <SectionList sections={site.sections} selectedId={selectedId} onSelect={(id) => { setSelectedId(id); if (window.innerWidth <= 720) setLeftOpen(false); }} onChange={updateSections} onAdd={addSection} onClose={() => setLeftOpen(false)} />}
      <section className="editor-canvas-panel">
        <div className="editor-canvas-toolbar">
          <button type="button" onClick={() => setLeftOpen((value) => !value)} aria-label="Alternar painel de seções"><PanelLeftClose size={17} /></button>
          <div className="device-switcher" role="group" aria-label="Tamanho da prévia">
            <button className={device === 'desktop' ? 'is-active' : ''} type="button" onClick={() => setDevice('desktop')} aria-label="Desktop"><Monitor size={16} /></button>
            <button className={device === 'tablet' ? 'is-active' : ''} type="button" onClick={() => setDevice('tablet')} aria-label="Tablet"><Tablet size={16} /></button>
            <button className={device === 'mobile' ? 'is-active' : ''} type="button" onClick={() => setDevice('mobile')} aria-label="Celular"><Smartphone size={16} /></button>
          </div>
          <div className="editor-toolbar-end"><button type="button" className={inspectorOpen ? 'is-active' : ''} onClick={() => setInspectorOpen((value) => !value)} aria-label="Alternar inspetor"><Settings size={16} /></button><a href="/home/" target="_blank" rel="noreferrer"><Eye size={16} /> Abrir site</a></div>
        </div>
        <PreviewCanvas site={site} device={device} />
      </section>
      {inspectorOpen && <aside className="admin-inspector-panel">
        <div className="panel-heading"><div><span>Inspetor</span><strong>{selectedId === '__hero' ? 'Header + Hero' : selectedId === '__footer' ? 'Footer + SEO' : selectedSection?.props.eyebrow || selectedSection?.type || 'Selecione'}</strong></div></div>
        <div className="inspector-scroll">
          {selectedId === '__hero' && <HeroEditor site={site} onChange={setSite} />}
          {selectedId === '__footer' && <FooterEditor site={site} onChange={setSite} />}
          {!selectedId.startsWith('__') && <SectionInspector section={selectedSection} onChange={updateSection} />}
        </div>
        {selectedSection && (
          <div className="inspector-footer-actions">
            <AdminButton icon={Copy} onClick={duplicateSection}>Duplicar</AdminButton>
            <AdminButton variant="danger" icon={Trash2} onClick={deleteSection}>Excluir</AdminButton>
          </div>
        )}
      </aside>}
    </div>
  );
}

function AdminShell({ onLogout }) {
  const [site, setSite] = useState(() => loadDraft());
  const [view, setView] = useState('dashboard');
  const [selectedId, setSelectedId] = useState('__hero');
  const [savedAt, setSavedAt] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (site !== null) return undefined;
    let cancelled = false;
    loadPublishedSite().then((published) => {
      if (!cancelled) setSite(published);
    });
    return () => { cancelled = true; };
  }, [site]);

  useEffect(() => {
    if (!site) return undefined;
    const timer = window.setTimeout(() => {
      saveDraft(site);
      setSavedAt(new Date());
    }, 450);
    return () => window.clearTimeout(timer);
  }, [site]);

  async function importContent(file) {
    try {
      const imported = await readJsonFile(file);
      setSite(imported);
      setSavedAt(new Date());
    } catch {
      window.alert('Não foi possível importar o JSON. Verifique o formato do arquivo.');
    }
  }

  async function resetContent() {
    if (!window.confirm('Descartar o rascunho local e restaurar o conteúdo atualmente publicado?')) return;
    clearDraft();
    setSite(await loadPublishedSite());
  }

  if (!site) return <div className="admin-loading"><LoaderCircle className="spin" /><span>Carregando painel</span></div>;

  const navItems = [
    { id: 'dashboard', label: 'Visão geral', icon: LayoutDashboard },
    { id: 'editor', label: 'Editor visual', icon: Library },
    { id: 'publish', label: 'Publicar', icon: CloudUpload },
  ];

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <Brand brand={site.brand} />
        <nav>
          <span>Workspace</span>
          {navItems.map((item) => (
            <button key={item.id} className={view === item.id ? 'is-active' : ''} type="button" onClick={() => { setView(item.id); setSidebarOpen(false); }}>
              <item.icon size={18} /><span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="admin-sidebar__bottom">
          <a href={site.brand.instagram} target="_blank" rel="noreferrer"><InstagramIcon size={17} />{site.brand.instagramLabel}</a>
          <button type="button" onClick={onLogout}><LogOut size={17} />Sair</button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-mobile-menu" type="button" onClick={() => setSidebarOpen((value) => !value)}><Menu /></button>
          <div>
            <span>{view === 'dashboard' ? 'Dashboard' : view === 'editor' ? 'Editor da página' : 'Publicação'}</span>
            <small>{savedAt ? `Rascunho salvo às ${savedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : 'Carregando rascunho'}</small>
          </div>
          <div className="admin-topbar__actions">
            <a href="/home/" target="_blank" rel="noreferrer"><Eye size={16} />Visualizar site</a>
            <button type="button" className="admin-save-state"><Save size={16} />Salvo</button>
          </div>
        </header>
        <main className={`admin-content admin-content--${view}`}>
          {view === 'dashboard' && <DashboardSummary site={site} onNavigate={setView} />}
          {view === 'editor' && <EditorWorkspace site={site} setSite={setSite} selectedId={selectedId} setSelectedId={setSelectedId} />}
          {view === 'publish' && <PublishPanel site={site} onImport={importContent} onReset={resetContent} />}
        </main>
      </div>
    </div>
  );
}

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState(hasAdminSession());
  function logout() {
    endAdminSession();
    setAuthenticated(false);
  }
  return authenticated ? <AdminShell onLogout={logout} /> : <LoginView onSuccess={() => setAuthenticated(true)} />;
}
