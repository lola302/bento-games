// Builds a creation (a burger) out of cut-out photos so it looks like ONE squished burger, not a
// tower of separate photos. Tricks:
//   - toppings are flattened (k < 1): real burgers are pressed together
//   - each layer tucks into the one below; `cover` says how much of a layer the next one may hide,
//     so even thin toppings keep a visible sliver
//   - lettuce and cheese are wider than the bun so their edges stick out
//   - a soft contact shadow under every layer ties them together
import { h } from 'engine/util.js';

export function stack(theme, ids, { build = false } = {}) {
  const info = (id) => theme.items[id] || theme.parts[id];
  const src = (id) => `${theme.dir}/${info(id).img || id}.webp`;
  const fillings = [theme.base.main, ...ids].sort((x, y) => info(x).order - info(y).order);
  const layers = [theme.base.bottom, ...fillings, theme.base.top];

  let total = 0;
  let widest = 1;
  let below = null; // height and cover of the layer underneath
  const imgs = layers.map((id, i) => {
    const it = info(id);
    const k = it.k ?? 1;
    const height = it.ratio * it.w * k; // shown height, as a fraction of the stack's width
    // tuck into the layer below, but only as far as that layer allows, so it always shows a sliver
    const sink = below ? below.height * below.cover : 0;
    below = { height, cover: it.cover ?? 0.4 };
    total += height - sink;
    widest = Math.max(widest, it.w);
    return h('img', {
      class: build ? 'ob-layer is-build' : 'ob-layer',
      src: src(id),
      alt: '',
      draggable: 'false',
      style: `width:${it.w * 100}%;aspect-ratio:1 / ${it.ratio * k};margin-bottom:${-sink * 100}%;z-index:${i};--i:${i}`,
    });
  });
  const names = ids.map((id) => theme.items[id].name).join(', ');
  return h(
    'div',
    { class: 'ob-stack', style: `--ratio:${total};--widest:${widest}`, role: 'img', 'aria-label': `${theme.noun} with ${names || 'just the patty'}` },
    imgs,
  );
}
