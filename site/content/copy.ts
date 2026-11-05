import type { Bilingual, Locale } from "./profile";

export type SectionCopy = {
  id: string;
  num: string;
  name: string;
  note: string;
  folio: string;
};

export type Copy = {
  langSwitch: { label: string; href: string; aria: string };
  head: { file: string; descriptor: string; location: string };
  cover: {
    kicker: string;
    nameLines: string[];
    roleLead: string;
    roleRest: string;
    primary: string;
    primaryRef: string;
    secondary: string;
    secondaryRef: string;
    metaTitle: string;
    facts: { label: string; value: string }[];
    sealTop: string;
    sealStrong: string;
    sealBottom: string;
    foot: { site: string; revision: string; folio: string };
  };
  sections: SectionCopy[];
  projects: {
    statusLive: string;
    statusWip: string;
    exhibit: string;
    demo: string;
    repo: string;
    pending: string;
  };
  statement: {
    credentialTitle: string;
    education: string;
    certifications: string;
    languages: string;
  };
  notice: {
    lead: string;
    note: string;
    links: { label: string; value: string; href: string }[];
  };
  foot: { cookies: string; revision: string; top: string };
  a11y: { skip: string; index: string; main: string };
};

const es: Copy = {
  langSwitch: { label: "EN", href: "/en/", aria: "Ver el sitio en inglés" },
  head: {
    file: "Expediente AB—2026—001",
    descriptor: "Portfolio · Full Stack Developer",
    location: "Argentina · Remoto AR / ES / UE",
  },
  cover: {
    kicker: "Carátula",
    nameLines: ["Agustin", "Bertero"],
    roleLead: "Full Stack Developer.",
    roleRest:
      "PHP/Laravel · React · TypeScript · Linux & Cloud. Cuatro años llevando productos del código a producción, y los servidores donde corren.",
    primary: "Ver anexos",
    primaryRef: "01",
    secondary: "Descargar CV",
    secondaryRef: "PDF",
    metaTitle: "Datos del expediente",
    facts: [
      { label: "Perfil", value: "Full Stack Developer" },
      { label: "Stack", value: "Laravel · React · TypeScript" },
      { label: "Infra", value: "Linux · Docker · AWS · Cloudflare" },
      { label: "Diferencial", value: "Abogado · Cibercrimen y evidencia digital" },
      { label: "Estado", value: "Disponible para trabajo remoto" },
    ],
    sealTop: "Disponible",
    sealStrong: "Remoto",
    sealBottom: "2026",
    foot: {
      site: "portfolio.bertium.net",
      revision: "Documento 1 de 1 · Revisión 2026.11",
      folio: "Folio 01",
    },
  },
  sections: [
    {
      id: "anexos",
      num: "01",
      name: "Anexos",
      note: "Proyectos, con su estado real: lo que está en producción y lo que todavía se está construyendo.",
      folio: "02",
    },
    {
      id: "antecedentes",
      num: "02",
      name: "Antecedentes",
      note: "Dónde trabajé, qué rol tuve y qué cambió con mi trabajo.",
      folio: "03",
    },
    {
      id: "pericias",
      num: "03",
      name: "Pericias técnicas",
      note: "Las herramientas que uso y el criterio con el que las elijo.",
      folio: "04",
    },
    {
      id: "declaracion",
      num: "04",
      name: "Declaración",
      note: "Quién firma este expediente, y por qué un abogado terminó escribiendo software.",
      folio: "05",
    },
    {
      id: "notificacion",
      num: "05",
      name: "Notificación",
      note: "Contacto directo. Sin formularios ni intermediarios.",
      folio: "06",
    },
  ],
  projects: {
    statusLive: "En producción",
    statusWip: "En desarrollo",
    exhibit: "Anexo",
    demo: "Ver demo",
    repo: "Código",
    pending: "Código próximamente",
  },
  statement: {
    credentialTitle: "Credenciales",
    education: "Formación",
    certifications: "Certificaciones",
    languages: "Idiomas",
  },
  notice: {
    lead: "Escribime y te respondo con un diagnóstico concreto, no con un PDF de presentación.",
    note: "Abierto a puestos full stack (Laravel + React) y a roles de plataforma o DevOps. Trabajo remoto desde Argentina, con ciudadanía italiana.",
    links: [],
  },
  foot: {
    cookies: "Sin cookies. Sin scripts de terceros.",
    revision: "Revisión 2026.11",
    top: "Volver arriba",
  },
  a11y: {
    skip: "Saltar al contenido",
    index: "Índice del expediente",
    main: "Contenido principal",
  },
};

const en: Copy = {
  langSwitch: { label: "ES", href: "/", aria: "View this site in Spanish" },
  head: {
    file: "File AB—2026—001",
    descriptor: "Portfolio · Full Stack Developer",
    location: "Argentina · Remote AR / ES / EU",
  },
  cover: {
    kicker: "Cover sheet",
    nameLines: ["Agustin", "Bertero"],
    roleLead: "Full Stack Developer.",
    roleRest:
      "PHP/Laravel · React · TypeScript · Linux & Cloud. Four years taking products from code to production, and the servers they run on.",
    primary: "View exhibits",
    primaryRef: "01",
    secondary: "Download CV",
    secondaryRef: "PDF",
    metaTitle: "File data",
    facts: [
      { label: "Profile", value: "Full Stack Developer" },
      { label: "Stack", value: "Laravel · React · TypeScript" },
      { label: "Infra", value: "Linux · Docker · AWS · Cloudflare" },
      { label: "Differential", value: "Lawyer · Cybercrime and digital evidence" },
      { label: "Status", value: "Open to remote work" },
    ],
    sealTop: "Available",
    sealStrong: "Remote",
    sealBottom: "2026",
    foot: {
      site: "portfolio.bertium.net",
      revision: "Document 1 of 1 · Revision 2026.11",
      folio: "Folio 01",
    },
  },
  sections: [
    {
      id: "anexos",
      num: "01",
      name: "Exhibits",
      note: "Projects with their real status: what is live and what is still being built.",
      folio: "02",
    },
    {
      id: "antecedentes",
      num: "02",
      name: "Record",
      note: "Where I worked, what my role was and what changed because of it.",
      folio: "03",
    },
    {
      id: "pericias",
      num: "03",
      name: "Technical findings",
      note: "The tools I use and the judgement behind choosing them.",
      folio: "04",
    },
    {
      id: "declaracion",
      num: "04",
      name: "Statement",
      note: "Who signs this file, and why a lawyer ended up writing software.",
      folio: "05",
    },
    {
      id: "notificacion",
      num: "05",
      name: "Notice",
      note: "Direct contact. No forms, no middlemen.",
      folio: "06",
    },
  ],
  projects: {
    statusLive: "Live",
    statusWip: "In progress",
    exhibit: "Exhibit",
    demo: "View demo",
    repo: "Code",
    pending: "Code coming soon",
  },
  statement: {
    credentialTitle: "Credentials",
    education: "Education",
    certifications: "Certifications",
    languages: "Languages",
  },
  notice: {
    lead: "Write to me and you get a concrete diagnosis, not a slide deck.",
    note: "Open to full stack roles (Laravel + React) and to platform or DevOps work. Remote from Argentina, with Italian citizenship.",
    links: [],
  },
  foot: {
    cookies: "No cookies. No third-party scripts.",
    revision: "Revision 2026.11",
    top: "Back to top",
  },
  a11y: {
    skip: "Skip to content",
    index: "File index",
    main: "Main content",
  },
};

export const copy: Record<Locale, Copy> = { es, en };

export function t(value: Bilingual, locale: Locale): string {
  return value[locale];
}
