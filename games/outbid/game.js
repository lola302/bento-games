import { h, fill, fromHTML, prefersReducedMotion } from 'engine/util.js';
import { tag } from 'engine/ui.js';
import { doodle } from 'engine/doodles.js';
import { THEMES } from './themes/index.js';
import { stack as buildStack } from './stack.js';
import puzzles from './puzzles.js';

const BUDGET = 20;
const wait = (ms) => new Promise((r) => setTimeout(r, prefersReducedMotion() ? Math.min(ms, 150) : ms));
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

export default {
  id: 'outbid',
  resultsBelow: true,
  howTo: [
    'A 2-player game. You each start with $20 and build today’s theme, like a burger.',
    'Ten items come up one at a time. Slide to pick your bid, then bid or pass.',
    'Whoever passes loses the item; the last bidder pays what they bid. Who opens the bidding switches every round.',
    'Both players get a bun and a patty for free. At the end the judge builds both burgers and gives each one score.',
  ],
  ranks: [
    { min: 0.75, title: 'Landslide' },
    { min: 0.62, title: 'Clear Win' },
    { min: 0.51, title: 'Photo Finish' },
    { min: 0, title: 'Dead Heat' },
  ],
  puzzles,
  mount,
};

// ---------- judging (works for any theme) ----------

function judge(theme, ids, spent) {
  const items = [theme.parts[theme.base.main], ...ids.map((id) => theme.items[id])];
  const has = (id) => ids.includes(id);
  const mains = items.filter((i) => i.cat === 'main').length;
  const combos = theme.combos.filter((c) => c.has.every(has));
  let taste = items.reduce((s, i) => s + i.taste, 0) + combos.reduce((s, c) => s + c.taste, 0);
  if (!mains) taste *= 0.5;

  const cats = new Set(items.map((i) => i.cat).filter((c) => c !== 'wild'));
  let looks = ids.length ? Math.min(10, 1 + cats.size * 2) : 1;
  if (ids.length > 7) looks -= 2;

  const scores = {
    taste: clamp(Math.round(taste / 3.5), 0, 10),
    looks: clamp(looks, 0, 10),
    creativity: clamp(2 + items.filter((i) => i.fancy).length * 2 + items.filter((i) => i.wild).length * 3 + combos.length, 0, 10),
    value: !ids.length ? 0 : spent === 0 ? 10 : clamp(Math.round((Math.max(0, taste) / spent) * 4), 0, 10),
  };
  const total = scores.taste + scores.looks + scores.creativity + scores.value;

  const L = theme.lines;
  const lines = [];
  if (!ids.length) lines.push(L.empty);
  else if (!mains) lines.push(L.noMain);
  if (mains >= 2) lines.push(L.twoMains);
  items.filter((i) => i.line).forEach((i) => lines.push(i.line));
  combos.forEach((c) => lines.push(c.line));
  if (ids.length > 7) lines.push(L.tooTall);
  if (scores.value >= 9 && ids.length >= 3) lines.push(`All that for $${spent}? Smart shopper.`);
  if (!lines.length) lines.push(scores.taste >= 6 ? L.good : L.meh);
  return { scores, total, lines: lines.slice(0, 2) };
}

// ---------- the game ----------

