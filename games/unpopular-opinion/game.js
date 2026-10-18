import { h } from 'engine/util.js';
import { pips, toneOf, tag } from 'engine/ui.js';
import puzzles from './puzzles.js';

const MAX = 100; // points per take
const markFor = (diff) => (diff <= 5 ? '🎯' : diff <= 12 ? '🟩' : diff <= 25 ? '🟨' : '🟥');
const pointsFor = (diff) => Math.max(0, MAX - diff * 2);
const verdict = (diff) => (diff <= 5 ? 'Nailed it!' : diff <= 12 ? 'So close.' : diff <= 25 ? 'Not bad.' : 'Way off!');
const majorityOf = (pct) => (pct === 50 ? null : pct > 50 ? 'agree' : 'disagree');
const inMinority = (a) => {
  const m = majorityOf(a.actual);
  return m !== null && a.vote !== m;
};
const SPICE = [
  ['🧈', 'Spice level: zero. You agree with everyone.'],
  ['🌶️', 'Spice level: mild.'],
  ['🌶️', 'Spice level: mild.'],
  ['🌶️🌶️', 'Spice level: spicy.'],
  ['🌶️🌶️', 'Spice level: spicy.'],
  ['🌶️🌶️🌶️', 'Spice level: certified hater.'],
];

export default {
  id: 'unpopular-opinion',
  howTo: [
    'Five takes a day: three on today’s theme, two just for fun. Agree or disagree with each.',
    'Then guess what percent of players agreed.',
    'The closer your guess, the more points, up to 100 per take.',
    'Disagree with the crowd a lot and you get a spicier rating.',
  ],
  ranks: [
    { min: 0.9, title: 'Mind Reader' },
    { min: 0.72, title: 'Room Reader' },
    { min: 0.5, title: 'Vibe Checker' },
    { min: 0.3, title: 'Out of Touch' },
    { min: 0, title: 'Living Under a Rock' },
  ],
  puzzles,
  mount,
};

