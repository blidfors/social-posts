// Renderar ett Instagram-inlägg för Livet enligt kroppen från en post.json.
// Användning: node build.mjs <sökväg till post.json>
// Bilderna hamnar bredvid post.json som slide-1.png, slide-2.png ... samt facebook.png (första bilden utan sidnummer).
// Layouterna ligger i layouts.js (samma fil som förhandsvisningen använder).
// Skriver ut en rapport per slide (textskala, varningar, alt-text) som JSON.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';

// Alla sökvägar räknas från repots rot (mappen där build.mjs ligger), så det fungerar på Windows och Linux.
const here = path.dirname(fileURLToPath(import.meta.url));

// Playwright: först repots eget paket (lokalt, efter `npm install`), annars det förinstallerade
// globala paketet (molnmiljön, efter `npm install --omit=optional`). Då används molnets egen Chromium.
function loadPlaywright() {
  const req = createRequire(path.join(here, 'package.json'));
  try { return req('playwright'); } catch {}
  try { return createRequire(path.join(execSync('npm root -g', { encoding: 'utf8' }).trim(), 'noop.js'))('playwright'); } catch {}
  console.error('Hittar inte Playwright. Kör `npm install` (lokalt) eller kontrollera att Playwright är förinstallerat globalt (molnet).');
  process.exit(1);
}
const { chromium } = loadPlaywright();
const specPath = path.resolve(process.argv[2] ?? '');
if (!fs.existsSync(specPath)) { console.error('Hittar inte post.json:', specPath); process.exit(1); }
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const outDir = path.dirname(specPath);

// Typsnitten laddas från filer, så datorns egna typsnitt spelar ingen roll. Saknas en fil faller Chromium
// tyst tillbaka på något annat, och då blir bilderna fel. Stanna hellre.
const font = (pkg, file) => {
  const p = path.join(here, 'node_modules', '@fontsource', pkg, 'files', file);
  if (!fs.existsSync(p)) { console.error('Typsnitt saknas:', p, '\nKör `npm install` i repots rot.'); process.exit(1); }
  return pathToFileURL(p).href;
};
const faces = [
  ...[400, 600, 700].flatMap(w => ['normal', 'italic'].map(s =>
    `@font-face{font-family:'Lora';font-style:${s};font-weight:${w};src:url(${font('lora', `lora-latin-${w}-${s}.woff2`)}) format('woff2')}`)),
  ...[600, 700].map(w =>
    `@font-face{font-family:'Familjen Grotesk';font-weight:${w};src:url(${font('familjen-grotesk', `familjen-grotesk-latin-${w}-normal.woff2`)}) format('woff2')}`),
].join('\n');

const n = spec.slides.length;
if (n < 1 || n > 10) { console.error(`Instagram tillåter 1–10 bilder, fick ${n}.`); process.exit(1); }

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
const tmp = path.join(outDir, '_render.html');
fs.writeFileSync(tmp, `<!doctype html><html lang="sv"><head><meta charset="utf-8"><style>${faces}\nbody{margin:0}</style>
<script src="${pathToFileURL(path.join(here, 'layouts.js')).href}"></script></head><body><div id="s"></div></body></html>`);
await page.goto(pathToFileURL(tmp).href);
await page.evaluate(() => { const st = document.createElement('style'); st.textContent = LEK.css; document.head.append(st); });

const report = [];
for (const [k, s] of spec.slides.entries()) {
  const res = await page.evaluate(async ([s, i, n]) => {
    const el = document.getElementById('s');
    el.innerHTML = LEK.html(s, i, n);
    await document.fonts.ready;
    const fit = LEK.fit(el);
    return { ...fit, alt: LEK.plain(el) };
  }, [s, k + 1, n]);
  await page.screenshot({ path: path.join(outDir, `slide-${k + 1}.png`), clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  report.push({ slide: k + 1, layout: s.layout, scale: res.scale, warn: res.warn, alt: s.alt ?? res.alt });
}
// Facebook får första bilden utan sidnummer (rendera den som ett ensamt inlägg).
await page.evaluate(async (s) => {
  const el = document.getElementById('s');
  el.innerHTML = LEK.html(s, 1, 1);
  await document.fonts.ready;
  LEK.fit(el);
}, spec.slides[0]);
await page.screenshot({ path: path.join(outDir, 'facebook.png'), clip: { x: 0, y: 0, width: 1080, height: 1350 } });
fs.unlinkSync(tmp);
await browser.close();
console.log(JSON.stringify({ folder: outDir, slides: report, facebook: { file: 'facebook.png', alt: report[0].alt } }, null, 2));
