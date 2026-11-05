import type { Metadata } from "next";
import Link from "next/link";

const repo = "https://github.com/AgustinBertero/agustinbertero.dev.ar/tree/main/projects/legal-cases";

export const metadata: Metadata = {
  title: "Gestión de expedientes — caso",
  description:
    "Caso de estudio de una app privada para un estudio jurídico: clientes, expedientes, vencimientos, documentos cifrados, roles y auditoría con Laravel, Inertia y React.",
  alternates: {
    canonical: "/projects/legal-cases/",
    languages: {
      es: "/projects/legal-cases/",
      en: "/en/projects/legal-cases/",
      "x-default": "/projects/legal-cases/",
    },
  },
  openGraph: {
    type: "article",
    url: "/projects/legal-cases/",
    title: "Gestión de expedientes — caso",
    description:
      "Una app privada para el trabajo diario de un estudio: casos, vencimientos y documentos cifrados. Capturas con datos sintéticos.",
    images: [
      {
        url: "/projects/legal-cases/og.png",
        width: 1200,
        height: 630,
        alt: "Tablero de gestión de expedientes con vencimientos y tareas",
      },
    ],
  },
  twitter: { card: "summary_large_image", images: ["/projects/legal-cases/og.png"] },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "Estudio — gestión de expedientes",
  description:
    "Aplicación privada de gestión de clientes, expedientes, vencimientos, tareas y documentos cifrados para un estudio jurídico.",
  url: "https://portfolio.bertium.net/projects/legal-cases/",
  author: { "@type": "Person", name: "Agustin Bertero" },
  keywords: ["Laravel", "Inertia", "React", "TypeScript", "PostgreSQL", "legal tech"],
};

