/**
 * Post-build pre-rendering script.
 *
 * Reads dist/index.html, renders the StaticShell component to an HTML string,
 * and injects it into the <div id="root"> element. The result is that crawlers
 * see real content without executing JavaScript.
 *
 * Usage: npx tsx scripts/prerender.tsx (runs after vite build)
 */
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import StaticShell from "../src/StaticShell";

const distPath = resolve(import.meta.dirname, "../dist/index.html");

console.log("Pre-rendering: reading dist/index.html...");
const html = readFileSync(distPath, "utf-8");

console.log("Pre-rendering: rendering StaticShell to string...");
const shellHtml = renderToString(createElement(StaticShell));

// Replace empty <div id="root"></div> with pre-rendered content
const result = html.replace(
  '<div id="root"></div>',
  `<div id="root">${shellHtml}</div>`
);

writeFileSync(distPath, result, "utf-8");
console.log("Pre-rendering: done! dist/index.html now contains pre-rendered HTML.");
