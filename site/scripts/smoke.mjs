#!/usr/bin/env node
// Smoke checks for the static export. Runs after `next build` against ./out.
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../out/", import.meta.url).pathname;
const failures = [];
const checks = [];

function check(name, fn) {
  try {
    fn();
    checks.push(name);
  } catch (error) {
    failures.push(`${name}: ${error.message}`);
  }
}

function read(path) {
  const full = join(root, path);
  if (!existsSync(full)) throw new Error(`missing ${path}`);
  return readFileSync(full, "utf8");
}

function expectIncludes(haystack, needle, label) {
  if (!haystack.includes(needle)) throw new Error(`${label} does not include ${needle}`);
}

check("routes exist", () => {
  for (const file of [
    "index.html",
    "en/index.html",
    "cv/index.html",
    "404.html",
    "error/index.html",
    "projects/helpdesk/index.html",
    "en/projects/helpdesk/index.html",
    "projects/helpdesk/overview.png",
    "projects/helpdesk/ticket.png",
    "projects/helpdesk/og.png",
    "favicon.ico",
    "icon.png",
    "apple-icon.png",
    "og.png",
    "robots.txt",
    "sitemap.xml",
    "cv/agustin-bertero-cv.pdf",
    "fonts/archivo-latin.woff2",
    "fonts/courier-prime-400.woff2",
  ]) {
    if (!existsSync(join(root, file))) throw new Error(`missing ${file}`);
  }
});

check("languages and alternates", () => {
  const es = read("index.html");
  const en = read("en/index.html");
  expectIncludes(es, '<html lang="es"', "es route");
  expectIncludes(read("error/index.html"), '<html lang="es"', "404 route");
  expectIncludes(en, '<html lang="en"', "en route");
  expectIncludes(es, 'href="/en/"', "es alternate");
  expectIncludes(en, 'href="/"', "en alternate");
});

check("metadata and JSON-LD", () => {
  for (const file of ["index.html", "en/index.html", "projects/helpdesk/index.html", "en/projects/helpdesk/index.html"]) {
    const html = read(file);
    expectIncludes(html, 'rel="canonical"', file);
    expectIncludes(html, 'href="https://portfolio.bertium.net/', file);
    expectIncludes(html, "application/ld+json", file);
    expectIncludes(html, 'name="description"', file);
    expectIncludes(html, 'property="og:image"', file);
    expectIncludes(html, 'name="twitter:card"', file);
    expectIncludes(html.toLowerCase(), 'hreflang="x-default"', file);
  }
});

check("robots and sitemap point at the live domain", () => {
  expectIncludes(read("robots.txt"), "Sitemap: https://portfolio.bertium.net/sitemap.xml", "robots.txt");
  const sitemap = read("sitemap.xml");
  expectIncludes(sitemap, "https://portfolio.bertium.net/", "sitemap");
  expectIncludes(sitemap, "https://portfolio.bertium.net/en/", "sitemap");
  expectIncludes(sitemap, "https://portfolio.bertium.net/cv/", "sitemap");
  expectIncludes(sitemap, "https://portfolio.bertium.net/projects/helpdesk/", "sitemap");
  expectIncludes(sitemap, "https://portfolio.bertium.net/en/projects/helpdesk/", "sitemap");
});

check("no phone published", () => {
  const html = read("index.html") + read("en/index.html") + read("cv/index.html");
  if (/href=["']tel:/i.test(html)) throw new Error("found a tel: link");
  if (/(?:\+54|0054)\s?9?\s?11/i.test(html)) throw new Error("found an Argentine phone pattern");
});

check("no third-party scripts or styles", () => {
  for (const file of ["index.html", "en/index.html", "cv/index.html"]) {
    const html = read(file);
    const scripts = [...html.matchAll(/<script[^>]+src=["'](https?:\/\/[^"']+)["']/g)].map((m) => m[1]);
    const styles = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["'](https?:\/\/[^"']+)["']/g)].map((m) => m[1]);
    const external = [...scripts, ...styles].filter((url) => !url.startsWith("https://portfolio.bertium.net"));
    if (external.length > 0) throw new Error(`${file} loads ${external.join(", ")}`);
  }
});

check("CV PDF is a real file", () => {
  const size = statSync(join(root, "cv/agustin-bertero-cv.pdf")).size;
  if (size < 10_000) throw new Error(`PDF is only ${size} bytes`);
});

check("internal navigation resolves", () => {
  for (const file of ["index.html", "en/index.html"]) {
    const html = read(file);
    for (const [, href] of html.matchAll(/href=["'](\/[^"'#?]*)["']/g)) {
      if (href.startsWith("/_next/") || href.startsWith("/helpdesk") || href.endsWith(".pdf") || href.endsWith(".woff2")) continue;
      const target = href.endsWith("/") ? `${href.slice(1)}index.html` : href.slice(1);
      if (!existsSync(join(root, target))) throw new Error(`${file} links to missing ${href}`);
    }
  }
});

if (failures.length > 0) {
  console.error(`smoke: ${failures.length} failure(s)`);
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log(`smoke: ${checks.length} checks passed`);
