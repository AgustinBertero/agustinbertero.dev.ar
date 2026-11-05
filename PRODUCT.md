# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js + TypeScript + Tailwind, `output: 'export'` y `trailingSlash: true`, servido como estático por nginx-unprivileged. Decidido por el `AGENTS.md` del repo y confirmado por el usuario.

## Users

Reclutadores técnicos y hiring managers de España y Europa que evalúan perfiles full stack (Laravel + React) y de plataforma/DevOps, en procesos remotos. Llegan desde LinkedIn, GitHub o una postulación, en su mayoría desde el móvil, y deciden en menos de dos minutos si vale la pena abrir el CV. Secundario: pares y clientes freelance que buscan referencia de trabajo previo.

## Product Purpose

Landing personal de Agustin Bertero que responde tres preguntas sin fricción: qué construye, con qué stack y si hay pruebas reales de ello. El éxito es que el visitante abra un proyecto o descargue el CV. No es un blog ni un CMS: es una tarjeta de presentación que enlaza a demos funcionando.

## Positioning

Full stack con experiencia operativa real: administra los servidores donde corre lo que desarrolla. A eso se suma una formación de abogado con diplomatura en Cibercrimen y Evidencia Digital, que se traduce en criterio de seguridad, privacidad y GDPR. La combinación desarrollo + infraestructura + criterio legal es difícil de copiar desde un perfil de bootcamp.

## Operating Context

- Se publica en `portfolio.bertium.net` desde un mini PC propio con Docker y Cloudflare Tunnel. `agustinbertero.dev.ar` redirige al dominio anterior (dev.ar no permite un CNAME entre cuentas Cloudflare). La landing vive en `/`; cada proyecto en `/<slug>/`.
- El repo es público y `main` llega a producción sola cada 5 minutos.
- El contenido sale de `RECURSOS/portfolio-opencode/site/content/profile.md`; ese archivo es la única fuente de datos del perfil.
- Los proyectos arrancan en estado `planned`, pasan a `wip` (visible como "en desarrollo") y solo llegan a `live` con demo funcionando, README completo y revisión de privacidad si aplica.
- Sin cookies, sin scripts de terceros, sin formulario de contacto: solo `mailto:` y LinkedIn.

## Capabilities and Constraints

- Bilingüe español/inglés con rutas `/` y `/en/`, metadatos y Open Graph por idioma.
- Secciones: hero, proyectos, experiencia, stack, sobre mí y contacto.
- Las tarjetas de proyecto salen de `site/content/projects.ts`; la landing no duplica datos del perfil.
- CV descargable solo en versión pública, sin teléfono.
- Fuentes self-hosted. Nada de Google Fonts ni analítica de terceros.
- Objetivos: WCAG 2.2 AA, Lighthouse ≥ 95 en las cuatro categorías y contenido legible sin JavaScript.
- Nada inventado: ni métricas, ni clientes, ni testimonios. Las cifras se publican tal como están en `profile.md`.
- Nivel de inglés: se publica como "intermedio" (decisión del usuario; CV y LinkedIn quedan pendientes de unificar).
- No se publica el teléfono.
- Proyecto inicial visible: helpdesk con triage por IA, live en `/helpdesk/`, con demo pública y caso de estudio en `/projects/helpdesk/`.
- Segundo proyecto: gestión de expedientes para un estudio jurídico, privado en `casos.bertium.net`, con caso de estudio en `/projects/legal-cases/` (capturas sintéticas).

## Brand Commitments

- Nombre: Agustin Bertero. Titular: Full Stack Developer | PHP/Laravel · React · TypeScript | Linux & Cloud.
- Tono: directo, técnico, sin marketing hueco. Español rioplatense neutro en la versión es; inglés profesional en la versión en.
- Ubicación declarada: Argentina, disponible para trabajo remoto en Argentina, España y Europa. Nacionalidad argentina e italiana (ciudadanía UE).

## Evidence on Hand

- `RECURSOS/portfolio-opencode/site/content/profile.md`: perfil completo, experiencia, stack, formación, certificaciones e idiomas.
- `RECURSOS/Agustin_Bertero_CV_Full_Stack_Developer_2026.pdf`: CV en PDF para la descarga pública (verificar que no incluya teléfono).
- `RECURSOS/PROYECTOS RECOMENDADOS`: criterio ya definido sobre qué proyectos conviene construir y por qué.
- `RECURSOS/portfolio-opencode/AGENTS.md` y `.opencode/skills/`: reglas de repo, deploy e infraestructura.
- Ausencias que no se deben inventar: capturas o GIFs de proyectos (todavía no existen), testimonios, logos de clientes, métricas de negocio y foto de perfil.

## Product Principles

1. La prueba manda: cada afirmación del perfil se respalda con un proyecto, una demo o una decisión técnica contada.
2. Menos proyectos y mejor terminados. Es preferible una tarjeta honesta de "en desarrollo" que una demo rota.
3. El sitio es el propio portfolio: rápido, accesible y sin dependencias innecesarias.
4. Los datos del perfil se editan en un solo lugar; la landing solo los presenta.
5. Nada de relleno: si un dato falta, se omite o se pregunta.

## Accessibility & Inclusion

WCAG 2.2 AA: contraste, foco visible, navegación por teclado, `prefers-reduced-motion`, contenido comprensible sin JavaScript y tamaños táctiles cómodos en móvil.
