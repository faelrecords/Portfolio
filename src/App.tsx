import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Cpu,
  Instagram,
  Layers3,
  LockKeyhole,
  Menu,
  Orbit,
  Sparkles,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RenderQuality } from "./components/BlackHoleScene";
import { CosmicOverlay } from "./components/CosmicOverlay";
import { ExperienceControls } from "./components/ExperienceControls";
import { GalaxyField } from "./components/GalaxyField";
import { portfolioContent } from "./content/portfolio";

gsap.registerPlugin(ScrollTrigger);

const BlackHoleScene = lazy(async () => {
  const scene = await import("./components/BlackHoleScene");
  return { default: scene.BlackHoleScene };
});

const capabilityIcons: Record<string, LucideIcon> = {
  Sparkles,
  Cpu,
  Workflow,
  Layers3,
};

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function App() {
  const { brand, navigation, hero, about, capabilities, projects, manifesto, contact } = portfolioContent;
  const [quality, setQuality] = useState<RenderQuality>("auto");
  const [reducedMotion, setReducedMotion] = useState(() =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [webglAvailable] = useState(detectWebGL);
  const [videoState, setVideoState] = useState<"loading" | "ready" | "error">("loading");
  const heroVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = heroVideo.current;
    if (!video || videoState !== "ready") return;
    if (reducedMotion) {
      video.pause();
      return;
    }
    void video.play().catch(() => setVideoState("error"));
  }, [reducedMotion, videoState]);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      const revealItems = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      const projectItems = gsap.utils.toArray<HTMLElement>("[data-project]");

      if (reducedMotion) {
        gsap.set([...revealItems, ...projectItems], { clearProps: "all" });
        return;
      }

      gsap.fromTo(
        ".hero-copy > *",
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.11, ease: "power3.out", delay: 0.18 },
      );

      revealItems.forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, y: 44 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 86%", once: true },
          },
        );
      });

      projectItems.forEach((element) => {
        gsap.fromTo(
          element,
          { opacity: 0, x: 42 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          },
        );
      });
    });

    return () => context.revert();
  }, [reducedMotion]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <div className={`hero-video-shell is-${videoState}`} aria-hidden="true">
        <video
          ref={heroVideo}
          className="hero-video"
          autoPlay={!reducedMotion}
          muted
          loop
          playsInline
          preload="auto"
          poster="/og.png"
          onCanPlay={() => setVideoState("ready")}
          onError={() => setVideoState("error")}
        >
          <source src="/black-hole-hero.mp4" type="video/mp4" />
        </video>
      </div>
      {videoState === "error" && (
        <Suspense fallback={<div className="scene-loading" aria-hidden="true" />}>
          <BlackHoleScene quality={quality} reducedMotion={reducedMotion} webglAvailable={webglAvailable} />
        </Suspense>
      )}
      <div className="scene-shade" aria-hidden="true" />
      <CosmicOverlay quality={quality} reducedMotion={reducedMotion} />

      <header className="site-header">
        <a className="brand-lockup" href="#inicio" aria-label="Fael Records, início">
          <Orbit size={24} strokeWidth={1.5} />
          <span>
            <strong>{brand.name}</strong>
            <small>{brand.wordmark}</small>
          </span>
        </a>

        <nav className={mobileMenuOpen ? "site-nav is-open" : "site-nav"} aria-label="Navegação principal">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <ExperienceControls
            quality={quality}
            reducedMotion={reducedMotion}
            onQualityChange={setQuality}
            onReducedMotionChange={setReducedMotion}
          />
          <button
            className="icon-button menu-button"
            type="button"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((value) => !value)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main id="conteudo">
        <section className="hero-section" id="inicio" aria-labelledby="hero-title">
          <div className="content-frame hero-grid">
            <div className="hero-copy">
              <p className="eyebrow"><span className="signal-dot" />{hero.eyebrow}</p>
              <h1 id="hero-title">
                <span>Fael</span>
                <span className="accent-word">Records</span>
              </h1>
              <p className="hero-description">{hero.description}</p>
              <div className="hero-actions">
                <a className="button button-primary" href={hero.primaryAction.href}>
                  {hero.primaryAction.label}
                  <ArrowDown size={18} />
                </a>
                <a className="button button-secondary" href={hero.secondaryAction.href}>
                  {hero.secondaryAction.label}
                </a>
              </div>
            </div>

            <div className="hero-telemetry" aria-hidden="true">
              <span>FR / 001</span>
              <span>23° 31′ 12″ S</span>
              <span className="telemetry-status">ONLINE</span>
            </div>
          </div>
        </section>

        <section className="about-section section-band" id="sobre" aria-labelledby="about-title">
          <div className="content-frame">
            <div className="section-index" data-reveal>
              <span>01</span>
              <p>{about.eyebrow}</p>
            </div>
            <div className="about-grid">
              <h2 id="about-title" data-reveal>{about.title}</h2>
              <div className="about-copy" data-reveal>
                <p>{about.body}</p>
                <p className="about-statement">{about.statement}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="capabilities-section section-band" aria-label="Áreas de atuação">
          <div className="content-frame capabilities-grid">
            {capabilities.map((capability) => {
              const Icon = capabilityIcons[capability.icon];
              return (
                <article className="capability-item" key={capability.title} data-reveal>
                  <Icon size={25} strokeWidth={1.5} />
                  <h3>{capability.title}</h3>
                  <p>{capability.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="projects-section section-band" id="plataformas" aria-labelledby="projects-title">
          <GalaxyField quality={quality} reducedMotion={reducedMotion} />
          <div className="content-frame">
            <div className="section-index" data-reveal>
              <span>02</span>
              <p>Plataformas em órbita</p>
            </div>
            <div className="projects-heading" data-reveal>
              <h2 id="projects-title">Produtos digitais para explorar, usar e evoluir.</h2>
              <p>Uma seleção inicial do ecossistema. Os acessos serão liberados conforme cada plataforma entrar em órbita pública.</p>
            </div>

            <div className="projects-list">
              {projects.map((project, index) => (
                <article
                  className={project.featured ? "project-row is-featured" : "project-row"}
                  key={project.id}
                  data-project
                >
                  <div className="project-number">{String(index + 1).padStart(2, "0")}</div>
                  <div className="project-main">
                    <div className="project-title-line">
                      <h3>{project.title}</h3>
                      {project.featured && <span className="featured-label">Destaque</span>}
                    </div>
                    <p>{project.summary}</p>
                    <ul className="project-tags" aria-label={`Tecnologias de ${project.title}`}>
                      {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                    </ul>
                  </div>
                  <div className="project-actions">
                    <span className="project-status"><span />{project.status}</span>
                    {project.launchUrl ? (
                      <a className="project-link" href={project.launchUrl} target="_blank" rel="noreferrer">
                        Abrir plataforma <ArrowUpRight size={17} />
                      </a>
                    ) : (
                      <span className="project-link is-disabled" aria-label="Plataforma ainda não disponível">
                        <LockKeyhole size={16} /> Em breve
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="manifesto-section" aria-labelledby="manifesto-title">
          <div className="content-frame manifesto-content" data-reveal>
            <p className="eyebrow"><span className="signal-dot" />{manifesto.eyebrow}</p>
            <h2 id="manifesto-title">“{manifesto.quote}”</h2>
            <span className="manifesto-author">— {brand.name}</span>
          </div>
        </section>

        <section className="contact-section section-band" id="contato" aria-labelledby="contact-title">
          <div className="content-frame">
            <div className="section-index" data-reveal>
              <span>03</span>
              <p>{contact.eyebrow}</p>
            </div>
            <div className="contact-grid">
              <div data-reveal>
                <h2 id="contact-title">{contact.title}</h2>
                <p>{contact.body}</p>
              </div>
              <div className="social-links" data-reveal>
                <a href={brand.instagram} target="_blank" rel="noreferrer">
                  <Instagram size={22} />
                  <span>Instagram<small>{contact.instagramLabel}</small></span>
                  <ArrowUpRight size={20} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="content-frame footer-content">
          <p>© {new Date().getFullYear()} {brand.name}</p>
          <p>{brand.tagline}</p>
          <a href="#inicio" aria-label="Voltar ao início" title="Voltar ao início">
            <ArrowUpRight size={18} />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