function mount(root, ctx) {
  const { theme, takes } = ctx.puzzle;
  const state = ctx.saved ?? { i: 0, stage: 'vote', vote: null, guess: 50, answers: [] };
  render();

  function render() {
    root.replaceChildren(ctx.done ? review() : play());
  }

  function play() {
    const take = takes[state.i];
    const step =
      state.stage === 'vote' ? voteStep() : state.stage === 'guess' ? guessStep() : revealStep(state.answers[state.i]);
    return h(
      'div',
      { class: 'stack' },
      h(
        'div',
        { class: 'q-head' },
        h('p', { class: 'theme' }, 'Today: ', h('span', { class: 'hl' }, theme)),
        pips(takes.map((_, k) => (state.answers[k] ? toneOf(state.answers[k].mark) : k === state.i ? 'current' : 'todo'))),
      ),
      h(
        'figure',
        { class: state.stage === 'vote' ? 'note is-new' : 'note' },
        tag(`Take ${state.i + 1} of ${takes.length}`),
        h('blockquote', { class: 'note-text' }, take.text),
      ),
      step,
    );
  }

  function voteStep() {
    const vote = (v) => {
      state.vote = v;
      state.stage = 'guess';
      ctx.save(state);
      render();
      root.querySelector('.range')?.focus({ preventScroll: true });
    };
    return h(
      'div',
      { class: 'choice-row' },
      h('button', { class: 'btn btn-big vote vote-agree', type: 'button', onClick: () => vote('agree') }, 'Agree'),
      h('button', { class: 'btn btn-big vote vote-disagree', type: 'button', onClick: () => vote('disagree') }, 'Disagree'),
    );
  }

  function guessStep() {
    const out = h('output', { class: 'guess-value' }, `${state.guess}%`);
    const range = h('input', {
      class: 'range',
      type: 'range',
      min: '0',
      max: '100',
      step: '1',
      value: String(state.guess),
      'aria-label': 'Percent of players who agreed',
      style: `--fill:${state.guess}%`,
      onInput: (e) => {
        state.guess = Number(e.target.value);
        out.textContent = `${state.guess}%`;
        e.target.style.setProperty('--fill', `${state.guess}%`);
      },
    });
    return h(
      'div',
      { class: 'stack guess' },
      h(
        'div',
        { class: 'guess-head' },
        h('span', { class: `chip ${state.vote === 'agree' ? 'chip-agree' : 'chip-disagree'}` }, state.vote === 'agree' ? 'You agree' : 'You disagree'),
        h(
          'button',
          {
            class: 'btn-link',
            type: 'button',
            onClick: () => {
              state.stage = 'vote';
              render();
            },
          },
          'Change',
        ),
      ),
      h('p', { class: 'guess-q' }, 'What % of players agreed?'),
      out,
      range,
      h('button', { class: 'btn btn-primary btn-big', type: 'button', onClick: lockIn }, 'Lock it in'),
    );
  }

  async function lockIn() {
    const take = takes[state.i];
    ctx.crowd.submit(`take:${take.id}`, { vote: state.vote, guess: state.guess });
    const actual = Math.round(await ctx.crowd.get(`take:${take.id}`, take.agree));
    const diff = Math.abs(state.guess - actual);
    state.answers[state.i] = { vote: state.vote, guess: state.guess, actual, diff, points: pointsFor(diff), mark: markFor(diff) };
    state.stage = 'reveal';
    ctx.save(state);
    render();
    if (diff <= 5) ctx.fx.buzz([10, 30, 10]);
  }

  function revealStep(a) {
    const last = state.i === takes.length - 1;
    const side = a.guess < 18 ? ' is-left' : a.guess > 82 ? ' is-right' : '';
    const minority = inMinority(a);
    return h(
      'div',
      { class: 'stack reveal' },
      h(
        'div',
        { class: 'reveal-top' },
        h('p', { class: 'reveal-big' }, h('span', { class: 'reveal-pct hl' }, `${a.actual}%`), ' agreed'),
        h('span', { class: `chip reveal-points is-${toneOf(a.mark)}` }, `+${a.points}`),
      ),
      h(
        'div',
        { class: 'meter', role: 'img', 'aria-label': `${a.actual}% agreed. You guessed ${a.guess}%.` },
        h('div', { class: 'meter-fill', style: `--to:${a.actual / 100}` }),
        h('div', { class: `meter-guess${side}`, style: `left:${a.guess}%` }, h('span', {}, `you: ${a.guess}%`)),
      ),
      h(
        'p',
        { class: 'reveal-note' },
        `${verdict(a.diff)} `,
        minority ? 'And you’re in the minority. Spicy 🌶️' : majorityOf(a.actual) ? 'You’re with the majority.' : 'A perfect 50/50 split.',
      ),
      ctx.sampleNote(),
      h('button', { class: 'btn btn-primary btn-big', type: 'button', onClick: next }, last ? 'See my results' : 'Next take →'),
    );
  }

  function next() {
    if (state.i < takes.length - 1) {
      Object.assign(state, { i: state.i + 1, stage: 'vote', vote: null, guess: 50 });
      ctx.save(state);
      render();
      return;
    }
    const total = state.answers.reduce((sum, a) => sum + a.points, 0);
    const max = takes.length * MAX;
    const [peppers, spiceLine] = SPICE[Math.min(SPICE.length - 1, state.answers.filter(inMinority).length)];
    ctx.finish(
      {
        pct: total / max,
        score: `${total} / ${max} points`,
        line: `${spiceLine} ${peppers}`,
        grid: state.answers.map((a) => a.mark).join(''),
        shareLine: `${theme} · ${total}/${max} · Spice: ${peppers}`,
      },
      state,
    );
    render();
  }

  function review() {
    return h(
      'div',
      { class: 'stack' },
      h('h3', { class: 'review-title' }, 'Today’s takes: ', h('span', { class: 'hl' }, theme)),
      h(
        'ul',
        { class: 'review' },
        takes.map((t, k) => {
          const a = state.answers[k];
          if (!a) return null;
          return h(
            'li',
            { class: 'review-item' },
            h(
              'span',
              { class: 'review-main' },
              h('span', { class: 'review-text' }, t.text),
              h(
                'span',
                { class: 'review-sub' },
                `${a.vote === 'agree' ? 'You agreed' : 'You disagreed'} · guessed ${a.guess}%, really ${a.actual}%`,
              ),
            ),
            h('span', { class: `chip is-${toneOf(a.mark)}` }, a.points),
          );
        }),
      ),
      ctx.sampleNote(),
    );
  }
}
