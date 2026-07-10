import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, LockKeyhole, Menu, X } from 'lucide-react';
import { Brand } from '../components/Brand';
import { Icon } from '../components/Icon';
import { InstagramIcon } from '../components/InstagramIcon';
import { loadPublishedSite } from '../lib/content';

function SmartLink({ href, children, className = '', ariaLabel, onClick }) {
  const disabled = !href || href === '#';
  const external = /^https?:\/\//.test(href || '');
  if (disabled) {
    return <span className={`${className} is-disabled`} aria-disabled="true">{children}</span>;
  }
  return (
    <a
      className={className}
      href={href}
      aria-label={ariaLabel}
      onClick={onClick}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      {children}
    </a>
  );
}

function Header({ site }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header liquid-glass-strong">
      <Brand brand={site.brand} compact />
      <nav className={`site-nav ${open ? 'is-open' : ''}`} aria-label="Navegação principal">
        {site.navigation.map((item) => (
          <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>
        ))}
      </nav>
      <div className="header-actions">
        <SmartLink className="admin-link" href="/adm/" ariaLabel="Abrir área administrativa">
          <LockKeyhole size={16} />
          <span>Área Admin</span>
        </SmartLink>
        <button className="menu-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? 'Fechar menu' : 'Abrir menu'}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}

function Hero({ site }) {
  const { hero, brand } = site;
  return (
    <section id="inicio" className="hero-shell" aria-labelledby="hero-title">
      <div className="hero-background" aria-hidden="true">
        <div className="hero-background__mesh" />
        <div className="hero-background__orb hero-background__orb--one" />
        <div className="hero-background__orb hero-background__orb--two" />
      </div>
      <div className="hero-layout">
        <div className="hero-main liquid-glass-strong">
          <Header site={site} />
          <div className="hero-copy">
            <div className="hero-mark" aria-hidden="true"><img src={brand.logo || '/assets/mark.svg'} alt="" /></div>
            <p className="eyebrow eyebrow--pill"><span />{hero.eyebrow}</p>
            <h1 id="hero-title" className="hero-title">
              <span>{hero.title}</span><em>{hero.titleAccent}</em>
            </h1>
            <p className="hero-description">{hero.description}</p>
            <SmartLink className="primary-cta liquid-glass-strong" href={hero.primaryAction.href}>
              <span>{hero.primaryAction.label}</span>
              <span className="icon-circle"><ArrowRight size={18} /></span>
            </SmartLink>
            <div className="hero-pills" aria-label="Categorias principais">
              {hero.pills.map((pill, index) => (
                <span className="hero-pill liquid-glass" key={pill}>
                  <Icon name={['Bot', 'LayoutGrid', 'Workflow', 'BadgeCheck'][index] || 'Sparkles'} size={16} />
                  {pill}
                </span>
              ))}
            </div>
          </div>
          <div className="hero-bottom">
            <div>
              <span className="micro-label">{hero.quoteLabel}</span>
              <p className="hero-quote">“{hero.quote}”</p>
            </div>
            <div className="hero-author"><span />{hero.quoteAuthor}<span /></div>
          </div>
          <a className="scroll-cue" href="#proposito" aria-label="Rolar para o propósito">
            <ArrowDown size={17} />
            <span>Explorar</span>
          </a>
        </div>

        <aside className="hero-side liquid-glass-strong" aria-label="Destaques do ecossistema">
          <div className="hero-side__top">
            <span className="micro-label">Conecte-se</span>
            <div className="social-actions">
              <SmartLink className="icon-button liquid-glass" href={brand.instagram} ariaLabel="Instagram Fael Records"><InstagramIcon size={18} /></SmartLink>
              <SmartLink className="icon-button liquid-glass" href={brand.instagram} ariaLabel="Abrir perfil"><ArrowRight size={18} /></SmartLink>
            </div>
          </div>

          <article className="ecosystem-card liquid-glass">
            <div className="ecosystem-orbit" aria-hidden="true"><Icon name="Orbit" size={35} /></div>
            <div>
              <span className="micro-label">Ecossistema</span>
              <h2>{hero.sideIntro.title}</h2>
              <p>{hero.sideIntro.body}</p>
              <a href="#proposito">Entender o propósito <ArrowRight size={15} /></a>
            </div>
          </article>

          <div className="side-divider"><span>Destaques</span></div>
          <div className="highlight-grid">
            {hero.highlights.map((item) => (
              <a className="highlight-card liquid-glass" key={item.label} href={item.href}>
                <span className="highlight-icon"><Icon name={item.icon} /></span>
                <strong>{item.label}</strong>
                <p>{item.text}</p>
                <ArrowRight className="highlight-arrow" size={17} />
              </a>
            ))}
          </div>

          <blockquote className="side-quote liquid-glass">
            <span className="quote-mark">“</span>
            <p>{hero.quote}</p>
            <cite>— {hero.quoteAuthor}</cite>
          </blockquote>
        </aside>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <div className={`section-heading section-heading--${align}`} data-reveal>
      <p className="eyebrow"><span />{eyebrow}</p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}

function PurposeSection({ section }) {
  const { props } = section;
  return (
    <section id={section.id} className="page-section purpose-section">
      <div className="container purpose-layout">
        <div className="purpose-copy">
          <SectionHeading eyebrow={props.eyebrow} title={props.title} />
          <p className="purpose-body" data-reveal>{props.body}</p>
          <div className="purpose-cards">
            {props.cards.map((card) => (
              <article className="purpose-card liquid-glass" key={card.title} data-reveal>
                <span><Icon name={card.icon} /></span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="purpose-visual liquid-glass-strong" data-reveal aria-hidden="true">
          <div className="purpose-visual__grid" />
          <div className="purpose-orbit purpose-orbit--outer" />
          <div className="purpose-orbit purpose-orbit--middle" />
          <div className="purpose-orbit purpose-orbit--inner" />
          <div className="purpose-core"><img src="/assets/mark.svg" alt="" /></div>
          <div className="purpose-node purpose-node--one">AI</div>
          <div className="purpose-node purpose-node--two">UI</div>
          <div className="purpose-node purpose-node--three">DEV</div>
        </div>
      </div>
      <div className="container metrics-row" data-reveal>
        {props.metrics.map((metric) => (
          <div className="metric" key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>
        ))}
      </div>
    </section>
  );
}

function ResourceCard({ item, variant }) {
  const hrefDisabled = !item.href || item.href === '#';
  return (
    <article className={`resource-card resource-card--${variant} liquid-glass ${item.featured ? 'is-featured' : ''}`} data-reveal>
      <div className="resource-card__visual">
        {item.image ? <img src={item.image} alt="" loading="lazy" /> : (
          <div className="resource-card__generated" aria-hidden="true">
            <span className="resource-card__halo" />
            <Icon name={item.icon} size={38} />
          </div>
        )}
        <span className="resource-status">{item.status}</span>
      </div>
      <div className="resource-card__content">
        <div className="resource-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <SmartLink className="resource-link" href={item.href}>
          <span>{hrefDisabled ? 'Em breve' : variant === 'utility' ? 'Baixar recurso' : 'Acessar'}</span>
          <ArrowRight size={17} />
        </SmartLink>
      </div>
    </article>
  );
}

function CollectionSection({ section }) {
  const { props } = section;
  const [filter, setFilter] = useState(props.filters?.[0] || 'Todos');
  const items = useMemo(() => {
    if (filter === 'Todos') return props.items;
    return props.items.filter((item) => item.tags.includes(filter));
  }, [filter, props.items]);
  return (
    <section id={section.id} className={`page-section collection-section collection-section--${props.variant}`}>
      <div className="container">
        <div className="collection-header">
          <SectionHeading eyebrow={props.eyebrow} title={props.title} description={props.description} />
          <div className="filter-list" data-reveal role="group" aria-label={`Filtrar ${props.eyebrow}`}>
            {props.filters.map((item) => (
              <button key={item} type="button" className={filter === item ? 'is-active' : ''} onClick={() => setFilter(item)}>{item}</button>
            ))}
          </div>
        </div>
        <div className="resource-grid">
          {items.map((item) => <ResourceCard key={item.id} item={item} variant={props.variant} />)}
        </div>
      </div>
    </section>
  );
}

function QuoteSection({ section }) {
  return (
    <section id={section.id} className="page-section quote-section">
      <div className="container quote-panel liquid-glass-strong" data-reveal>
        <p className="eyebrow"><span />{section.props.eyebrow}</p>
        <blockquote>“{section.props.quote}”</blockquote>
        <cite>— {section.props.author}</cite>
      </div>
    </section>
  );
}

function FaqSection({ section }) {
  const [open, setOpen] = useState(0);
  const { props } = section;
  return (
    <section id={section.id} className="page-section faq-section">
      <div className="container faq-layout">
        <SectionHeading eyebrow={props.eyebrow} title={props.title} description={props.description} />
        <div className="faq-list" data-reveal>
          {props.items.map((item, index) => {
            const expanded = open === index;
            return (
              <article className={`faq-item liquid-glass ${expanded ? 'is-open' : ''}`} key={item.question}>
                <button type="button" onClick={() => setOpen(expanded ? -1 : index)} aria-expanded={expanded}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong>{item.question}</strong>
                  <span className="faq-plus">{expanded ? '−' : '+'}</span>
                </button>
                <div className="faq-answer" hidden={!expanded}><p>{item.answer}</p></div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ section }) {
  const { props } = section;
  return (
    <section id={section.id} className="page-section cta-section">
      <div className="container cta-panel liquid-glass-strong" data-reveal>
        <div>
          <p className="eyebrow"><span />{props.eyebrow}</p>
          <h2>{props.title}</h2>
          <p>{props.body}</p>
        </div>
        <SmartLink className="primary-cta" href={props.action.href}>
          <span>{props.action.label}</span><span className="icon-circle"><ArrowRight size={18} /></span>
        </SmartLink>
      </div>
    </section>
  );
}

function TextMediaSection({ section }) {
  const { props } = section;
  return (
    <section id={section.id} className="page-section text-media-section">
      <div className={`container text-media ${props.reverse ? 'is-reverse' : ''}`}>
        <div data-reveal>
          <SectionHeading eyebrow={props.eyebrow} title={props.title} description={props.body} />
          {props.action?.label && <SmartLink className="text-link" href={props.action.href}>{props.action.label}<ArrowRight size={16} /></SmartLink>}
        </div>
        <div className="text-media__visual liquid-glass" data-reveal>
          {props.image ? <img src={props.image} alt={props.imageAlt || ''} /> : <Icon name="Image" size={54} />}
        </div>
      </div>
    </section>
  );
}

function SectionRenderer({ section }) {
  if (!section.visible) return null;
  const components = {
    purpose: PurposeSection,
    collection: CollectionSection,
    quote: QuoteSection,
    faq: FaqSection,
    cta: CtaSection,
    textMedia: TextMediaSection,
  };
  const Component = components[section.type];
  return Component ? <Component section={section} /> : null;
}

function Footer({ site }) {
  return (
    <footer className="site-footer">
      <div className="container footer-panel liquid-glass">
        <Brand brand={site.brand} />
        <p>{site.footer.statement}</p>
        <nav aria-label="Links do rodapé">
          {site.footer.links.map((link) => <SmartLink key={link.label} href={link.href}>{link.label}</SmartLink>)}
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {site.footer.copyright}</span>
        <span>Construído com React · Vibecodex</span>
      </div>
    </footer>
  );
}

export function PublicSite({ initialSite = null, preview = false }) {
  const [loadedSite, setLoadedSite] = useState(null);
  const site = initialSite || loadedSite;

  useEffect(() => {
    if (!initialSite) loadPublishedSite().then(setLoadedSite);
  }, [initialSite]);

  useEffect(() => {
    if (!site || preview) return undefined;
    document.title = site.meta?.title || 'Fael Records — Vibecodex';
    const description = document.querySelector('meta[name="description"]');
    if (description && site.meta?.description) description.setAttribute('content', site.meta.description);
    const openGraphTitle = document.querySelector('meta[property="og:title"]');
    if (openGraphTitle && site.meta?.title) openGraphTitle.setAttribute('content', site.meta.title);
    const openGraphDescription = document.querySelector('meta[property="og:description"]');
    if (openGraphDescription && site.meta?.description) openGraphDescription.setAttribute('content', site.meta.description);
    return undefined;
  }, [site, preview]);

  useEffect(() => {
    if (!site || preview) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px' });
    document.querySelectorAll('[data-reveal]').forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [site, preview]);

  if (!site) {
    return <div className="site-loading"><img src="/assets/mark.svg" alt="" /><span>Carregando ecossistema</span></div>;
  }

  return (
    <div className={`public-site ${preview ? 'is-preview' : ''}`}>
      {!preview && <Hero site={site} />}
      <main id="conteudo">
        {preview && <Hero site={site} />}
        {site.sections.map((section) => <SectionRenderer section={section} key={section.id} />)}
      </main>
      <Footer site={site} />
    </div>
  );
}

export default function PublicApp() {
  return <PublicSite />;
}
