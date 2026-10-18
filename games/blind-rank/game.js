import { h, seededRandom, shuffle } from 'engine/util.js';
import { pips, toneOf, tag } from 'engine/ui.js';
import puzzles from './puzzles.js';

const TIERS = ['S', 'A', 'B', 'C', 'D', 'F'];
// There's no right answer, so this measures taste: how close your tiers sit to everyone's.
// Within half a tier of the crowd's average counts as fully in sync; three tiers off as zero.
const syncOf = (diff) => Math.max(0, 1 - Math.max(0, diff - 0.5) / 2.5);
const markOf = (diff) => (diff <= 0.5 ? '🟩' : diff <= 1.5 ? '🟨' : '🟥');

export default {
  id: 'blind-rank',
  howTo: [
    'Ten things show up one at a time. You can’t see what’s coming next.',
    'Drop each one into a tier, from S (the best) to F (the worst), before the next one appears.',
    'No take-backs. Once it’s placed, it stays.',
    'There’s no right answer. At the end you’ll see how your taste compares with everyone else’s.',
  ],
  ranks: [
    { min: 0.88, title: 'Hivemind' },
    { min: 0.76, title: 'Crowd Pleaser' },
    { min: 0.62, title: 'Independent Thinker' },
    { min: 0.48, title: 'Contrarian' },
    { min: 0, title: 'Chaos Agent' },
  ],
  puzzles,
  mount,
};

function mount(root, ctx) {
  const { topic, items } = ctx.puzzle;
  const byId = Object.fromEntries(items.map((it) => [it.id, it]));
  const order = shuffle(items.map((it) => it.id), seededRandom(ctx.seed)); // reveal order
  const state = ctx.saved ?? { place: {}, crowd: null };
  const placedCount = () => Object.keys(state.place).length;
  const placedIn = (ti, where = state.place) => order.filter((id) => where[id] === ti).map((id) => byId[id]);
  render();

  function render() {
    root.replaceChildren(ctx.done ? review() : play());
  }

  function play() {
    const n = placedCount();
    const current = byId[order[n]];
    return h(
      'div',
      { class: 'stack' },
      h(
        'div',
        { class: 'q-head' },
        h('p', { class: 'theme' }, 'Tier: ', h('span', { class: 'hl' }, topic)),
        pips(order.map((_, k) => (k < n ? 'good' : k === n ? 'current' : 'todo'))),
      ),
      h(
        'div',
        { class: 'reveal-card' },
        tag(`${n + 1} of ${items.length}`),
        h('span', { class: 'reveal-emoji', 'aria-hidden': 'true' }, current.emoji),
        h('p', { class: 'reveal-name' }, current.name),
        h('p', { class: 'hint' }, n === 0 ? 'Which tier? Tap one.' : 'No take-backs. Tap a tier.'),
      ),
      h(
        'div',
        { class: 'tiers' },
        TIERS.map((t, ti) =>
          h(
            'button',
            {
              class: `tier tier-${t.toLowerCase()}`,
              type: 'button',
              'aria-label': `Put ${current.name} in ${t} tier`,
              onClick: () => place(current.id, ti),
            },
            h('span', { class: 'tier-label' }, t),
            h('span', { class: 'tier-items' }, placedIn(ti).map((it) => chip(it))),
          ),
        ),
      ),
      n < items.length - 1 && h('p', { class: 'hint upcoming' }, `Still hidden: ${items.length - n - 1} more`),
    );
  }

  function chip(it, mark) {
    return h(
      'span',
      { class: 'item', 'data-key': it.id },
      h('span', { class: 'item-emoji', 'aria-hidden': 'true' }, it.emoji),
      it.name,
      mark && h('span', { class: `item-mark is-${toneOf(mark)}`, title: 'How close you were to everyone else' }),
    );
  }

  function place(id, ti) {
    if (state.place[id] != null) return;
    state.place[id] = ti;
    ctx.save(state);
    ctx.fx.buzz(8);
    if (placedCount() === items.length) return finish();
    render();
    ctx.fx.pop(root.querySelector(`.item[data-key="${id}"]`));
  }

  async function finish() {
    ctx.crowd.submit('tiers', state.place);
    const crowd = {};
    for (const it of items) crowd[it.id] = await ctx.crowd.get(`item:${it.id}`, it.crowd);
    state.crowd = crowd;

    const diff = (id) => Math.abs(state.place[id] - crowd[id]);
    const pct = items.reduce((sum, it) => sum + syncOf(diff(it.id)), 0) / items.length;
    const sync = Math.round(pct * 100);
    const hottest = items.reduce((a, b) => (diff(b.id) > diff(a.id) ? b : a));
    const grid = TIERS.map((t, ti) => {
      const names = placedIn(ti).map((it) => it.name);
      return names.length ? `${t}: ${names.join(', ')}` : null;
    })
      .filter(Boolean)
      .join('\n');

    ctx.finish(
      {
        pct,
        score: `${sync}% in sync with everyone`,
        line:
          diff(hottest.id) < 1
            ? 'No hot takes today. Your taste is pure hivemind.'
            : `Hottest take: ${hottest.name} in ${TIERS[state.place[hottest.id]]}. Everyone else says ${TIERS[Math.round(crowd[hottest.id])]}.`,
        grid,
        shareLine: `${topic} · ${sync}% in sync`,
      },
      state,
    );
    render();
  }

  function staticTiers(where, withMarks, crowd) {
    return h(
      'div',
      { class: 'tiers is-static' },
      TIERS.map((t, ti) =>
        h(
          'div',
          { class: `tier tier-${t.toLowerCase()}` },
          h('span', { class: 'tier-label' }, t),
          h(
            'span',
            { class: 'tier-items' },
            placedIn(ti, where).map((it) => chip(it, withMarks ? markOf(Math.abs(where[it.id] - crowd[it.id])) : null)),
          ),
        ),
      ),
    );
  }

  function review() {
    const crowd = state.crowd ?? Object.fromEntries(items.map((it) => [it.id, it.crowd]));
    const everyone = Object.fromEntries(items.map((it) => [it.id, Math.min(5, Math.round(crowd[it.id]))]));
    return h(
      'div',
      { class: 'stack' },
      h('h3', { class: 'review-title' }, 'Your list: ', h('span', { class: 'hl' }, topic)),
      staticTiers(state.place, true, crowd),
      h('h3', { class: 'review-title' }, 'Everyone’s list'),
      staticTiers(everyone, false, crowd),
      h('p', { class: 'hint' }, 'Dots on your list: green = same as everyone, yellow = one tier off, red = a hot take.'),
      ctx.sampleNote(),
    );
  }
}
