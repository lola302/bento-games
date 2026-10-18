import { h, normalize, formatNumber } from 'engine/util.js';
import { tag } from 'engine/ui.js';
import puzzles from './puzzles.js';

const POINTS = { common: 10, uncommon: 25, rare: 50 };
const LABEL = { common: '', uncommon: 'nice one', rare: 'deep cut!' };
const RANKS = [
  { min: 0.8, title: 'Human Lightning' },
  { min: 0.62, title: 'Thunderstruck' },
  { min: 0.46, title: 'Power Surge' },
  { min: 0.32, title: 'Live Wire' },
  { min: 0.18, title: 'Spark' },
  { min: 0.08, title: 'Static Cling' },
  { min: 0, title: 'Low Battery' },
];

const clock = (ms) => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

export default {
  id: 'blitz',
  howTo: [
    'One category a day and a ticking clock.',
    'Type as many answers as you can. Each one pops in the moment you spell it right.',
    'Obvious answers are worth 10 volts. Rarer ones 25. Deep cuts 50.',
    'Your total puts you on the voltage ladder, from Low Battery to Human Lightning.',
  ],
  ranks: RANKS,
  puzzles,
  mount,
};

function mount(root, ctx) {
  const { category, seconds, note } = ctx.puzzle;
  const tier = (name) => (ctx.puzzle.rare?.includes(name) ? 'rare' : ctx.puzzle.uncommon?.includes(name) ? 'uncommon' : 'common');
  const answers = ctx.puzzle.answers.map((a) => {
    const ans = typeof a === 'string' ? { a, alt: [] } : { alt: [], ...a };
    return { ...ans, tier: tier(ans.a) };
  });
  const maxVolts = answers.reduce((sum, a) => sum + POINTS[a.tier], 0);
  const lookup = new Map();
  answers.forEach((ans, idx) => [ans.a, ...ans.alt].forEach((name) => lookup.set(normalize(name), idx)));
  const state = ctx.saved ?? { startedAt: null, found: [] };
  const volts = () => state.found.reduce((sum, idx) => sum + POINTS[answers[idx].tier], 0);
  const remaining = () => seconds * 1000 - (Date.now() - state.startedAt);
  let timer = null;
  let els = null;
  render();

  function render() {
    clearInterval(timer);
    if (ctx.done) return root.replaceChildren(review());
    if (state.startedAt == null) return root.replaceChildren(intro());
    if (remaining() <= 0) return finish();
    root.replaceChildren(running());
    els.input.focus({ preventScroll: true });
    timer = setInterval(tick, 100);
    tick();
  }

  function intro() {
    return h(
      'div',
      { class: 'stack intro' },
      tag('Today’s category'),
      h('h2', { class: 'intro-title' }, h('span', { class: 'hl' }, category)),
      note && h('p', { class: 'hint' }, note),
      h(
        'ul',
        { class: 'intro-facts' },
        h('li', {}, h('b', {}, seconds), ' seconds'),
        h('li', {}, h('b', {}, answers.length), ' answers'),
        h('li', {}, h('b', {}, formatNumber(maxVolts)), ' volts up for grabs'),
      ),
      h('p', { class: 'hint' }, 'Answers pop in as soon as you spell one right. No need to press Enter.'),
      h(
        'button',
        {
          class: 'btn btn-primary btn-big',
          type: 'button',
          onClick: () => {
            state.startedAt = Date.now();
            ctx.save(state);
            render();
          },
        },
        'Start the clock',
      ),
    );
  }

  function running() {
    els = {
      time: h('span', { class: 'time-left', 'aria-hidden': 'true' }),
      fill: h('div', { class: 'time-fill' }),
      volts: h('span', { class: 'volts' }, `${formatNumber(volts())}`),
      count: h('span', { class: 'found-count' }, `${state.found.length} / ${answers.length} found`),
      list: h('ul', { class: 'found-list', 'aria-live': 'polite' }, [...state.found].reverse().map((idx) => foundChip(idx))),
      input: h('input', {
        class: 'field blitz-input',
        type: 'text',
        autocomplete: 'off',
        autocapitalize: 'off',
        autocorrect: 'off',
        spellcheck: 'false',
        enterkeyhint: 'done',
        placeholder: 'Start typing…',
        'aria-label': `Name ${category}`,
        onInput: onType,
      }),
    };
    els.bar = h('div', { class: 'time-bar', role: 'progressbar', 'aria-label': 'Time left' }, els.fill);
    return h(
      'div',
      { class: 'stack' },
      h(
        'div',
        { class: 'blitz-top' },
        h('div', { class: 'meter-volts' }, h('p', { class: 'hint' }, category), h('p', {}, els.volts, h('span', { class: 'volts-unit' }, ' volts')), els.count),
        els.time,
      ),
      els.bar,
      h(
        'form',
        {
          onSubmit: (e) => {
            e.preventDefault();
            const key = normalize(els.input.value);
            if (!key) return;
            if (lookup.has(key) && state.found.includes(lookup.get(key))) ctx.toast('Already got that one');
            else ctx.fx.shake(els.input);
          },
        },
        els.input,
      ),
      els.list,
      h('button', { class: 'btn-link', type: 'button', onClick: () => finish() }, 'I’m done'),
    );
  }

  function foundChip(idx, fresh = false) {
    const a = answers[idx];
    return h(
      'li',
      { class: `chip found tier-${a.tier}${fresh ? ' is-new' : ''}` },
      a.a,
      h('span', { class: 'chip-pts' }, `+${POINTS[a.tier]}`),
    );
  }

  function onType(e) {
    const key = normalize(e.target.value);
    if (!lookup.has(key)) return;
    const idx = lookup.get(key);
    if (state.found.includes(idx)) return;
    state.found.push(idx);
    ctx.save(state);
    e.target.value = '';
    const a = answers[idx];
    els.volts.textContent = formatNumber(volts());
    els.count.textContent = `${state.found.length} / ${answers.length} found`;
    ctx.fx.pop(els.volts);
    els.list.prepend(foundChip(idx, true));
    if (a.tier === 'rare') ctx.toast(`Deep cut! +${POINTS.rare} volts`, 1100);
    ctx.fx.buzz(a.tier === 'rare' ? [10, 30, 10] : 8);
    if (state.found.length === answers.length) finish();
  }

  function tick() {
    if (!els?.time.isConnected) return clearInterval(timer);
    const ms = remaining();
    els.time.textContent = clock(ms);
    els.fill.style.transform = `scaleX(${Math.max(0, ms / (seconds * 1000))})`;
    els.bar.classList.toggle('is-low', ms < 10000);
    els.bar.setAttribute('aria-valuenow', String(Math.max(0, Math.ceil(ms / 1000))));
    if (ms <= 0) finish();
  }

  function finish() {
    clearInterval(timer);
    if (ctx.done) return;
    const v = volts();
    const pct = v / maxVolts;
    const deep = state.found.filter((idx) => answers[idx].tier === 'rare').length;
    const filled = Math.round(pct * 10);
    ctx.finish(
      {
        pct,
        score: `${formatNumber(v)} volts`,
        line: `${state.found.length} of ${answers.length} found${deep ? ` · ${deep} deep cut${deep === 1 ? '' : 's'}` : ''}`,
        grid: '⚡'.repeat(filled) + '▫️'.repeat(10 - filled),
        shareLine: `${category}: ${formatNumber(v)}V · ${state.found.length}/${answers.length}${deep ? ` · ${deep} deep cuts` : ''}`,
      },
      state,
    );
    render();
  }

  function review() {
    const found = new Set(state.found);
    const v = volts();
    const mine = RANKS.findIndex((r) => v / maxVolts >= r.min);
    return h(
      'div',
      { class: 'stack' },
      h('h3', { class: 'review-title' }, 'The voltage ladder'),
      h(
        'ol',
        { class: 'ladder' },
        RANKS.map((r, i) =>
          h(
            'li',
            { class: i === mine ? 'rung is-you' : 'rung' },
            h('span', { class: 'rung-title' }, r.title),
            h('span', { class: 'rung-volts' }, i === mine ? `you: ${formatNumber(v)}V` : `${formatNumber(Math.ceil(r.min * maxVolts))}V+`),
          ),
        ),
      ),
      h('h3', { class: 'review-title' }, `All ${answers.length} answers`),
      h('p', { class: 'hint' }, 'Green = you got it. Starred = deep cut (50 volts).'),
      h(
        'ul',
        { class: 'answer-grid' },
        answers.map((ans, idx) =>
          h('li', { class: `ans${found.has(idx) ? ' is-found' : ''}` }, ans.tier === 'rare' ? `★ ${ans.a}` : ans.a),
        ),
      ),
    );
  }
}
