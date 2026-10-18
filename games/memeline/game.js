import { h, seededRandom, shuffle, flip, fromHTML } from 'engine/util.js';
import { icons } from 'engine/icons.js';
import { doodle } from 'engine/doodles.js';
import { tag } from 'engine/ui.js';
import puzzles from './puzzles.js';

const MAX_TRIES = 3;
const SCORE_BY_TRY = [1, 0.7, 0.45];
const markOf = (right) => (right ? '🟩' : '⬛');
// [doodle, hue] for memes that don't have a photo yet
const KIND_LOOK = {
  'TikTok sound': ['note', 355],
  'TikTok trend': ['play', 200],
  'viral clip': ['play', 30],
  'reaction image': ['polaroid', 95],
  'classic meme': ['polaroid', 58],
  'celebrity moment': ['star', 95],
  'Twitter moment': ['bubble', 245],
  slang: ['bubble', 150],
  default: ['polaroid', 58],
};

export default {
  id: 'memeline',
  howTo: [
    'Five memes and internet moments. Put them in order of when they went viral, oldest at the top.',
    'Drag the handle, or use the arrows, to move cards around.',
    'Check your order: green means right spot, black means wrong spot.',
    'You get three tries.',
  ],
  ranks: [
    { min: 0.95, title: 'Time Lord' },
    { min: 0.65, title: 'Historian' },
    { min: 0.4, title: 'Time Traveler' },
    { min: 0, title: 'Lost in Time' },
  ],
  puzzles,
  mount,
};

