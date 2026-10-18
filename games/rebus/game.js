import { h, normalize } from 'engine/util.js';
import { pips, toneOf, tag } from 'engine/ui.js';
import puzzles from './puzzles.js';

const MAX_TRIES = 3;
const POINTS = [100, 60, 30]; // solved on try 1, 2, 3
const MARKS = ['🟩', '🟨', '🟧'];
const markOf = (solvedOn) => (solvedOn >= 0 ? MARKS[solvedOn] : '🟥');
const pointsOf = (solvedOn) => (solvedOn >= 0 ? POINTS[solvedOn] : 0);

export default {
  id: 'rebus',
  howTo: [
    'Say the emoji out loud. Their SOUNDS spell the answer: 🥧 + 🐀 = pie-rat = Pirate.',
    'Every day has a theme, and the boxes show how many letters.',
    'Each wrong guess reveals more letters. You get three tries.',
    'First try is worth 100, then 60, then 30.',
  ],
  ranks: [
    { min: 0.9, title: 'Rebus Royalty' },
    { min: 0.7, title: 'Puzzle Pro' },
    { min: 0.5, title: 'Getting There' },
    { min: 0.3, title: 'Emoji Confused' },
    { min: 0, title: 'Lost in Translation' },
  ],
  puzzles,
  mount,
};

