# social-posts

Verktyg och bilder för inlägg från Livet enligt kroppen. På Instagram (@livetenligtkroppen) blir det en enskild bild eller en karusell. Samma innehåll går också ut som en texttråd på Threads och som ett textinlägg (ibland med en egen bild) på Facebook-sidan. Själva flödet beskrivs i skillen `livet-enligt-kroppen:instagram-inlagg` (plugin-bibliotek). Använd den när Niklas vill göra ett inlägg eller skriver "kör" på ett förslag.

Repot är publikt. Lägg aldrig in hemligheter, tokens eller Buffer-uppgifter här.

## Filer

- `layouts.js`: mallens fem layouter (`cover`, `text`, `exercise`, `cta`, `quote`), färger och textanpassning. Används av både `build.mjs` och förhandsvisningen.
- `build.mjs`: `node build.mjs instagram/<mapp>/post.json` renderar `slide-N.png` (1080×1350) och `facebook.png` (första bilden utan sidnummer) bredvid post.json med Playwright och lokala typsnitt (@fontsource). Skriver ut en rapport med skala, varningar och alt-texter. Sökvägar räknas från repots rot.
- `forhandsvisning/index.html`: Inläggsverkstaden, en artifact där Niklas ändrar förslag: https://claude.ai/artifact/RCdJDYJhtTqsLqmUpwPkLS. Förslagen ligger i dess databas (`posts/<mapp>`).
- `mall/`: kopior av originalmallarna från canvasen https://claude.ai/artifact/AMUEQzpcQ9ugWMkRgGtsGr. Bara referens.
- `instagram/<YYYY-MM-DD>-<slug>/`: färdiga inlägg. Buffer hämtar bilderna via raw.githubusercontent.com.

## Installera

- Lokalt: `npm install` (och `npx playwright install chromium` första gången).
- Molnet (Playwright och Chromium förinstallerade): `npm install --omit=optional`. Då installeras bara typsnitten och `build.mjs` använder den globala Playwright.

## Viktigt

- Om `layouts.js` ändras måste artifacten publiceras om med `layouts.js` som fil (`files: {"layouts.js": ...}`). Annars visar förhandsvisningen något annat än PNG:erna. Kontrollera ändringar genom att rendera och titta på bilderna.
- Buffer sparar inga egna kopior, bara länken. Instagram hämtar bilden när inlägget publiceras. Ta därför inte bort eller flytta bilder under `instagram/`.
- Inget får publiceras eller schemaläggas utan att Niklas har skrivit "kör" i chatten. Standard är utkast i Buffer.
- Inga tankstreck i text som Niklas ska läsa eller publicera.
