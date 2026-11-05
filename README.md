# social-posts

Bilder och verktyg för inlägg från Livet enligt kroppen (@livetenligtkroppen).

- `instagram/<YYYY-MM-DD>-<slug>/`: färdiga inlägg (`post.json`, `slide-N.png`, `facebook.png`). Buffer hämtar bilderna härifrån via raw.githubusercontent.com, så flytta eller byt inte namn på dem.
- `layouts.js`: mallens fem layouter (`cover`, `text`, `exercise`, `cta`, `quote`).
- `build.mjs`: renderar en `post.json` till PNG (1080×1350).
- `forhandsvisning/index.html`: Inläggsverkstaden (förhandsvisning som publiceras som artifact).
- `mall/`: originalmallarna, bara som referens.

## Rendera

Lokalt (Windows eller macOS), Node 18 eller nyare:

```bash
npm install
npx playwright install chromium   # bara första gången
node build.mjs instagram/<mapp>/post.json
```

I en molnmiljö där Playwright och Chromium redan är förinstallerade:

```bash
npm install --omit=optional       # bara typsnitten, ingen egen Playwright
node build.mjs instagram/<mapp>/post.json
```

Bilderna hamnar bredvid `post.json`. Skriptet skriver ut en rapport med textskala, varningar och alt-texter.

## Typsnitt

Lora och Familjen Grotesk kommer från `@fontsource` och har licensen SIL Open Font License 1.1. De installeras med npm och checkas inte in.