function mount(root, ctx) {
  const { theme, clues } = ctx.puzzle;
  // misses[k] = wrong guesses; solved[k] = try it was solved on, -1 if failed, null if open
  const state = ctx.saved ?? { i: 0, misses: clues.map(() => []), solved: clues.map(() => null) };
  render();

  function render() {
    root.replaceChildren(ctx.done ? review() : play());
    root.querySelector('.field')?.focus({ preventScroll: true });
  }

  function play() {
    const k = state.i;
    const clue = clues[k];
    const over = state.solved[k] !== null;
    const misses = state.misses[k];
    return h(
      'div',
      { class: 'stack' },
      h(
        'div',
        { class: 'q-head' },
        h('p', { class: 'theme' }, 'Theme: ', h('span', { class: 'hl' }, theme)),
        pips(clues.map((_, j) => (state.solved[j] !== null ? toneOf(markOf(state.solved[j])) : j === k ? 'current' : 'todo'))),
      ),
      h(
        'div',
        { class: over ? 'rebus-card' : 'rebus-card is-new' },
        tag(`${k + 1} of ${clues.length}`),
        h('p', { class: 'rebus-emoji', 'aria-label': `Emoji clue: ${clue.emoji}` }, clue.emoji),
        h('p', { class: 'hint rebus-say' }, 'Say it out loud…'),
      ),
      tiles(clue.answer, over ? 'all' : misses.length),
      misses.length > 0 && h('ul', { class: 'misses', 'aria-label': 'Wrong guesses' }, misses.map((m) => h('li', { class: 'miss' }, m))),
      over ? resultBlock(k) : guessForm(k),
    );
  }

  /** How many letter boxes a phrase fills (spaces and punctuation don't count). */
  function letterCount(text) {
    return text.toUpperCase().normalize('NFD').replace(/[^A-Z0-9]/g, '').length;
  }

  /** Letter boxes. reveal: 0 = blank, 1 = first letters, 2 = first + last letters, 'all' = whole answer. */
  function tiles(answer, reveal) {
    const words = answer.toUpperCase().split(' ');
    return h(
      'div',
      { class: 'tiles', 'aria-hidden': 'true' },
      words.map((w) => {
        const letters = [...w].filter((ch) => /[A-Z0-9]/.test(ch));
        return h(
          'span',
          { class: 'tile-word' },
          letters.map((ch, n) => {
            const show = reveal === 'all' || (reveal >= 1 && n === 0) || (reveal >= 2 && n === letters.length - 1);
            return h('span', { class: show ? 'tile is-shown' : 'tile' }, show ? ch : '');
          }),
        );
      }),
    );
  }

  function guessForm(k) {
    const input = h('input', {
      class: 'field',
      type: 'text',
      autocomplete: 'off',
      autocapitalize: 'off',
      spellcheck: 'false',
      enterkeyhint: 'go',
      placeholder: 'Your answer',
      'aria-label': 'Your answer',
    });
    const left = MAX_TRIES - state.misses[k].length;
    return h(
      'div',
      { class: 'stack' },
      h(
        'form',
        {
          class: 'answer-row',
          onSubmit: (e) => {
            e.preventDefault();
            guess(k, input.value, input);
          },
        },
        input,
        h('button', { class: 'btn btn-primary', type: 'submit' }, 'Guess'),
      ),
      h(
        'div',
        { class: 'rebus-foot' },
        h('span', { class: 'hint' }, `${left} ${left === 1 ? 'try' : 'tries'} left`),
        h('button', { class: 'btn-link', type: 'button', onClick: () => giveUp(k) }, 'Give up'),
      ),
    );
  }

  function guess(k, value, input) {
    const clue = clues[k];
    const typed = normalize(value);
    if (!typed) return ctx.fx.shake(input);
    if (state.misses[k].some((m) => normalize(m) === typed)) {
      ctx.toast('You already tried that');
      return ctx.fx.shake(input);
    }
    if ([clue.answer, ...(clue.alt || [])].some((a) => normalize(a) === typed)) {
      state.solved[k] = state.misses[k].length;
      ctx.save(state);
      render();
      ctx.fx.pop(root.querySelector('.tiles'));
      ctx.fx.buzz([10, 30, 10]);
      return;
    }
    // a guess that doesn't fit the boxes doesn't cost a try
    const need = letterCount(clue.answer);
    const got = letterCount(value);
    if (got !== need) {
      ctx.toast(`The answer has ${need} letters, you typed ${got}`);
      return ctx.fx.shake(input);
    }
    state.misses[k].push(value.trim());
    if (state.misses[k].length >= MAX_TRIES) state.solved[k] = -1;
    ctx.save(state);
    render();
    if (state.solved[k] === null) {
      ctx.fx.shake(root.querySelector('.tiles'));
      ctx.toast('Not quite. Here’s another letter.');
    }
  }

  function giveUp(k) {
    state.solved[k] = -1;
    ctx.save(state);
    render();
  }

  function resultBlock(k) {
    const s = state.solved[k];
    const clue = clues[k];
    const last = k === clues.length - 1;
    return h(
      'div',
      { class: 'stack reveal' },
      h(
        'div',
        { class: 'callout' },
        h('p', { class: 'callout-title' }, s === 0 ? 'First try!' : s > 0 ? 'Got it!' : 'The answer was…'),
        h('p', { class: 'rebus-answer' }, clue.answer),
        clue.how && h('p', { class: 'hint' }, `Say it: ${clue.how}`),
        h('span', { class: `chip rebus-points is-${toneOf(markOf(s))}` }, `+${pointsOf(s)} points`),
      ),
      h(
        'button',
        { class: 'btn btn-primary btn-big', type: 'button', onClick: () => (last ? finish() : next()) },
        last ? 'See my results' : 'Next puzzle →',
      ),
    );
  }

  function next() {
    state.i += 1;
    ctx.save(state);
    render();
  }

  function finish() {
    const total = state.solved.reduce((sum, s) => sum + pointsOf(s), 0);
    const max = clues.length * POINTS[0];
    const firstTry = state.solved.filter((s) => s === 0).length;
    ctx.finish(
      {
        pct: total / max,
        score: `${total} / ${max} points`,
        line: firstTry ? `${firstTry} on the first try` : null,
        grid: state.solved.map(markOf).join(''),
        shareLine: `${theme} · ${total}/${max}`,
      },
      state,
    );
    render();
  }

  function review() {
    return h(
      'div',
      { class: 'stack' },
      h('h3', { class: 'review-title' }, 'Today’s puzzles: ', h('span', { class: 'hl' }, theme)),
      h(
        'ul',
        { class: 'review' },
        clues.map((c, k) =>
          h(
            'li',
            { class: 'review-item' },
            h(
              'span',
              { class: 'review-main' },
              h('span', { class: 'review-text' }, `${c.emoji}  =  ${c.answer}`),
              c.how && h('span', { class: 'review-sub' }, c.how),
            ),
            h('span', { class: `chip is-${toneOf(markOf(state.solved[k]))}` }, pointsOf(state.solved[k])),
          ),
        ),
      ),
    );
  }
}
