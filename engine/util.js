// Small helpers shared by every game.

/** Build a DOM element: h('button', { class: 'btn', onClick: fn }, 'Label') */
export function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (typeof v !== 'string' && k in el) el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return el;
}

/** Turn an HTML/SVG string (like a doodle) into an element. */
export function fromHTML(html) {
  const t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

/** Replace an element's children, skipping null/false (so `cond && h(...)` works). */
export function fill(el, ...kids) {
  el.replaceChildren(...kids.flat(Infinity).filter((k) => k != null && k !== false));
  return el;
}

/** Lowercase, strip accents/punctuation/spaces and a leading "the", so "The New-York" === "newyork". */
export function normalize(s) {
  return String(s)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/^\s*the\s+/, '')
    .replace(/[^a-z0-9]/g, '');
}

/** Deterministic random numbers, so every player gets the same shuffle for the same day. */
export function seededRandom(seedText) {
  let a = 0;
  for (const ch of String(seedText)) a = (Math.imul(a ^ ch.charCodeAt(0), 2654435761) + 1) | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffle(list, rand = Math.random) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export function formatNumber(n) {
  return Number(n).toLocaleString('en-US', { maximumFractionDigits: 3 });
}

/** Parse "8,849", "1.2k", "3 million", "2.5b" → number (NaN if it isn't one). */
export function parseNumber(input) {
  const s = String(input).trim().toLowerCase().replace(/,/g, '').replace(/\s+/g, ' ');
  const m = s.match(/^(-?\d*\.?\d+)\s*(k|thousand|m|mil|million|b|bn|billion)?$/);
  if (!m) return NaN;
  const mult = { k: 1e3, thousand: 1e3, m: 1e6, mil: 1e6, million: 1e6, b: 1e9, bn: 1e9, billion: 1e9 }[m[2]] || 1;
  return parseFloat(m[1]) * mult;
}

export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Slide elements (matched by `selector`, keyed by data-key) from their old spot to their new one
 *  after `mutate()` re-renders them (FLIP). `root` must stay in the page across the re-render. */
export function flip(root, selector, mutate) {
  const before = new Map([...root.querySelectorAll(selector)].map((el) => [el.dataset.key, el.getBoundingClientRect().top]));
  mutate();
  if (prefersReducedMotion()) return;
  for (const el of root.querySelectorAll(selector)) {
    const old = before.get(el.dataset.key);
    if (old == null) continue;
    const dy = old - el.getBoundingClientRect().top;
    if (!dy) continue;
    el.animate([{ transform: `translateY(${dy}px)` }, { transform: 'translateY(0)' }], {
      duration: 220,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    });
  }
}
