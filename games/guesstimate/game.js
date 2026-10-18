import { h, formatNumber, parseNumber } from 'engine/util.js';
import { pips, toneOf, tag } from 'engine/ui.js';
import puzzles from './puzzles.js';

const MAX_GUESSES = 3;
const MAX = 100;
// Distance is measured as a ratio, so being off by 2× costs the same for 10 or 10,000.
const errorOf = (guess, answer) => Math.abs(Math.log10(guess / answer));
const isExact = (guess, answer) => Math.abs(guess - answer) < 1e-9;
const HEAT = [
  [Math.log10(1.05), 'So close!', 'good'], // within 5%
  [Math.log10(1.15), 'Hot', 'close'],
  [Math.log10(1.4), 'Warm', 'close'],
  [Infinity, 'Cold', 'bad'],
];
const heatOf = (err) => HEAT.find(([max]) => err <= max);
// Only the exact answer earns 100 (a bullseye). A near miss tops out at 95.
const pointsFor = (err) => (err === 0 ? MAX : Math.min(95, Math.max(0, Math.round(MAX * (1 - err / 0.7)))));
// The key is all or nothing: 🎯 for the exact answer, ❌ for anything else.
const markFor = (pts) => (pts === MAX ? '🎯' : '❌');

/** 2500000000 → "2.5 billion", 450312500 → "450,312,500". */
function big(n) {
  for (const [size, word] of [[1e9, 'billion'], [1e6, 'million']]) {
    const x = n / size;
    if (n >= size && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6) return `${formatNumber(x)} ${word}`;
  }
  return formatNumber(n);
}
const amount = (n, unit) => (unit === 'dollars' ? `$${big(n)}` : `${big(n)} ${unit}`);

export default {
  id: 'guesstimate',
  howTo: [
    'Five questions a day. Every answer is a number.',
    'You get three guesses each. After every guess we tell you higher or lower, and how close you are.',
    'Your closest guess scores up to 95 points. Hit the exact number for a bullseye: 100.',
    'Shortcuts work: 1.2k, 3m, 2 billion.',
  ],
  ranks: [
    { min: 0.9, title: 'Human Calculator' },
    { min: 0.75, title: 'Sharp Estimator' },
    { min: 0.55, title: 'Ballpark Pro' },
    { min: 0.35, title: 'Wild Guesser' },
    { min: 0, title: 'Vibes Only' },
  ],
  puzzles,
  mount,
};

