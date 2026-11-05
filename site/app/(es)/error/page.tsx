import Link from "next/link";

export const metadata = {
  title: "404 — Página no encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="shell"
      style={{
        minHeight: "100svh",
        display: "grid",
        alignContent: "center",
        gap: "1.5rem",
        paddingBlock: "6rem",
      }}
    >
      <p className="mono" style={{ color: "var(--color-stamp)", margin: 0 }}>
        Error 404 · Ruta inexistente
      </p>
      <h1
        style={{
          margin: 0,
          maxWidth: "18ch",
          fontSize: "var(--text-title)",
          fontWeight: 600,
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        Esta página no existe.
      </h1>
      <p style={{ margin: 0, maxWidth: "34rem", lineHeight: 1.6 }}>
        La dirección no corresponde a ninguna página del portfolio. Revisá el
        enlace o volvé al inicio.
      </p>
      <p
        className="mono"
        style={{ margin: 0, maxWidth: "34rem", color: "var(--color-ink-soft)" }}
      >
        This page does not exist. Check the link or go back to the home page.
      </p>
      <p style={{ margin: 0 }}>
        <Link href="/" className="link">
          Volver al inicio
        </Link>
      </p>
    </main>
  );
}
