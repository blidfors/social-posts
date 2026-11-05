// Mallens layouter för Livet enligt kroppen, delade mellan build.mjs (PNG) och förhandsvisningen (artifact).
// Ändra här, så ändras båda. Typsnitten laddas av den som använder filen (lokala woff2 respektive Google Fonts).
(function () {
  const C = {
    sand: '#fbf8f1', ink: '#463e4f', head: '#4e476c', plum: '#6a4f76', plumSoft: '#7e5c86',
    frame: '#d8c9dc', green: '#1e8470', yellow: '#e08a1e', gold: '#d9ae5a', quoteMark: '#e4c079', quoteEm: '#f7b84e',
  };

  const css = `
.lek .root{width:1080px;height:1350px;box-sizing:border-box;background:${C.sand};font-family:'Lora',Georgia,serif;color:${C.ink};display:flex;flex-direction:column;overflow:hidden;text-align:left}
.lek .grotesk{font-family:'Familjen Grotesk',system-ui,sans-serif}
.lek .kicker{font-family:'Familjen Grotesk',system-ui,sans-serif;font-size:30px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${C.plum}}
.lek .foot{display:flex;justify-content:space-between;align-items:center;font-family:'Familjen Grotesk',system-ui,sans-serif;font-size:28px}
.lek .foot .brand{font-weight:700;color:${C.plum}} .lek .foot .num{font-weight:600;color:${C.head}}
.lek .frame{flex:1;min-height:0;box-sizing:border-box;border:4px solid ${C.frame};border-radius:56px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;overflow:hidden}
.lek p{margin:0} .lek h1,.lek h2{margin:0;font-weight:700;color:${C.head};text-wrap:balance}
.lek em{font-style:italic} .lek strong{font-weight:700;color:${C.head}}
.lek .g{color:${C.green}} .lek .y{color:${C.yellow}}
.lek .body p+p{margin-top:.7em}
.lek .q em{color:${C.quoteEm}} .lek .q strong{color:${C.sand}}
`;

  // data-field = redigerbart fält (sökväg i sliden), data-fit = bas-px för text som får krympa, data-box = ytan som inte får svämma över.
  const f = (name) => `data-field="${name}"`;
  const foot = (i, n, pad) => `<div class="foot" style="padding:${pad ?? '0 16px'}"><div class="brand">Livet enligt kroppen</div>${n > 1 ? `<div class="num">${i} / ${n}</div>` : ''}</div>`;
  const paras = (body) => Array.isArray(body) ? body : (/<p[\s>]/.test(body) ? [body] : [body]);
  const bodyHtml = (body) => /<p[\s>]/.test(String(body)) && !Array.isArray(body) ? body : paras(body).map(p => `<p>${p}</p>`).join('');

  const layouts = {
    cover: (s, i, n) => `
<div class="root" data-box style="padding:112px 104px 96px;justify-content:space-between;align-items:center;text-align:center">
  <div style="height:30px"></div>
  <div style="display:flex;flex-direction:column;gap:48px;align-items:center">
    <h1 ${f('title')} data-fit="112" style="line-height:1.12">${s.title}</h1>
    ${s.subtitle ? `<p ${f('subtitle')} data-fit="48" style="line-height:1.4;max-width:780px">${s.subtitle}</p>` : ''}
  </div>
  <div style="width:100%">${foot(i, n, '0')}</div>
</div>`,

    text: (s, i, n) => `
<div class="root" style="padding:64px 64px 44px;gap:36px">
  <div class="frame" data-box style="padding:88px 80px;gap:48px">
    ${s.kicker ? `<div class="kicker" ${f('kicker')}>${s.kicker}</div>` : ''}
    ${s.title ? `<h2 ${f('title')} data-fit="76" style="line-height:1.1">${s.title}</h2>` : ''}
    <div class="body" ${f('body')} data-paras data-fit="${s.title ? 44 : 52}" style="line-height:1.45;text-wrap:balance">${bodyHtml(s.body)}</div>
  </div>
  ${foot(i, n)}
</div>`,

    exercise: (s, i, n) => `
<div class="root" style="padding:64px 64px 44px;gap:36px">
  <div class="frame" data-box style="padding:80px;gap:48px">
    ${s.kicker ? `<div class="kicker" ${f('kicker')}>${s.kicker}</div>` : ''}
    <h2 ${f('title')} data-fit="76" style="line-height:1.1">${s.title}</h2>
    <div style="display:flex;flex-direction:column;gap:34px;align-items:center">
      ${s.steps.map((st, k) => `<div style="display:flex;flex-direction:column;gap:4px;align-items:center">
        <div style="font-size:34px;font-weight:700;font-style:italic;color:${C.plumSoft}">${k + 1}</div>
        <p ${f('steps.' + k)} data-fit="42" style="line-height:1.45">${st}</p></div>`).join('')}
    </div>
  </div>
  ${foot(i, n)}
</div>`,

    cta: (s, i, n) => `
<div class="root" style="padding:64px 64px 44px;gap:36px">
  <div class="frame" data-box style="padding:88px 80px;gap:48px">
    ${s.kicker ? `<div class="kicker" ${f('kicker')}>${s.kicker}</div>` : ''}
    <h2 ${f('title')} data-fit="84" style="line-height:1.12">${s.title}</h2>
    ${s.body ? `<p ${f('body')} data-fit="44" style="line-height:1.45;text-wrap:balance">${s.body}</p>` : ''}
    ${s.action ? `<div style="display:flex;flex-direction:column;gap:28px;align-items:center;padding-top:8px">
      <div style="width:96px;height:6px;border-radius:3px;background:${C.gold}"></div>
      <p ${f('action')} data-fit="44" style="line-height:1.4;color:${C.head};text-wrap:balance">${s.action}</p></div>` : ''}
  </div>
  ${foot(i, n)}
</div>`,

    quote: (s, i, n) => `
<div class="root" data-box style="padding:96px 72px;justify-content:space-between;align-items:center">
  <div style="height:30px"></div>
  <div style="width:100%;box-sizing:border-box;background:${C.plum};color:${C.sand};border-radius:56px;padding:88px 80px 84px;display:flex;flex-direction:column;gap:36px">
    <div style="font-size:220px;line-height:.7;height:110px;font-weight:700;color:${C.quoteMark}" aria-hidden="true">“</div>
    <p class="q" ${f('text')} data-fit="70" style="line-height:1.28;font-weight:600;text-wrap:balance">${s.text}</p>
    ${s.attribution === '' ? '' : `<div class="grotesk" ${f('attribution')} style="font-size:32px;font-weight:600;color:${C.frame}">${s.attribution ?? 'Niklas Blidfors'}</div>`}
  </div>
  ${n > 1 ? `<div style="width:100%">${foot(i, n, '0')}</div>` : `<div class="grotesk" style="font-size:28px;font-weight:700;color:${C.plum}">Livet enligt kroppen</div>`}
</div>`,
  };

  function html(slide, i, n) {
    const make = layouts[slide.layout];
    if (!make) throw new Error(`Okänd layout "${slide.layout}". Välj: ${Object.keys(layouts).join(', ')}`);
    return `<div class="lek">${make(slide, i, n)}</div>`;
  }

  // Krymp all data-fit-text i samma takt tills ytan rymmer innehållet.
  function fit(container) {
    const box = container.querySelector('[data-box]');
    const items = [...container.querySelectorAll('[data-fit]')];
    const over = () => box.scrollHeight > box.clientHeight + 1 || box.scrollWidth > box.clientWidth + 1;
    let scale = 1;
    const apply = () => items.forEach(el => { el.style.fontSize = `${Math.round(+el.dataset.fit * scale)}px`; });
    apply();
    while (over() && scale > 0.5) { scale -= 0.02; apply(); }
    const overflow = over();
    scale = +scale.toFixed(2);
    return { scale, overflow, warn: overflow ? 'Texten får inte plats. Dela upp eller korta.' : scale < 0.8 ? 'Liten text. Överväg att korta eller dela upp.' : null };
  }

  // Alt-text: synlig text utan sidfot och dekor.
  function plain(container) {
    const c = container.cloneNode(true);
    c.querySelectorAll('.foot, [aria-hidden], .grotesk:not([data-field])').forEach(el => el.remove());
    c.querySelectorAll('p, div, h1, h2').forEach(el => el.append(' '));
    return c.textContent.replace(/\s+/g, ' ').trim();
  }

  const api = { C, css, layouts, html, fit, plain, names: Object.keys(layouts) };
  if (typeof window !== 'undefined') window.LEK = api;
  if (typeof module !== 'undefined') module.exports = api;
})();
