// The Bento Games home page: today's box with one compartment per game.
import { h, fill, fromHTML } from './util.js';
import * as daily from './daily.js';
import { createStore } from './store.js';
import * as fx from './fx.js';
import { doodle, SKETCH_DEFS } from './doodles.js';
import { BENTO, GAMES, PAYWALL, colorVars, gameHref } from './games.js';

// Testing helper: open the home page with ?reset to wipe your progress on this device.
if (new URLSearchParams(location.search).has('reset')) {
  try {
    localStorage.clear();
  } catch {
    /* storage blocked: nothing to clear */
  }
  location.replace(location.pathname);
}

const today = daily.todayNumber(BENTO.launch);
const bento = createStore('bento');
const status = GAMES.map((g) => ({ g, saved: createStore(g.id).get(`day:${today}`) }));
const doneCount = status.filter((s) => s.saved?.done).length;

function compartment({ g, saved }) {
  const done = saved?.done;
  return h(
    'a',
    { class: `compartment${done ? ' is-done' : ''}${g.featured ? ' is-featured' : ''}`, href: gameHref(g.id, false), style: colorVars(g) },
    g.featured && !done && h('span', { class: 'comp-new', 'aria-hidden': 'true' }, 'New!'),
    fromHTML(doodle(g.doodle)),
    h('span', { class: 'comp-name' }, g.name),
    h('span', { class: 'comp-tagline' }, g.tagline),
    h('span', { class: 'comp-status' }, done ? `✓ ${saved.result.score}` : saved ? 'Keep going →' : 'Play →'),
    done && h('span', { class: 'stamp comp-stamp', 'aria-hidden': 'true' }, h('span', { class: 'stamp-big' }, 'Done')),
  );
}

function progress() {
  const label =
    doneCount === GAMES.length
      ? 'Clean plate! You finished every game today.'
      : doneCount === 0
        ? 'Nothing eaten yet. Pick a compartment!'
        : `${doneCount} of ${GAMES.length} done. Finish your bento!`;
  return h(
    'div',
    { class: 'progress' },
    h(
      'span',
      { class: 'progress-boxes', 'aria-hidden': 'true' },
      status.map(({ g, saved }) => h('span', { class: `progress-box${saved?.done ? ' is-done' : ''}`, style: colorVars(g) })),
    ),
    h('span', {}, label),
  );
}

function passCard() {
  const card = h('section', { class: 'card taped pass' });
  const render = () => {
    const unlocked = !PAYWALL.enabled || bento.get('unlocked', false);
    fill(
      card,
      h('h2', { class: 'pass-title' }, unlocked ? `${PAYWALL.name} ✓` : `Missed a day? Get the ${PAYWALL.name}`),
      h(
        'p',
        { class: 'hint' },
        unlocked
          ? 'Every past puzzle is unlocked. Open the calendar in any game to replay old days.'
          : `One-time ${PAYWALL.price}. Replay every past puzzle in every game.`,
      ),
      !unlocked &&
        h(
          'button',
          {
            class: 'btn btn-primary',
            type: 'button',
            onClick: () => {
              if (PAYWALL.demo) {
                bento.set('unlocked', true);
                fx.toast(`${PAYWALL.name} unlocked on this device`);
                fx.confetti({ count: 90 });
                render();
              } else if (PAYWALL.checkoutUrl) {
                location.assign(PAYWALL.checkoutUrl);
              }
            },
          },
          PAYWALL.demo ? `Unlock for ${PAYWALL.price} (demo)` : `Unlock for ${PAYWALL.price}`,
        ),
      !unlocked && PAYWALL.demo && h('p', { class: 'unlock-fine' }, 'Demo mode: no payment is taken.'),
    );
  };
  render();
  return card;
}

const countdown = h('span', { class: 'meta-value' }, daily.formatCountdown(daily.msUntilMidnight()));
setInterval(() => (countdown.textContent = daily.formatCountdown(daily.msUntilMidnight())), 1000);

fill(
  document.body,
  fromHTML(SKETCH_DEFS),
  h(
    'main',
    { class: 'home' },
    h(
      'header',
      { class: 'home-head' },
      fromHTML(doodle('bento')),
      h(
        'div',
        { class: 'title-text' },
        h('h1', { class: 'home-title' }, h('span', { class: 'hl' }, BENTO.name)),
        h(
          'div',
          { class: 'dayline' },
          today < 1 && h('span', { class: 'tag' }, 'Coming soon'),
          h('span', { class: 'tag tag-soft' }, daily.formatDate(new Date())),
        ),
      ),
    ),
    progress(),
    h('section', { class: 'bento', 'aria-label': 'Today’s games' }, status.map(compartment)),
    passCard(),
  ),
  h('footer', { class: 'foot home-foot' }, h('span', {}, 'Next bento in '), countdown),
);