function mount(root, ctx) {
  const day = ctx.puzzle;
  const theme = THEMES[day.theme];
  const info = (id) => theme.items[id] || theme.parts[id];
  const src = (id) => `${theme.dir}/${info(id).img || id}.webp`;
  let game = null; // { lots, round, firstStarter, saved, players: { a, b } }
  let live = null; // current round: { high, leader, turn, passed, busy, pick }
  let ui = null;

  // ---------- names ----------

  function lastNames() {
    try {
      return JSON.parse(localStorage.getItem('outbid:names')) || ['Player 1', 'Player 2'];
    } catch {
      return ['Player 1', 'Player 2'];
    }
  }

  function rememberNames(names) {
    try {
      localStorage.setItem('outbid:names', JSON.stringify(names));
    } catch {
      /* fine without it */
    }
  }

  // ---------- state ----------

  const newPlayer = (key, name) => ({ key, name, money: BUDGET, spent: 0, items: [] });
  const other = (key) => (key === 'a' ? 'b' : 'a');
  const P = (key) => game.players[key];
  const lotId = () => game.lots[game.round];

  const serialize = () => ({
    names: [P('a').name, P('b').name],
    round: game.round,
    a: { money: P('a').money, spent: P('a').spent, items: [...P('a').items] },
    b: { money: P('b').money, spent: P('b').spent, items: [...P('b').items] },
  });

  function fromSaved(s) {
    const g = { lots: day.items, round: s.round, firstStarter: 'a', saved: true, players: { a: newPlayer('a', s.names[0]), b: newPlayer('b', s.names[1]) } };
    for (const k of ['a', 'b']) Object.assign(g.players[k], s[k], { key: k, name: g.players[k].name });
    return g;
  }

  function startGame(names, saved = true, firstStarter = 'a') {
    game = { lots: day.items, round: 0, firstStarter, saved, players: { a: newPlayer('a', names[0]), b: newPlayer('b', names[1]) } };
    if (saved) ctx.save(serialize());
    startRound();
  }

  // ---------- the stacked creation ----------

  const stack = (ids, build = false) => buildStack(theme, ids, { build });

  /** During the game, won items wait in each player's box. */
  function box(ids, fresh = -1) {
    return h(
      'div',
      { class: 'ob-box' },
      ids.length
        ? ids.map((id, i) => h('img', { class: i === fresh ? 'ob-thumb is-new' : 'ob-thumb', src: src(id), alt: theme.items[id].name, title: theme.items[id].name, draggable: 'false' }))
        : h('span', { class: 'ob-box-empty' }, 'Patty and bun included. Win some toppings!'),
    );
  }

  // ---------- intro ----------

  function renderIntro() {
    const [n1, n2] = lastNames();
    const in1 = h('input', { class: 'field', id: 'ob-p1', value: n1, maxlength: '14', autocomplete: 'off', 'aria-label': 'Player 1 name' });
    const in2 = h('input', { class: 'field', id: 'ob-p2', value: n2, maxlength: '14', autocomplete: 'off', 'aria-label': 'Player 2 name' });
    const start = () => {
      const names = [in1.value.trim() || 'Player 1', in2.value.trim() || 'Player 2'];
      if (names[0] === names[1]) names[1] += ' 2';
      rememberNames(names);
      startGame(names);
    };
    fill(
      root,
      h(
        'div',
        { class: 'stack ob-intro' },
        tag('Today’s theme'),
        h('h2', { class: 'ob-title' }, h('span', { class: 'hl' }, theme.title)),
        h('div', { class: 'ob-preview' }, stack(day.items.slice(0, 4))),
        h('p', { class: 'hint ob-included' }, 'Both burgers come with a bun and a beef patty. Bid for everything else.'),
        h(
          'ul',
          { class: 'ob-rules' },
          h('li', {}, h('b', {}, '2 players'), ', $20 each'),
          h('li', {}, h('b', {}, '10'), ' items, one at a time'),
          h('li', {}, h('b', {}, 'Highest bid'), ' wins each item'),
          h('li', {}, h('b', {}, theme.judge), ' picks the winner'),
        ),
        h(
          'form',
          {
            class: 'ob-names',
            onSubmit: (e) => {
              e.preventDefault();
              start();
            },
          },
          h('label', { class: 'ob-name-field' }, h('span', { class: 'tag tag-soft' }, 'Player 1'), in1),
          h('span', { class: 'ob-vs', 'aria-hidden': 'true' }, 'vs'),
          h('label', { class: 'ob-name-field' }, h('span', { class: 'tag tag-soft' }, 'Player 2'), in2),
          h('button', { class: 'btn btn-primary btn-big ob-start', type: 'submit' }, 'Start the auction'),
        ),
      ),
    );
  }

  // ---------- the arena ----------

  function startRound() {
    const starter = (game.round % 2 === 0) === (game.firstStarter === 'a') ? 'a' : 'b';
    live = { high: 0, leader: null, turn: starter, passed: { a: false, b: false }, busy: false, pick: 1 };
    renderArena();
    nextTurn();
  }

  function playerPanel(p) {
    return h(
      'div',
      { class: 'ob-player', 'data-key': p.key },
      h('p', { class: 'ob-name' }, p.name),
      h('p', { class: 'ob-money' }, `$${p.money}`),
      box(p.items),
      h('span', { class: 'ob-lead' }, 'High bid'),
    );
  }

  function renderArena() {
    const id = lotId();
    ui = {
      panels: { a: playerPanel(P('a')), b: playerPanel(P('b')) },
      lot: h('div', { class: 'ob-lot is-new' }),
      bid: h('p', { class: 'ob-bid', 'aria-live': 'polite' }),
      turn: h('p', { class: 'ob-turn', 'aria-live': 'polite' }),
      controls: h('div', { class: 'ob-controls' }),
      log: h('p', { class: 'ob-log' }),
    };
    fill(
      ui.lot,
      tag(`${theme.title} · item ${game.round + 1} of ${game.lots.length}`),
      h('div', { class: 'ob-art-wrap' }, h('img', { class: 'ob-art', src: src(id), alt: theme.items[id].name, draggable: 'false' })),
      h('p', { class: 'ob-item-name' }, theme.items[id].name),
      ui.bid,
    );
    fill(
      root,
      h(
        'div',
        { class: 'ob-arena' },
        h('div', { class: 'ob-players' }, ui.panels.a, h('span', { class: 'ob-vs', 'aria-hidden': 'true' }, 'vs'), ui.panels.b),
        ui.lot,
        ui.turn,
        ui.controls,
        ui.log,
      ),
    );
    paint();
  }

  /** Update everything that changes during a round, without rebuilding the arena. */
  function paint(message) {
    const p = P(live.turn);
    for (const k of ['a', 'b']) {
      const panel = ui.panels[k];
      panel.classList.toggle('is-turn', !live.busy && live.turn === k);
      panel.classList.toggle('is-leader', live.leader === k);
      panel.querySelector('.ob-money').textContent = `$${P(k).money}`;
    }
    ui.bid.textContent = live.leader ? `Current bid: $${live.high} (${P(live.leader).name})` : 'No bids yet';
    if (message) ui.log.textContent = message;

    if (live.busy) {
      ui.turn.textContent = '';
      ui.controls.replaceChildren();
      return;
    }
    ui.turn.textContent = live.leader ? `${p.name}’s turn: beat $${live.high} or pass` : `${p.name}’s turn: open the bidding or pass`;

    const min = live.high + 1;
    const max = p.money;
    if (min > max) {
      fill(ui.controls, h('p', { class: 'ob-broke' }, `${p.name} can’t afford to raise.`));
      return;
    }
    live.pick = clamp(live.pick, min, max);
    const amount = h('output', { class: 'ob-pick' }, `$${live.pick}`);
    const bidBtn = h('button', { class: 'btn btn-primary ob-bid-btn', type: 'button', onClick: () => act(p, 'raise', live.pick) }, `Bid $${live.pick}`);
    const pct = () => (max === min ? 100 : ((live.pick - min) / (max - min)) * 100);
    const slider = h('input', {
      class: 'range ob-slider',
      type: 'range',
      min: String(min),
      max: String(max),
      step: '1',
      value: String(live.pick),
      disabled: min === max,
      'aria-label': `${p.name}’s bid in dollars`,
      style: `--fill:${pct()}%`,
      onInput: (e) => {
        live.pick = Number(e.target.value);
        amount.textContent = `$${live.pick}`;
        bidBtn.textContent = `Bid $${live.pick}`;
        e.target.style.setProperty('--fill', `${pct()}%`);
      },
    });
    fill(
      ui.controls,
      h('div', { class: 'ob-bidbox' }, h('span', { class: 'ob-bidbox-label' }, `${p.name} bids`), amount),
      slider,
      h('div', { class: 'ob-scale' }, h('span', {}, `$${min}`), h('span', {}, `$${max}${max === p.money ? ' (all in)' : ''}`)),
      h(
        'div',
        { class: 'ob-actions' },
        bidBtn,
        h('button', { class: 'btn ob-pass', type: 'button', onClick: () => act(p, 'pass') }, live.leader ? `Pass (${P(live.leader).name} gets it)` : 'Pass'),
      ),
    );
  }

  function bubble(key, text) {
    const panel = ui.panels[key];
    panel.querySelector('.ob-bubble')?.remove();
    panel.append(h('span', { class: 'ob-bubble' }, text));
  }

  async function nextTurn() {
    const p = P(live.turn);
    paint();
    if (p.money < live.high + 1) {
      await wait(1100);
      bubble(p.key, 'Out of cash!');
      act(p, 'pass', 0, true);
    }
  }

  function act(p, kind, amount = 0, forced = false) {
    if (live.busy || live.turn !== p.key) return;
    if (kind === 'raise') {
      live.high = amount;
      live.leader = p.key;
      live.passed = { a: false, b: false };
      live.pick = amount + 1;
      bubble(p.key, `$${amount}!`);
      ctx.fx.pop(ui.bid);
      ctx.fx.buzz(8);
      live.turn = other(p.key);
      paint(`${p.name} bids $${amount}.`);
      nextTurn();
      return;
    }
    live.passed[p.key] = true;
    if (!forced) bubble(p.key, 'Pass');
    if (live.leader) return sold(live.leader, live.high);
    if (live.passed[other(p.key)]) return nobody();
    live.turn = other(p.key);
    live.pick = 1;
    paint(`${p.name} passed.`);
    nextTurn();
  }

  // ---------- end of a round ----------

  async function sold(key, price) {
    live.busy = true;
    const p = P(key);
    paint(`Sold to ${p.name} for $${price}!`);
    ctx.fx.buzz([10, 40, 10]);
    await wait(750);
    await fly(ui.lot.querySelector('.ob-art'), ui.panels[key].querySelector('.ob-box'));
    p.money -= price;
    p.spent += price;
    p.items.push(lotId());
    ui.panels[key].querySelector('.ob-box').replaceWith(box(p.items, p.items.length - 1));
    paint();
    afterRound();
  }

  async function nobody() {
    live.busy = true;
    paint(`Nobody wanted the ${theme.items[lotId()].name.toLowerCase()}.`);
    ui.lot.querySelector('.ob-art')?.classList.add('is-gone');
    await wait(700);
    afterRound();
  }

  async function afterRound() {
    game.round += 1;
    if (game.saved) ctx.save(serialize());
    await wait(900);
    if (game.round >= game.lots.length) return finishGame();
    startRound();
  }

  function fly(fromEl, toEl) {
    return new Promise((resolve) => {
      if (!fromEl || !toEl || prefersReducedMotion()) return resolve();
      const a = fromEl.getBoundingClientRect();
      const b = toEl.getBoundingClientRect();
      const clone = fromEl.cloneNode(true);
      clone.classList.add('ob-flying');
      Object.assign(clone.style, { left: `${a.left}px`, top: `${a.top}px`, width: `${a.width}px`, height: `${a.height}px` });
      document.body.append(clone);
      const dx = b.left + b.width / 2 - (a.left + a.width / 2);
      const dy = b.top + b.height / 2 - (a.top + a.height / 2);
      const s = Math.min(1, 70 / a.width);
      const anim = clone.animate(
        [
          { transform: 'translate(0, 0) scale(1) rotate(0deg)' },
          { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) scale(${(1 + s) / 2}) rotate(-10deg)`, offset: 0.5 },
          { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(0deg)` },
        ],
        { duration: 700, easing: 'cubic-bezier(0.45, 0, 0.25, 1)' },
      );
      // Hidden tabs pause animations, so never let the game wait on one forever.
      let done = false;
      const land = () => {
        if (done) return;
        done = true;
        clone.remove();
        resolve();
      };
      anim.onfinish = land;
      setTimeout(land, 900);
    });
  }

  // ---------- judging ----------

  function finishGame() {
    const { a, b } = game.players;
    const ja = judge(theme, a.items, a.spent);
    const jb = judge(theme, b.items, b.spent);
    const diff = ja.total - jb.total;
    const winner = diff === 0 ? null : diff > 0 ? a : b;
    if (game.saved) {
      const row = (p) => `${p.name} ${theme.bread}${p.items.map((id) => theme.items[id].emoji).join('')}${theme.bread}`;
      ctx.finish(
        {
          pct: diff === 0 ? 0.5 : 0.5 + Math.min(0.5, Math.abs(diff) / 40 + 0.01),
          stamp: false,
          score: winner ? `${winner.name} wins!` : 'It’s a tie!',
          line: `${theme.judge} scored ${a.name}’s ${theme.noun} ${ja.total} and ${b.name}’s ${jb.total}.`,
          grid: `${row(a)}\n${row(b)}`,
          shareLine: `${theme.title}: ${a.name} ${ja.total}–${jb.total} ${b.name}`,
        },
        serialize(),
      );
    } else if (winner) {
      ctx.fx.confetti();
    }
    renderJudging(game, true);
  }

  function renderJudging(g, fresh) {
    const { a, b } = g.players;
    const ja = judge(theme, a.items, a.spent);
    const jb = judge(theme, b.items, b.spent);
    const winner = ja.total === jb.total ? null : ja.total > jb.total ? a : b;
    const col = (p, j) =>
      h(
        'div',
        { class: `ob-final${winner === p ? ' is-winner' : ''}` },
        h('p', { class: 'ob-name' }, p.name),
        h('div', { class: 'ob-plate ob-plate-big' }, stack(p.items, fresh)),
        h('p', { class: 'ob-points' }, h('span', { class: 'ob-points-num' }, j.total), ' points'),
        h('p', { class: 'ob-final-meta' }, `${p.items.length} toppings · $${p.spent} spent`),
      );
    const names = [a.name, b.name];
    fill(
      root,
      h(
        'div',
        { class: `stack ob-judging${fresh ? ' is-fresh' : ''}` },
        h(
          'div',
          { class: 'ob-judge-head' },
          fromHTML(doodle('chef')),
          h('div', {}, h('p', { class: 'ob-judge-name' }, `${theme.judge} builds both ${theme.noun}s…`), h('p', { class: 'hint' }, 'Scored on taste, looks, creativity and value.')),
        ),
        h('div', { class: 'ob-finals' }, col(a, ja), col(b, jb)),
        h('p', { class: 'ob-winner' }, h('span', { class: 'hl' }, winner ? `${winner.name} wins!` : 'It’s a tie!')),
        h(
          'button',
          { class: 'btn btn-primary btn-big', type: 'button', onClick: () => startGame(names, false, g.firstStarter === 'a' ? 'b' : 'a') },
          'Rematch (same items)',
        ),
        !g.saved &&
          h(
            'button',
            { class: 'btn-link', type: 'button', onClick: () => (ctx.saved ? renderJudging(fromSaved(ctx.saved), false) : renderIntro()) },
            'Back to today’s result',
          ),
      ),
    );
  }

  // ---------- start ----------
  if (ctx.done && ctx.saved) renderJudging(fromSaved(ctx.saved), false);
  else if (ctx.saved?.names) {
    game = fromSaved(ctx.saved);
    if (game.round >= game.lots.length) finishGame();
    else startRound();
  } else renderIntro();
}
