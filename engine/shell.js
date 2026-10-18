// The frame every game runs inside: header, results, share, stats, archive, Bento Pass.
// A game provides { id, howTo: [text], ranks: [{ min, title }], puzzles, mount(board, ctx) }
// and gets its name, color and doodle from engine/games.js.
import { h, fill, fromHTML } from './util.js';
import * as daily from './daily.js';
import { createStore } from './store.js';
import { createCrowd } from './crowd.js';
import { shareText } from './share.js';
import * as fx from './fx.js';
import { icons } from './icons.js';
import { doodle, SKETCH_DEFS } from './doodles.js';
import { BENTO, GAMES, PAYWALL, gameInfo, colorVars, homeHref, gameHref, shareUrl } from './games.js';

export function boot(gameDef) {
  const game = { ...gameInfo(gameDef.id), ...gameDef };
  const rootStyle = document.documentElement.style;
  rootStyle.setProperty('--gl', game.color.l);
  rootStyle.setProperty('--gc', game.color.c);
  rootStyle.setProperty('--gh', game.color.h);
  document.body.classList.add(`game-${game.id}`);

  const store = createStore(game.id);
  const bento = createStore('bento');
  const today = daily.todayNumber(BENTO.launch);
  let current = 0;

  const iconButton = (icon, label, onClick) =>
    h('button', { class: 'icon-btn', type: 'button', 'aria-label': label, title: label, html: icons[icon], onClick });

  const dayline = h('div', { class: 'dayline' });
  const results = h('section', { class: 'card taped results', hidden: true, 'aria-label': 'Your result' });
  const board = h('section', { class: 'card taped board', 'aria-label': `${game.name} puzzle` });
  const sheet = h('dialog', { class: 'sheet' });
  sheet.addEventListener('click', (e) => {
    if (e.target === sheet) sheet.close();
  });

  fill(
    document.body,
    h('div', { html: SKETCH_DEFS }),
    h(
      'header',
      { class: 'topbar' },
      h(
        'a',
        { class: 'home-link', href: homeHref(true) },
        fromHTML(doodle('bento')),
        BENTO.name,
      ),
      h(
        'nav',
        { class: 'topbar-actions', 'aria-label': 'Game menu' },
        iconButton('help', 'How to play', openHelp),
        iconButton('calendar', 'Past puzzles', openArchive),
        iconButton('chart', 'Your stats', openStats),
      ),
    ),
    h(
      'div',
      { class: 'title-row' },
      fromHTML(doodle(game.doodle)),
      h('div', { class: 'title-text' }, h('h1', { class: 'game-title' }, h('span', { class: 'hl' }, game.name)), dayline),
    ),
    // a game whose board is the big reveal (Outbid's burgers) puts its result card underneath
    h('main', { class: 'stage' }, game.resultsBelow ? [board, results] : [results, board]),
    h('footer', { class: 'foot' }, 'A fresh bento every day at midnight, your time.'),
    sheet,
  );

  // ---------- Stats ----------
  const rankIndex = (pct) => Math.max(0, game.ranks.findIndex((r) => pct >= r.min));
  const readStats = () => store.get('stats', { played: 0, streak: 0, best: 0, lastDay: 0, total: 0, ranks: [] });
  const currentStreak = (s) => (s.lastDay >= today - 1 ? s.streak : 0);

  function recordStats(n, result) {
    const s = readStats();
    if (s.lastDay === n) return;
    s.played += 1;
    s.streak = s.lastDay === n - 1 ? s.streak + 1 : 1;
    s.best = Math.max(s.best, s.streak);
    s.lastDay = n;
    s.total += result.pct;
    const r = rankIndex(result.pct);
    s.ranks[r] = (s.ranks[r] || 0) + 1;
    store.set('stats', s);
  }

  // ---------- Bento Pass ----------
  const isLocked = () => PAYWALL.enabled && !bento.get('unlocked', false);

  function unlockCard(onUnlocked) {
    return h(
      'div',
      { class: 'unlock taped' },
      h('p', { class: 'unlock-title' }, h('span', { html: icons.lock, 'aria-hidden': 'true' }), `Get the ${PAYWALL.name}`),
      h('p', { class: 'unlock-text' }, `One-time ${PAYWALL.price}. Replay every past puzzle in every game, forever.`),
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
              onUnlocked();
            } else if (PAYWALL.checkoutUrl) {
              location.assign(PAYWALL.checkoutUrl);
            }
          },
        },
        PAYWALL.demo ? `Unlock for ${PAYWALL.price} (demo)` : `Unlock for ${PAYWALL.price}`,
      ),
      PAYWALL.demo && h('p', { class: 'unlock-fine' }, 'Demo mode: no payment is taken. It only unlocks this device so you can test.'),
    );
  }

  // ---------- Opening a day ----------
  function openDay(n) {
    n = Math.min(Math.max(1, Math.floor(n) || today), today);
    current = n;
    const isToday = n === today;

    const url = new URL(location.href);
    if (isToday) url.searchParams.delete('day');
    else url.searchParams.set('day', n);
    history.replaceState(null, '', url);

    fill(
      dayline,
      !isToday && h('span', { class: 'tag' }, `Archive No. ${n}`),
      h('span', { class: 'tag tag-soft' }, daily.formatDate(daily.dateOf(BENTO.launch, n))),
      !isToday &&
        h(
          'a',
          {
            class: 'dayline-back',
            href: './',
            onClick: (e) => {
              e.preventDefault();
              openDay(today);
            },
          },
          'Back to today',
        ),
    );

    const saved = store.get(`day:${n}`);
    const crowd = createCrowd({ gameId: game.id, day: n, store });
    const ctx = {
      day: n,
      isToday,
      puzzle: game.puzzles[(n - 1) % game.puzzles.length],
      saved: saved?.state ?? null,
      done: !!saved?.done,
      seed: `${game.id}:${n}`,
      crowd,
      fx,
      toast: fx.toast,
      sampleNote: () =>
        crowd.isSample
          ? h('span', { class: 'sample-badge', title: 'Connect a database in engine/crowd.js to show real player answers' }, 'Sample crowd data')
          : null,
      save(state) {
        if (current === n) store.set(`day:${n}`, { state, done: false });
      },
      finish(result, state) {
        if (current !== n) return;
        ctx.done = true;
        store.set(`day:${n}`, { state, done: true, result });
        if (isToday) recordStats(n, result);
        showResults(result, n, true);
      },
    };

    results.hidden = true;
    results.replaceChildren();
    board.replaceChildren();
    game.mount(board, ctx);
    if (saved?.done) showResults(saved.result, n, false);
  }

  // ---------- Results ----------
  function showResults(result, n, fresh) {
    const rank = game.ranks[rankIndex(result.pct)];
    const isToday = n === today;
    const text = [
      `🍱 ${game.name} #${n}${isToday ? '' : ' (archive)'} · ${rank.title}`,
      result.shareLine,
      result.grid,
      shareUrl(game.id),
    ]
      .filter(Boolean)
      .join('\n');

    const stats = readStats();
    fill(
      results,
      result.stamp !== false && h('p', { class: 'result-kicker' }, result.kicker || (isToday ? 'Today you’re a…' : `On No. ${n} you were a…`)),
      result.stamp !== false && h('h2', { class: fresh ? 'result-rank pop-in' : 'result-rank' }, result.title || rank.title),
      h('p', { class: 'result-score' }, h('span', { class: 'hl' }, result.score)),
      result.line && h('p', { class: 'result-line' }, result.line),
      h('pre', { class: 'result-grid', 'aria-label': 'Result grid' }, result.grid),
      h(
        'button',
        {
          class: 'btn btn-primary btn-big',
          type: 'button',
          onClick: async () => {
            const how = await shareText(text);
            if (how === 'copied') fx.toast('Copied! Paste it in the group chat');
            else if (how === 'failed') fx.toast('Couldn’t copy. Try a screenshot instead');
          },
        },
        h('span', { html: icons.share, 'aria-hidden': 'true' }),
        'Share result',
      ),
      isToday
        ? h(
            'div',
            { class: 'result-meta' },
            h(
              'div',
              { class: 'meta-item' },
              h('span', { class: 'tag tag-soft' }, 'Next one in'),
              h('span', { class: 'meta-value', 'data-countdown': '' }, daily.formatCountdown(daily.msUntilMidnight())),
            ),
            h(
              'div',
              { class: 'meta-item' },
              h('span', { class: 'tag tag-soft' }, 'Streak'),
              h('span', { class: 'meta-value' }, `${currentStreak(stats)} 🔥`),
            ),
          )
        : h('p', { class: 'hint' }, 'Archive puzzles don’t count toward your streak.'),
      lunchbox(),
    );
    results.hidden = false;

    if (fresh) {
      const target = game.resultsBelow ? board : results;
      requestAnimationFrame(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      if (result.pct >= 0.5) setTimeout(() => fx.confetti(), 250);
    }
  }

  /** The other games you haven't finished today. */
  function lunchbox() {
    const left = GAMES.filter((g) => g.id !== game.id && !createStore(g.id).get(`day:${today}`)?.done);
    return h(
      'nav',
      { class: 'lunch', 'aria-label': 'More games' },
      left.length
        ? [
            h('p', { class: 'lunch-title' }, `Still in your bento today (${left.length})`),
            h(
              'ul',
              { class: 'lunch-list' },
              left.map((g) =>
                h(
                  'li',
                  {},
                  h(
                    'a',
                    { class: 'sticker', href: gameHref(g.id, true), style: colorVars(g) },
                    fromHTML(doodle(g.doodle)),
                    g.name,
                  ),
                ),
              ),
            ),
          ]
        : h('p', { class: 'lunch-title' }, 'Clean plate! You finished every game today 🍱'),
      h('a', { class: 'btn-link', href: homeHref(true) }, 'Back to your bento'),
    );
  }

  // ---------- Sheets ----------
  function openSheet(title, ...content) {
    fill(
      sheet,
      h('div', { class: 'sheet-head' }, h('h2', { class: 'sheet-title' }, title), iconButton('close', 'Close', () => sheet.close())),
      h('div', { class: 'sheet-body' }, ...content),
    );
    if (!sheet.open) sheet.showModal();
    sheet.querySelector('.sheet-body').scrollTop = 0;
  }

  function openHelp() {
    openSheet(
      'How to play',
      h('p', { class: 'sheet-lede' }, game.tagline),
      h('ol', { class: 'howto' }, game.howTo.map((text) => h('li', {}, h('span', {}, text)))),
      h('p', { class: 'sheet-note' }, 'Everyone gets the same puzzle. A new one drops every day at midnight.'),
      h('button', { class: 'btn btn-primary btn-big', type: 'button', onClick: () => sheet.close() }, 'Let’s play'),
    );
  }

  function openStats() {
    const s = readStats();
    const avg = s.played ? Math.round((s.total / s.played) * 100) : 0;
    const most = Math.max(1, ...game.ranks.map((_, i) => s.ranks[i] || 0));
    openSheet(
      'Your stats',
      h(
        'dl',
        { class: 'stat-grid' },
        [
          ['Played', s.played],
          ['Streak', currentStreak(s)],
          ['Best', s.best],
          ['Avg', `${avg}%`],
        ].map(([label, value]) =>
          h('div', { class: 'stat' }, h('dt', { class: 'stat-label' }, label), h('dd', { class: 'stat-value' }, value)),
        ),
      ),
      h('h3', { class: 'sheet-subtitle' }, 'Your ranks'),
      h(
        'ul',
        { class: 'dist' },
        game.ranks.map((r, i) => {
          const count = s.ranks[i] || 0;
          return h(
            'li',
            { class: 'dist-row' },
            h('span', {}, r.title),
            h('span', { class: count ? 'dist-bar' : 'dist-bar is-empty', style: `--w:${Math.max(count / most, 0.08)}` }, count),
          );
        }),
      ),
      s.played === 0 && h('p', { class: 'sheet-note' }, 'Finish today’s puzzle to start a streak.'),
    );
  }

  function openArchive() {
    const locked = isLocked();
    const days = Array.from({ length: today }, (_, i) => today - i);
    const card = locked ? unlockCard(openArchive) : null;
    openSheet(
      'Past puzzles',
      card,
      h(
        'ul',
        { class: 'archive' },
        days.map((n) => {
          const saved = store.get(`day:${n}`);
          const lockedDay = locked && n !== today;
          const status = lockedDay
            ? h('span', { class: 'archive-lock', html: icons.lock, 'aria-label': 'Locked' })
            : saved?.done
              ? saved.result.score
              : saved
                ? 'In progress'
                : 'Not played';
          return h(
            'li',
            {},
            h(
              'button',
              {
                type: 'button',
                class: `archive-row${n === current ? ' is-current' : ''}${lockedDay ? ' is-locked' : ''}`,
                onClick: () => {
                  if (lockedDay) {
                    card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    fx.shake(card);
                    return;
                  }
                  sheet.close();
                  openDay(n);
                  scrollTo({ top: 0, behavior: 'smooth' });
                },
              },
              h('span', { class: 'archive-num' }, n === today ? 'Today' : `No. ${n}`),
              h('span', { class: 'archive-date' }, daily.formatDate(daily.dateOf(BENTO.launch, n))),
              h('span', { class: 'archive-status' }, status),
            ),
          );
        }),
      ),
    );
  }

  // ---------- Countdown + new-day banner ----------
  let newDayShown = false;
  setInterval(() => {
    const left = daily.formatCountdown(daily.msUntilMidnight());
    document.querySelectorAll('[data-countdown]').forEach((el) => (el.textContent = left));
    if (!newDayShown && daily.todayNumber(BENTO.launch) !== today) {
      newDayShown = true;
      document.body.append(
        h('button', { class: 'btn btn-primary new-day', type: 'button', onClick: () => location.assign('./') }, 'New puzzle ready! Play it →'),
      );
    }
  }, 1000);

  // ---------- Start ----------
  if (today < 1) {
    fill(dayline, h('span', { class: 'tag' }, 'Coming soon'));
    fill(
      board,
      h(
        'div',
        { class: 'empty' },
        h('p', { class: 'empty-title' }, `Puzzle No. 1 drops ${daily.formatDate(daily.dateOf(BENTO.launch, 1))}`),
        h('p', {}, 'Come back then!'),
      ),
    );
    return;
  }

  const requested = Number(new URLSearchParams(location.search).get('day'));
  if (requested && requested < today && isLocked()) {
    openDay(today);
    openSheet(`Get the ${PAYWALL.name}`, unlockCard(() => { sheet.close(); openDay(requested); }));
  } else {
    openDay(requested || today);
    if (!store.get('seenHelp', false)) {
      store.set('seenHelp', true);
      openHelp();
    }
  }
}
