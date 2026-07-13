import rawContent from "./portfolio.json";

export type ProjectStatus = "Disponível" | "Em breve" | "Laboratório";

export interface PortfolioProject {
  id: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  tags: string[];
  launchUrl: string | null;
  featured: boolean;
}

export interface PortfolioContent {
  brand: {
    name: string;
    wordmark: string;
    tagline: string;
    instagram: string;
  };
  navigation: Array<{ label: string; href: string }>;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    details: string[];
    primaryAction: { label: string; href: string };
    secondaryAction: { label: string; href: string };
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    statement: string;
  };
  capabilities: Array<{
    icon: "Sparkles" | "Cpu" | "Workflow" | "Layers3";
    title: string;
    description: string;
  }>;
  process: {
    eyebrow: string;
    title: string;
    body: string;
    steps: Array<{ title: string; description: string }>;
  };
  projectsIntro: {
    eyebrow: string;
    title: string;
    body: string;
    metric: string;
  };
  projects: PortfolioProject[];
  manifesto: { eyebrow: string; quote: string };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    instagramLabel: string;
  };
}

export const portfolioContent = rawContent as PortfolioContent;