function mount(root, ctx) {
  const qs = ctx.puzzle.questions;
  const state = ctx.saved ?? { i: 0, guesses: qs.map(() => []) };
  const bestErr = (k) =>
    Math.min(...state.guesses[k].map((g) => (isExact(g, qs[k].answer) ? 0 : errorOf(g, qs[k].answer))));
  const isResolved = (k) => state.guesses[k].length >= MAX_GUESSES || bestErr(k) === 0;
  const pointsAt = (k) => pointsFor(bestErr(k));
  render();

  function render() {
    root.replaceChildren(ctx.done ? review() : play());
    if (!ctx.done && !isResolved(state.i)) root.querySelector('.field')?.focus({ preventScroll: true });
  }

  function play() {
    const k = state.i;
    const q = qs[k];
    const resolved = isResolved(k);
    return h(
      'div',
      { class: 'stack' },
      h(
        'div',
        { class: 'q-head' },
        tag(`Question ${k + 1} of ${qs.length}`),
        pips(qs.map((_, j) => (j < k || (j === k && resolved) ? toneOf(markFor(pointsAt(j))) : j === k ? 'current' : 'todo'))),
      ),
      h(
        'div',
        { class: resolved ? 'q-card' : 'q-card is-new' },
        h('p', { class: 'prompt' }, q.q),
        h('p', { class: 'unit' }, 'Answer in ', h('span', { class: 'hl' }, q.unit)),
      ),
      state.guesses[k].length > 0 &&
        h(
          'ol',
          { class: 'guesses', 'aria-label': 'Your guesses' },
          state.guesses[k].map((g, n) => {
            const exact = isExact(g, q.answer);
            const [, word, tone] = exact ? [0, 'Bullseye!', 'exact'] : heatOf(errorOf(g, q.answer));
            return h(
              'li',
              { class: `guess-row${n === state.guesses[k].length - 1 ? ' is-latest' : ''}` },
              h('span', { class: 'guess-num' }, amount(g, q.unit)),
              h('span', { class: `chip is-${tone}` }, word),
              !exact && h('span', { class: 'chip dir' }, g < q.answer ? '↑ Higher' : '↓ Lower'),
            );
          }),
        ),
      resolved ? answerReveal(k) : guessForm(k),
    );
  }

  function guessForm(k) {
    const input = h('input', {
      class: 'field',
      type: 'text',
      inputmode: 'decimal',
      autocomplete: 'off',
      enterkeyhint: 'go',
      placeholder: 'Your guess',
      'aria-label': `Your guess in ${qs[k].unit}`,
    });
    const left = MAX_GUESSES - state.guesses[k].length;
    return h(
      'form',
      {
        class: 'stack guess-form',
        onSubmit: (e) => {
          e.preventDefault();
          const value = parseNumber(input.value);
          if (!Number.isFinite(value) || value <= 0) {
            ctx.fx.shake(input);
            ctx.toast('Type a number bigger than 0');
            return;
          }
          state.guesses[k].push(value);
          ctx.save(state);
          render();
          if (isExact(value, qs[k].answer)) {
            ctx.fx.buzz([10, 30, 10]);
            ctx.fx.confetti({ count: 60, duration: 1200 });
          }
        },
      },
      h('div', { class: 'answer-row' }, input, h('button', { class: 'btn btn-primary', type: 'submit' }, 'Guess')),
      h('p', { class: 'hint guesses-left' }, `${left} ${left === 1 ? 'guess' : 'guesses'} left`),
    );
  }

  function answerReveal(k) {
    const q = qs[k];
    const pts = pointsAt(k);
    const last = k === qs.length - 1;
    return h(
      'div',
      { class: 'stack reveal' },
      h(
        'div',
        { class: 'callout' },
        h('p', { class: 'hint' }, pts === MAX ? 'Bullseye! The exact answer:' : 'The real answer:'),
        h('p', { class: 'answer-big' }, amount(q.answer, q.unit)),
        h('p', { class: 'fact' }, q.fact),
        h('span', { class: `chip answer-points is-${toneOf(markFor(pts))}` }, `+${pts} points`),
      ),
      h(
        'button',
        { class: 'btn btn-primary btn-big', type: 'button', onClick: () => (last ? finish() : next()) },
        last ? 'See my results' : 'Next question →',
      ),
    );
  }

  function next() {
    state.i += 1;
    ctx.save(state);
    render();
  }

  function finish() {
    const pts = qs.map((_, k) => pointsAt(k));
    const total = pts.reduce((a, b) => a + b, 0);
    const max = qs.length * MAX;
    const bulls = pts.filter((p) => p === MAX).length;
    ctx.finish(
      {
        pct: total / max,
        score: `${total} / ${max} points`,
        line: bulls ? `${bulls} exact bullseye${bulls === 1 ? '' : 's'} 🎯` : null,
        grid: pts.map(markFor).join(''),
        shareLine: `${total}/${max}`,
      },
      state,
    );
    render();
  }

  function review() {
    return h(
      'div',
      { class: 'stack' },
      h('h3', { class: 'review-title' }, 'Today’s numbers'),
      h(
        'ul',
        { class: 'review' },
        qs.map((q, k) => {
          if (!state.guesses[k].length) return null;
          const best = state.guesses[k].reduce((a, b) => (errorOf(b, q.answer) < errorOf(a, q.answer) ? b : a));
          const pts = pointsAt(k);
          return h(
            'li',
            { class: 'review-item' },
            h(
              'span',
              { class: 'review-main' },
              h('span', { class: 'review-text' }, q.q),
              h('span', { class: 'review-sub' }, `Answer: ${amount(q.answer, q.unit)} · your best: ${amount(best, q.unit)}`),
            ),
            h('span', { class: `chip is-${toneOf(markFor(pts))}` }, pts),
          );
        }),
      ),
    );
  }
}
