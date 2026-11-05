export type Locale = "es" | "en";

export type Bilingual = Record<Locale, string>;

export type ExperienceEntry = {
  company: string;
  place: Bilingual;
  period: Bilingual;
  role: Bilingual;
  mode: Bilingual;
  bullets: Record<Locale, string[]>;
};

export const profile = {
  name: "Agustin Bertero",
  email: "agustinbertero.dev@gmail.com",
  linkedin: "https://linkedin.com/in/agustinbertero",
  github: "https://github.com/AgustinBertero",
  site: "agustinbertero.dev.ar",
  fileNumber: "AB—2026—001",

  role: {
    es: "Full Stack Developer",
    en: "Full Stack Developer",
  },
  location: {
    es: "Argentina · Remoto AR / ES / UE",
    en: "Argentina · Remote AR / ES / EU",
  },
  availability: {
    es: "Disponible para trabajo remoto",
    en: "Open to remote work",
  },
  nationality: {
    es: "Argentina e italiana (ciudadanía UE)",
    en: "Argentine and Italian (EU citizenship)",
  },

  summary: {
    es: "Full Stack Developer con más de cuatro años de experiencia en desarrollo web, especializado en PHP/Laravel, React y TypeScript, y con experiencia real en administración de infraestructura Linux y cloud. Desarrollo APIs REST y GraphQL, e-commerce a medida y plataformas SaaS sobre MySQL y PostgreSQL, y acompaño los proyectos desde el código hasta el despliegue y el mantenimiento en producción.",
    en: "Full Stack Developer with over four years of experience in web development, focused on PHP/Laravel, React and TypeScript, with hands-on experience running Linux and cloud infrastructure. I build REST and GraphQL APIs, custom e-commerce and SaaS platforms on MySQL and PostgreSQL, and stay with a project from the first line of code to deployment and production maintenance.",
  },
  differential: {
    es: "Abogado con diplomatura en Cibercrimen y Evidencia Digital. Ese recorrido se traduce en criterio de seguridad, privacidad y protección de datos en cada decisión técnica.",
    en: "Lawyer with a postgraduate degree in Cybercrime and Digital Evidence. That background shows up as judgement on security, privacy and data protection in every technical decision.",
  },

  experience: [
    {
      company: "Sysprovider S.L.",
      place: { es: "Logroño, España", en: "Logroño, Spain" },
      period: { es: "12/2023 — actualidad", en: "12/2023 — present" },
      role: {
        es: "Responsable del Departamento de Soporte",
        en: "Head of Support",
      },
      mode: { es: "Remoto · jornada completa", en: "Remote · full time" },
      bullets: {
        es: [
          "Coordino un equipo de cinco técnicos de soporte L2/L3 con metodologías ágiles.",
          "Reestructuré los flujos del departamento: 30 % menos en tiempos de respuesta y resolución de incidencias críticas.",
          "Administro servidores Linux dedicados y VPS (Ubuntu, Debian) y recursos en AWS: EC2, S3 para backups y VPC para aislar redes.",
          "Optimización de rendimiento de aplicaciones y servidores de clientes, con mejoras de hasta un 50 % en tiempos de carga.",
          "Publicación segura de servicios con Cloudflare (Zero Trust, Tunnels) y Nginx como proxy inverso.",
          "Auditorías de acceso a servidores y políticas de conservación de logs alineadas con GDPR/LOPD.",
        ],
        en: [
          "I lead a team of five L2/L3 support technicians working with agile methods.",
          "I rebuilt the department's workflows: 30% faster response and resolution of critical incidents.",
          "I run dedicated Linux servers and VPSs (Ubuntu, Debian) plus AWS resources: EC2, S3 for backups and VPC for network isolation.",
          "Performance work on client applications and servers, with load-time improvements of up to 50%.",
          "Secure service publishing with Cloudflare (Zero Trust, Tunnels) and Nginx as a reverse proxy.",
          "Server access audits and log retention policies aligned with GDPR/LOPD.",
        ],
      },
    },
    {
      company: "Sysprovider S.L.",
      place: { es: "Logroño, España", en: "Logroño, Spain" },
      period: { es: "02/2023 — 11/2023", en: "02/2023 — 11/2023" },
      role: { es: "Desarrollador Web", en: "Web Developer" },
      mode: { es: "Híbrido", en: "Hybrid" },
      bullets: {
        es: [
          "Desarrollo y mantenimiento de sitios web y tiendas online de clientes.",
          "Resolución de incidencias técnicas en servidores y aplicaciones.",
        ],
        en: [
          "Built and maintained client websites and online stores.",
          "Resolved technical incidents across servers and applications.",
        ],
      },
    },
    {
      company: "Neuraweb",
      place: { es: "Logroño, España", en: "Logroño, Spain" },
      period: { es: "02/2023 — actualidad", en: "02/2023 — present" },
      role: { es: "Full Stack Developer", en: "Full Stack Developer" },
      mode: { es: "Remoto · agencia", en: "Remote · agency" },
      bullets: {
        es: [
          "Aplicaciones web, e-commerce a medida y plataformas SaaS con PHP/Laravel y React.",
          "Diseño e integración de APIs REST y GraphQL; pasarelas de pago, servicios de envío y analítica.",
          "Contenerización con Docker y Docker Compose y estandarización de despliegues: 40 % menos en tiempos de deploy.",
          "Implementación y mantenimiento de Odoo (ERP); diseño y optimización de bases de datos MySQL y PostgreSQL.",
          "Refactorización de código heredado y asesoramiento técnico a clientes B2B.",
        ],
        en: [
          "Web applications, custom e-commerce and SaaS platforms with PHP/Laravel and React.",
          "REST and GraphQL API design and integration; payment gateways, shipping services and analytics.",
          "Containerisation with Docker and Docker Compose and standardised deployments: 40% less deploy time.",
          "Odoo (ERP) implementation and maintenance; MySQL and PostgreSQL schema design and tuning.",
          "Legacy code refactoring and technical consulting for B2B clients.",
        ],
      },
    },
    {
      company: "Freelance",
      place: { es: "Argentina", en: "Argentina" },
      period: { es: "08/2022 — actualidad", en: "08/2022 — present" },
      role: { es: "Full Stack Developer", en: "Full Stack Developer" },
      mode: { es: "Independiente", en: "Independent" },
      bullets: {
        es: [
          "Plataformas web y MVPs desde cero, del diseño técnico al despliegue en producción.",
          "Optimización de consultas lentas y estabilización de despliegues en proyectos existentes.",
        ],
        en: [
          "Web platforms and MVPs from scratch, from technical design to production deployment.",
          "Slow-query optimisation and deployment stabilisation on existing projects.",
        ],
      },
    },
    {
      company: "Ejercicio independiente",
      place: { es: "Argentina", en: "Argentina" },
      period: { es: "05/2020 — 08/2022", en: "05/2020 — 08/2022" },
      role: { es: "Abogado", en: "Lawyer" },
      mode: { es: "Matriculado", en: "Licensed" },
      bullets: {
        es: [
          "Asesoramiento legal en materia civil, comercial y laboral.",
          "Redacción y análisis de contratos comerciales, acuerdos de confidencialidad y términos de servicio.",
        ],
        en: [
          "Legal advice in civil, commercial and labour matters.",
          "Drafting and review of commercial contracts, NDAs and terms of service.",
        ],
      },
    },
  ] satisfies ExperienceEntry[],

  stack: [
    {
      label: { es: "Backend", en: "Backend" },
      items: "PHP 8, Laravel, Node.js, REST, GraphQL",
    },
    {
      label: { es: "Frontend", en: "Frontend" },
      items: "React, TypeScript, JavaScript, Next.js, Tailwind CSS",
    },
    {
      label: { es: "Bases de datos", en: "Data" },
      items: "MySQL, PostgreSQL",
    },
    {
      label: { es: "Infraestructura", en: "Infrastructure" },
      items: "Linux (Ubuntu, Debian), Docker, Docker Compose, Nginx, CI/CD, Git, Portainer",
    },
    {
      label: { es: "Cloud y redes", en: "Cloud and networking" },
      items: "AWS (EC2, S3, VPC), Cloudflare (Zero Trust, Tunnels), DNS, SSL/TLS",
    },
    {
      label: { es: "CMS y ERP", en: "CMS and ERP" },
      items: "Odoo, WordPress, PrestaShop, Magento, Drupal",
    },
    {
      label: { es: "Paneles", en: "Control panels" },
      items: "HestiaCP, Plesk, cPanel, DirectAdmin",
    },
    {
      label: { es: "Seguridad", en: "Security" },
      items: "GDPR, LOPD, Ley 25.326, auditoría de accesos, protección de datos",
    },
    {
      label: { es: "Complementarios", en: "Working knowledge" },
      items: "Terraform, Ansible, Python, MongoDB (nivel básico)",
    },
  ],

  education: [
    {
      title: {
        es: "Técnico Superior en Desarrollo de Aplicaciones Web (DAW)",
        en: "Higher Technician in Web Application Development (DAW)",
      },
      org: { es: "FPD Rioja · título oficial de España", en: "FPD Rioja · official Spanish degree" },
      period: "2024 — 2025",
    },
    {
      title: {
        es: "Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)",
        en: "Higher Technician in Multiplatform Application Development (DAM)",
      },
      org: { es: "FPD Rioja · título oficial de España", en: "FPD Rioja · official Spanish degree" },
      period: "2025 — 2026",
    },
    {
      title: { es: "Abogado y Escribano", en: "Law and Notarial Studies" },
      org: {
        es: "Universidad Católica de Santiago del Estero · promedio 8,12",
        en: "Universidad Católica de Santiago del Estero · GPA 8.12",
      },
      period: "2015 — 2020",
    },
    {
      title: {
        es: "Diplomatura en Cibercrimen y Evidencia Digital",
        en: "Postgraduate degree in Cybercrime and Digital Evidence",
      },
      org: { es: "Universidad Champagnat, Mendoza", en: "Universidad Champagnat, Mendoza" },
      period: "2021",
    },
  ],

  certifications: [
    {
      title: {
        es: "Técnico en Seguridad Informática (Análisis de Riesgos)",
        en: "IT Security Technician (Risk Analysis)",
      },
      org: "Fundación Carlos Slim",
      period: "08/2024",
    },
    {
      title: { es: "Linux Essentials", en: "Linux Essentials" },
      org: "Cisco Networking Academy (NDG)",
      period: "07/2024",
    },
  ],

  languages: [
    { label: { es: "Español", en: "Spanish" }, level: { es: "Nativo", en: "Native" } },
    { label: { es: "Italiano", en: "Italian" }, level: { es: "Intermedio", en: "Intermediate" } },
    { label: { es: "Inglés", en: "English" }, level: { es: "Intermedio", en: "Intermediate" } },
  ],
};

export type Profile = typeof profile;
