import type { Metadata } from "next";
import Link from "next/link";

const repo = "https://github.com/AgustinBertero/agustinbertero.dev.ar/tree/main/projects/helpdesk";
const demo = "/helpdesk/";

export const metadata: Metadata = {
  title: "Helpdesk con triage por IA — caso",
  description:
    "Caso de estudio de un helpdesk con triage por IA: Laravel, React, TypeScript, PostgreSQL, cola de trabajos, RAG léxico y DeepSeek con fallback por reglas.",
  alternates: {
    canonical: "/projects/helpdesk/",
    languages: {
      es: "/projects/helpdesk/",
      en: "/en/projects/helpdesk/",
      "x-default": "/projects/helpdesk/",
    },
  },
  openGraph: {
    type: "article",
    url: "/projects/helpdesk/",
    title: "Helpdesk con triage por IA — caso",
    description:
      "Un MVP que clasifica tickets, resume hilos y sugiere respuestas con una base de conocimiento. Demo pública y código abierto.",
    images: [
      {
        url: "/projects/helpdesk/og.png",
        width: 1200,
        height: 630,
        alt: "Mesa de ayuda del portfolio con tickets y triage por IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/projects/helpdesk/og.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "Helpdesk con triage por IA",
  description:
    "MVP de helpdesk con triage asíncrono por IA, resumen de hilos y respuestas sugeridas con base de conocimiento.",
  url: "https://portfolio.bertium.net/projects/helpdesk/",
  author: { "@type": "Person", name: "Agustin Bertero" },
  keywords: ["Laravel", "React", "TypeScript", "PostgreSQL", "RAG", "DeepSeek"],
};

export default function HelpdeskCasePage() {
  return (
    <main id="main" className="case shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="case__back mono" aria-label="Volver">
        <Link className="link" href="/">
          ← Volver al portfolio
        </Link>
      </nav>

      <header className="case__hero">
        <div>
          <p className="case__kicker mono">Proyecto 01 · En producción</p>
          <h1 className="case__title">Helpdesk con triage por IA</h1>
          <p className="case__lede">
            Un sistema de tickets que clasifica, prioriza y resume cada consulta
            antes de que alguien la abra. La persona sigue decidiendo; el modelo
            se ocupa de la primera pasada.
          </p>
          <div className="case__actions">
            <a className="btn btn--fill" href={demo}>
              Abrir demo <span className="btn-ref">↗</span>
            </a>
            <a className="link" href={repo} target="_blank" rel="noreferrer noopener">
              Ver código
            </a>
          </div>
        </div>
        <table className="facts case__facts">
          <tbody>
            <tr>
              <th scope="row">Rol</th>
              <td>Diseño, backend, frontend e infraestructura</td>
            </tr>
            <tr>
              <th scope="row">Stack</th>
              <td>Laravel 12 · Inertia · React 19 · TypeScript</td>
            </tr>
            <tr>
              <th scope="row">IA</th>
              <td>DeepSeek · RAG léxico · fallback por reglas</td>
            </tr>
            <tr>
              <th scope="row">Datos</th>
              <td>PostgreSQL · cola en base de datos</td>
            </tr>
            <tr>
              <th scope="row">Demo</th>
              <td>Pública, sin login, datos sintéticos</td>
            </tr>
          </tbody>
        </table>
      </header>

      <figure className="case__shot">
        <img
          src="/projects/helpdesk/overview.png"
          alt="Mesa de ayuda con la lista de tickets, filtros y el formulario de nueva consulta"
          width={1280}
          height={800}
          loading="eager"
        />
        <figcaption className="mono">
          Mesa de ayuda: cola, filtros y estado del triage por ticket.
        </figcaption>
      </figure>

      <section className="case__section" aria-labelledby="problem">
        <div className="case__section-head">
          <span className="mono">01</span>
          <h2 id="problem">El problema</h2>
        </div>
        <div className="case__prose">
          <p>
            En soporte, los primeros minutos de cada ticket se van en decidir qué
            es, cuánto urge y si la respuesta ya existe en la base de conocimiento.
            Con hilos largos, esa decisión se repite antes de poder ayudar.
          </p>
          <p>
            El objetivo no era reemplazar al agente: era mover esa primera pasada a
            un trabajo en segundo plano y dejarle a la persona una decisión mejor
            informada.
          </p>
        </div>
      </section>

      <section className="case__section" aria-labelledby="what">
        <div className="case__section-head">
          <span className="mono">02</span>
          <h2 id="what">Qué hace</h2>
        </div>
        <div className="case__prose">
          <ul className="case__list">
            <li>Cola de tickets con búsqueda, filtros por estado, prioridad y triage.</li>
            <li>Detalle del ticket con el hilo completo y un panel de triage.</li>
            <li>Clasificación por categoría y prioridad, resumen y respuesta sugerida.</li>
            <li>Citas a los artículos de la base de conocimiento usados como contexto.</li>
            <li>Alta de una consulta de prueba para ver la cola y el triage en vivo.</li>
          </ul>
        </div>
      </section>

      <section className="case__section" aria-labelledby="how">
        <div className="case__section-head">
          <span className="mono">03</span>
          <h2 id="how">Cómo funciona el triage</h2>
        </div>
        <div className="case__prose">
          <ol className="case__steps">
            <li>El ticket y sus mensajes entran en un job de la cola.</li>
            <li>Un retriever léxico puntúa los artículos por título, tags y cuerpo, y devuelve los tres mejores.</li>
            <li>El prompt incluye el hilo y esos artículos; el modelo devuelve JSON estricto.</li>
            <li>El servidor valida categoría, prioridad y citas antes de guardar el resultado.</li>
            <li>Si falta la API key, el proveedor falla o el JSON es inválido, entra el fallback por reglas.</li>
          </ol>
          <p>
            El modelo recibe la instrucción de no inventar políticas, precios,
            direcciones ni plazos que no estén en la base. La respuesta sugerida es
            un borrador: el agente la revisa antes de enviarla.
          </p>
        </div>
      </section>

      <figure className="case__shot">
        <img
          src="/projects/helpdesk/ticket.png"
          alt="Detalle de un ticket con el hilo de mensajes y el panel de triage por IA con resumen, respuesta y artículos citados"
          width={1280}
          height={800}
          loading="lazy"
        />
        <figcaption className="mono">
          Detalle del ticket: hilo, resumen, respuesta sugerida y base de conocimiento.
        </figcaption>
      </figure>

      <section className="case__section" aria-labelledby="architecture">
        <div className="case__section-head">
          <span className="mono">04</span>
          <h2 id="architecture">Arquitectura</h2>
        </div>
        <div className="case__prose">
          <p>
            Laravel sirve la app y valida todo del lado del servidor. Inertia y React
            renderizan la mesa sin duplicar autenticación, CSRF ni CORS. PostgreSQL
            guarda tickets, mensajes, artículos, sesiones, caché y jobs; un worker
            separado procesa la cola.
          </p>
          <p>
            El contenedor web y el worker comparten la misma imagen. El gateway
            publica la demo bajo <code>/helpdesk/</code>, aplica CSP y limita el
            endpoint de triage con una zona de rate limit separada.
          </p>
        </div>
      </section>

      <section className="case__section" aria-labelledby="decisions">
        <div className="case__section-head">
          <span className="mono">05</span>
          <h2 id="decisions">Decisiones</h2>
        </div>
        <div className="case__prose">
          <ul className="case__list">
            <li><strong>Laravel + Inertia:</strong> un solo deployable, validación y sesión del lado del servidor, y React sin una API duplicada.</li>
            <li><strong>Cola en base de datos:</strong> un worker y un volumen pequeño no justifican Redis para esta demo.</li>
            <li><strong>RAG léxico:</strong> la base es chica y evita una segunda API paga; el retriever está aislado para cambiar a embeddings después.</li>
            <li><strong>Fallback por reglas:</strong> la demo tiene que explicarse aunque falte la key o el proveedor esté caído.</li>
            <li><strong>Demo pública:</strong> sin registro, datos sintéticos, rate limit y reset nocturno.</li>
          </ul>
        </div>
      </section>

      <section className="case__section" aria-labelledby="limits">
        <div className="case__section-head">
          <span className="mono">06</span>
          <h2 id="limits">Límites y próximo paso</h2>
        </div>
        <div className="case__prose">
          <ul className="case__list">
            <li>El retriever léxico pierde paráfrasis; pgvector es el siguiente paso.</li>
            <li>No hay cuentas, roles, adjuntos ni ingesta de email: es un MVP, no un helpdesk de producción.</li>
            <li>La respuesta sugerida siempre requiere revisión humana.</li>
            <li>La demo se reinicia cada noche y no debe usarse con datos reales.</li>
          </ul>
        </div>
      </section>

      <section className="case__closing" aria-labelledby="closing">
        <div>
          <p className="case__kicker mono">Demo pública</p>
          <h2 id="closing">Probalo con datos sintéticos.</h2>
          <p>
            Abrí un ticket, mirá cómo entra en la cola y cómo el triage aparece en
            segundo plano. No hace falta crear una cuenta.
          </p>
        </div>
        <div className="case__actions">
          <a className="btn btn--fill" href={demo}>
            Abrir helpdesk <span className="btn-ref">↗</span>
          </a>
          <a className="link" href={repo} target="_blank" rel="noreferrer noopener">
            Ver código
          </a>
        </div>
      </section>
    </main>
  );
}
