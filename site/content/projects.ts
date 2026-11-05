import type { Bilingual, Locale } from "./profile";

export type ProjectStatus = "live" | "wip";

export type Project = {
  slug: string;
  num: string;
  status: ProjectStatus;
  title: Bilingual;
  summary: Bilingual;
  rows: { label: Bilingual; value: Bilingual }[];
  demo?: string;
  repo?: string;
};

export const projects: Project[] = [
  {
    slug: "helpdesk",
    num: "01",
    status: "wip",
    title: {
      es: "Helpdesk con triage por IA",
      en: "Helpdesk with AI triage",
    },
    summary: {
      es: "Sistema de tickets donde un modelo clasifica categoría y prioridad, resume hilos largos y sugiere respuestas a partir de una base de conocimiento. Nace de un problema real del soporte: decidir qué atender primero y qué contestar sin leer cien mensajes.",
      en: "A ticket system where a model classifies category and priority, summarises long threads and drafts replies from a knowledge base. It comes from a real support problem: deciding what to handle first and what to answer without reading a hundred messages.",
    },
    rows: [
      {
        label: { es: "Stack", en: "Stack" },
        value: { es: "Laravel · React · TypeScript · LLM", en: "Laravel · React · TypeScript · LLM" },
      },
      {
        label: { es: "Datos", en: "Data" },
        value: { es: "MySQL · cola de trabajos · RAG", en: "MySQL · job queue · RAG" },
      },
      {
        label: { es: "Infra", en: "Infra" },
        value: { es: "Docker · Nginx · Cloudflare Tunnel", en: "Docker · Nginx · Cloudflare Tunnel" },
      },
      {
        label: { es: "Demo", en: "Demo" },
        value: { es: "Próximamente", en: "Coming soon" },
      },
    ],
  },
  {
    slug: "site",
    num: "02",
    status: "live",
    title: {
      es: "Este sitio",
      en: "This site",
    },
    summary: {
      es: "El portfolio que estás leyendo: bilingüe, exportado como estático y servido desde un mini PC con Docker y Cloudflare Tunnel. Sin cookies, sin scripts de terceros y con las fuentes servidas desde el propio dominio.",
      en: "The portfolio you are reading: bilingual, exported as static HTML and served from a small home server with Docker and Cloudflare Tunnel. No cookies, no third-party scripts, fonts served from the same domain.",
    },
    rows: [
      {
        label: { es: "Stack", en: "Stack" },
        value: { es: "Next.js · TypeScript · Tailwind CSS", en: "Next.js · TypeScript · Tailwind CSS" },
      },
      {
        label: { es: "Build", en: "Build" },
        value: { es: "Export estático · Nginx sin privilegios", en: "Static export · unprivileged Nginx" },
      },
      {
        label: { es: "Infra", en: "Infra" },
        value: { es: "Docker · Cloudflare Tunnel · GitHub Actions", en: "Docker · Cloudflare Tunnel · GitHub Actions" },
      },
      {
        label: { es: "Demo", en: "Demo" },
        value: { es: "Estás en ella", en: "You are on it" },
      },
    ],
    demo: "/",
    repo: "https://github.com/AgustinBertero/agustinbertero.dev.ar",
  },
];

export const projectText = {
  status: {
    live: { es: "En producción", en: "Live" },
    wip: { es: "En desarrollo", en: "In progress" },
  } satisfies Record<ProjectStatus, Bilingual>,
  exhibit: { es: "Anexo", en: "Exhibit" },
  demo: { es: "Ver demo", en: "View demo" },
  repo: { es: "Código", en: "Code" },
  pending: { es: "Código próximamente", en: "Code coming soon" },
  stamp: {
    live: { es: "En producción", en: "Live" },
    wip: { es: "En desarrollo", en: "In progress" },
  } satisfies Record<ProjectStatus, Bilingual>,
};

export function projectLabel(value: Bilingual, locale: Locale): string {
  return value[locale];
}