function mount(root, ctx) {
  const events = ctx.puzzle.events;
  const byId = Object.fromEntries(events.map((e) => [e.id, e]));
  const correct = [...events].sort((a, b) => a.year - b.year).map((e) => e.id);
  const state = ctx.saved ?? { order: startOrder(), tries: [] };
  render();

  function startOrder() {
    const rand = seededRandom(ctx.seed);
    let order;
    do order = shuffle(correct, rand);
    while (order.filter((id, i) => id === correct[i]).length > 1);
    return order;
  }

  const rightOf = (order) => order.map((id, i) => id === correct[i]);

  // A real photo when we have a freely licensed one; otherwise a drawn card for the kind of meme.
  function photo(e, big = false) {
    if (e.img) return h('span', { class: big ? 'snap snap-big' : 'snap' }, h('img', { src: e.img, alt: '', loading: 'lazy', decoding: 'async' }));
    const [glyph, hue] = KIND_LOOK[e.kind] || KIND_LOOK.default;
    return h('span', { class: `snap is-card${big ? ' snap-big' : ''}`, style: `--kh:${hue}` }, fromHTML(doodle(glyph)));
  }

  function render() {
    root.replaceChildren(ctx.done ? review() : play());
  }

  function play() {
    const last = state.tries[state.tries.length - 1];
    const unchanged = last && last.order.join() === state.order.join();
    return h(
      'div',
      { class: 'stack' },
      h(
        'div',
        { class: 'q-head' },
        tag(`Try ${state.tries.length + 1} of ${MAX_TRIES}`),
        state.tries.length > 0 &&
          h('div', { class: 'tries', 'aria-label': 'Previous tries' }, state.tries.map((t) => h('span', {}, t.right.map(markOf).join('')))),
      ),
      h(
        'div',
        { class: 'timeline' },
        h('span', { class: 'end-label' }, 'oldest'),
        h('ol', { class: 'events' }, state.order.map((id, i) => eventCard(id, i, unchanged ? last.right[i] : null))),
        h('span', { class: 'end-label' }, 'newest'),
      ),
      h(
        'button',
        { class: 'btn btn-primary btn-big', type: 'button', disabled: !!unchanged, onClick: check },
        unchanged ? 'Move something, then check again' : 'Check order',
      ),
    );
  }

  function eventCard(id, i, right) {
    const e = byId[id];
    const tone = right == null ? '' : right ? ' is-good' : ' is-off';
    const card = h(
      'li',
      { class: `event${tone}`, 'data-key': id },
      h('span', {
        class: 'grip',
        html: icons.grip,
        title: 'Drag to move',
        'aria-hidden': 'true',
        onPointerdown: (ev) => startDrag(ev, card, i),
      }),
      photo(e),
      h(
        'span',
        { class: 'event-main' },
        h('span', { class: 'event-text' }, e.text),
        right != null && h('span', { class: 'event-mark' }, right ? 'Right spot' : 'Wrong spot'),
      ),
      h(
        'span',
        { class: 'event-moves' },
        h('button', { class: 'move', type: 'button', 'aria-label': `Move earlier: ${e.text}`, disabled: i === 0, html: icons.up, onClick: () => move(i, -1) }),
        h('button', {
          class: 'move',
          type: 'button',
          'aria-label': `Move later: ${e.text}`,
          disabled: i === state.order.length - 1,
          html: icons.down,
          onClick: () => move(i, 1),
        }),
      ),
    );
    return card;
  }

  function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= state.order.length) return;
    const id = state.order[i];
    flip(root, '.event', () => {
      [state.order[i], state.order[j]] = [state.order[j], state.order[i]];
      ctx.save(state);
      render();
    });
    const buttons = root.querySelectorAll(`[data-key="${id}"] .move`);
    const preferred = buttons[dir < 0 ? 0 : 1];
    (preferred?.disabled ? buttons[dir < 0 ? 1 : 0] : preferred)?.focus();
  }

  function startDrag(ev, card, from) {
    if (ev.button !== 0) return;
    ev.preventDefault();
    const handle = ev.currentTarget;
    const cards = [...root.querySelectorAll('.event')];
    const rects = cards.map((c) => c.getBoundingClientRect());
    const gap = rects.length > 1 ? rects[1].top - rects[0].bottom : 10;
    const size = rects[from].height + gap;
    const startY = ev.clientY;
    let to = from;

    handle.setPointerCapture(ev.pointerId);
    card.classList.add('is-dragging');

    const onMove = (e) => {
      const dy = e.clientY - startY;
      card.style.transform = `translateY(${dy}px) rotate(-1.5deg)`;
      const center = rects[from].top + rects[from].height / 2 + dy;
      to = rects.reduce((n, r, k) => (k !== from && center > r.top + r.height / 2 ? n + 1 : n), 0);
      cards.forEach((c, k) => {
        if (k === from) return;
        const shift = from < to && k > from && k <= to ? -size : to < from && k >= to && k < from ? size : 0;
        c.style.transform = shift ? `translateY(${shift}px)` : '';
      });
    };
    const onUp = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', onUp);
      handle.removeEventListener('pointercancel', onUp);
      flip(root, '.event', () => {
        if (to !== from) {
          const [id] = state.order.splice(from, 1);
          state.order.splice(to, 0, id);
          ctx.save(state);
          ctx.fx.buzz(8);
        }
        render();
      });
    };
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', onUp);
    handle.addEventListener('pointercancel', onUp);
  }

  function check() {
    const right = rightOf(state.order);
    state.tries.push({ order: [...state.order], right });
    ctx.save(state);
    const win = right.every(Boolean);
    if (win || state.tries.length >= MAX_TRIES) return finish(win);
    render();
    ctx.toast(`${right.filter(Boolean).length} of ${events.length} in the right spot`);
    ctx.fx.shake(root.querySelector('.events'));
  }

  function finish(win) {
    const n = state.tries.length;
    ctx.finish(
      {
        pct: win ? SCORE_BY_TRY[n - 1] : 0,
        score: win ? `Solved in ${n} ${n === 1 ? 'try' : 'tries'}` : 'Not solved this time',
        line: win ? null : 'So close. Here’s the real order.',
        grid: state.tries.map((t) => t.right.map(markOf).join('')).join('\n'),
        shareLine: `${win ? n : 'X'}/${MAX_TRIES}`,
      },
      state,
    );
    render();
  }

  function review() {
    return h(
      'div',
      { class: 'stack' },
      h('h3', { class: 'review-title' }, 'The real order'),
      h(
        'ol',
        { class: 'gallery' },
        correct.map((id, k) => {
          const e = byId[id];
          return h(
            'li',
            { class: 'gallery-item' },
            photo(e, true),
            h(
              'span',
              { class: 'gallery-text' },
              h('span', { class: 'event-year' }, e.when),
              h('span', { class: 'event-text' }, e.text),
              e.quote && !e.text.includes(e.quote.replace(/["“”]/g, '').slice(0, 12)) && h('span', { class: 'quote' }, e.quote),
              h(
                'span',
                { class: 'gallery-meta' },
                e.kind && e.kind !== 'big moment' && h('span', { class: 'kind' }, e.kind),
                e.link && h('a', { class: 'watch', href: e.link, target: '_blank', rel: 'noopener noreferrer' }, 'See the original ↗'),
              ),
              e.credit && h('span', { class: 'credit' }, e.credit),
            ),
          );
        }),
      ),
    );
  }
}
