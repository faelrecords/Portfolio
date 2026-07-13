import rawContent from "./portfolio.json";

export type ProjectStatus = "Disponível" | "Em breve" | "Laboratório";

export interface PortfolioProject {
  id: string;
  title: string;
  summary: string;
  status: ProjectStatus;
  tags: string[];
  launchUrl: string | null;
  repositoryUrl: string | null;
  featured: boolean;
}

export interface PortfolioContent {
  brand: {
    name: string;
    wordmark: string;
    tagline: string;
    github: string;
    instagram: string;
  };
  navigation: Array<{ label: string; href: string }>;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
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
  projects: PortfolioProject[];
  manifesto: { eyebrow: string; quote: string };
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    instagramLabel: string;
    githubLabel: string;
  };
}

export const portfolioContent = rawContent as PortfolioContent;