export default function LegalCasesPage() {
  return (
    <main id="main" className="case shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="case__back mono" aria-label="Volver">
        <Link className="link" href="/">← Volver al portfolio</Link>
      </nav>

      <header className="case__hero">
        <div>
          <p className="case__kicker mono">Proyecto 02 · Producto privado</p>
          <h1 className="case__title">Gestión de expedientes para un estudio jurídico</h1>
          <p className="case__lede">
            Clientes, expedientes, vencimientos, tareas y documentos en una sola mesa.
            Acceso privado, roles, auditoría y archivos cifrados. Las capturas usan datos
            sintéticos; no hay demo pública.
          </p>
          <div className="case__actions">
            <a className="link" href={repo} target="_blank" rel="noreferrer noopener">Ver código</a>
            <span className="mono">Acceso solo para el estudio</span>
          </div>
        </div>
        <table className="facts case__facts">
          <tbody>
            <tr><th scope="row">Rol</th><td>Producto, backend, frontend, infraestructura y privacidad</td></tr>
            <tr><th scope="row">Stack</th><td>Laravel 12 · Inertia · React 19 · TypeScript</td></tr>
            <tr><th scope="row">Datos</th><td>PostgreSQL · documentos cifrados en reposo</td></tr>
            <tr><th scope="row">Acceso</th><td>Privado · sin registro público</td></tr>
            <tr><th scope="row">Estado</th><td>MVP en uso, iteración</td></tr>
          </tbody>
        </table>
      </header>

      <figure className="case__shot">
        <img src="/projects/legal-cases/overview.png" alt="Tablero de la app con vencimientos, tareas y expedientes recientes" width={1440} height={1677} loading="eager" />
        <figcaption className="mono">Tablero: lo que vence, lo que está abierto y lo que cambió. Datos sintéticos.</figcaption>
      </figure>

      <section className="case__section" aria-labelledby="problem">
        <div className="case__section-head"><span className="mono">01</span><h2 id="problem">El problema</h2></div>
        <div className="case__prose">
          <p>
            En un estudio chico, el expediente vive repartido entre una carpeta, una planilla
            de vencimientos, el correo y la memoria de quien lleva el caso. Cuando entra una
            consulta, la primera pregunta es siempre la misma: qué es, qué vence y qué
            documento falta.
          </p>
          <p>
            Este MVP junta ese trabajo en una mesa privada. No intenta ser un SaaS para miles
            de estudios: resuelve el día a día de uno, con datos reales y sin convertir el
            cliente en un experimento.
          </p>
        </div>
      </section>

      <section className="case__section" aria-labelledby="what">
        <div className="case__section-head"><span className="mono">02</span><h2 id="what">Qué hace</h2></div>
        <div className="case__prose">
          <ul className="case__list">
            <li>Clientes con identificación, contacto e historial de expedientes.</li>
            <li>Expedientes con carátula, número, tribunal, materia, partes y estado.</li>
            <li>Vencimientos con fecha, tipo, responsable y cierre en un clic.</li>
            <li>Tareas con o sin expediente, asignables a cada persona del estudio.</li>
            <li>Documentos vinculados al caso, cifrados antes de guardarse y auditados al descargar.</li>
            <li>Roles de titular, abogado/a y asistente; usuarios y auditoría solo para el titular.</li>
          </ul>
        </div>
      </section>

      <figure className="case__shot">
        <img src="/projects/legal-cases/case.png" alt="Detalle de un expediente con resumen, vencimientos, documentos, notas y ficha del cliente" width={1440} height={1611} loading="lazy" />
        <figcaption className="mono">Expediente: resumen, vencimientos, documentos, notas y ficha del cliente.</figcaption>
      </figure>

      <section className="case__section" aria-labelledby="architecture">
        <div className="case__section-head"><span className="mono">03</span><h2 id="architecture">Arquitectura</h2></div>
        <div className="case__prose">
          <p>
            Laravel sirve la app y concentra validación, sesión, roles y auditoría. Inertia y
            React renderizan la mesa sin una API duplicada. PostgreSQL guarda el trabajo;
            un volumen privado guarda los documentos cifrados.
          </p>
          <p>
            El gateway publica el hostname privado y Cloudflare Tunnel lo conecta sin abrir
            puertos. Cloudflare Access es la segunda barrera antes del login. La app no se
            enlaza desde el portfolio y responde <code>noindex</code>.
          </p>
        </div>
      </section>

      <section className="case__section" aria-labelledby="decisions">
        <div className="case__section-head"><span className="mono">04</span><h2 id="decisions">Decisiones</h2></div>
        <div className="case__prose">
          <ul className="case__list">
            <li><strong>Un estudio, no multi-tenant.</strong> Menos superficie y un modelo de datos que se entiende; el aislamiento multi-estudio queda para otra fase.</li>
            <li><strong>Sin registro público.</strong> El titular crea las cuentas; cada alta y cada cambio queda en auditoría.</li>
            <li><strong>Documentos cifrados con la clave de la app.</strong> El nombre real no se usa como ruta; la descarga pasa por una ruta autenticada.</li>
            <li><strong>Roles explícitos.</strong> Asistente no borra; abogado no administra usuarios; el titular ve la auditoría.</li>
            <li><strong>Acceso detrás de Cloudflare Access.</strong> La app es privada incluso antes de llegar al login.</li>
          </ul>
        </div>
      </section>

      <section className="case__section" aria-labelledby="limits">
        <div className="case__section-head"><span className="mono">05</span><h2 id="limits">Límites y próximo paso</h2></div>
        <div className="case__prose">
          <ul className="case__list">
            <li>Sin TOTP dentro de la app: Access es el segundo factor por ahora.</li>
            <li>Sin facturación, portal de clientes, recordatorios por email ni integraciones judiciales.</li>
            <li>Las partes son texto, no una tabla estructurada.</li>
            <li>Backups externos: el volumen ya está cifrado; falta activar restic/R2 con credenciales y probar la restauración.</li>
            <li>La app no reemplaza el criterio profesional ni una revisión de cumplimiento legal.</li>
          </ul>
        </div>
      </section>

      <figure className="case__shot">
        <img src="/projects/legal-cases/clients.png" alt="Listado de clientes con datos de contacto y cantidad de expedientes" width={1440} height={1000} loading="lazy" />
        <figcaption className="mono">Clientes: la puerta de entrada a cada expediente. Datos sintéticos.</figcaption>
      </figure>

      <section className="case__closing" aria-labelledby="closing">
        <div>
          <p className="case__kicker mono">Caso privado</p>
          <h2 id="closing">Software para el trabajo real, no para la vitrina.</h2>
          <p>
            El código muestra el modelo, los permisos, la auditoría y el cifrado. Si querés
            verlo en una entrevista, lo recorremos con datos sintéticos.
          </p>
        </div>
        <div className="case__actions">
          <a className="link" href={repo} target="_blank" rel="noreferrer noopener">Ver código</a>
        </div>
      </section>
    </main>
  );
}
