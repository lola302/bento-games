// Bento Games: one app, many little games. This is the list everything else reads from.
// Colors are OKLCH: l = lightness, c = chroma (how colorful), h = hue angle.

export const BENTO = {
  name: 'Bento Games',
  launch: '2026-10-18', // puzzle #1 for every game
  url: null, // your real address once it's online, e.g. 'https://bentogames.app'
};

export const GAMES = [
  { id: 'outbid', name: 'Outbid', tagline: '2 player game. $20 each, highest bid wins, a new theme every day.', doodle: 'gavel', color: { l: 0.78, c: 0.14, h: 150 }, featured: true },
  { id: 'unpopular-opinion', name: 'Unpopular Opinion', tagline: 'Vote, then guess how many agree.', doodle: 'chili', color: { l: 0.68, c: 0.19, h: 30 } },
  { id: 'blind-rank', name: 'Blind Rank', tagline: 'Tier 10 things you can’t see coming.', doodle: 'mask', color: { l: 0.68, c: 0.16, h: 295 } },
  { id: 'guesstimate', name: 'Guesstimate', tagline: 'Five numbers. Three guesses each.', doodle: 'jar', color: { l: 0.76, c: 0.12, h: 185 } },
  { id: 'memeline', name: 'Memeline', tagline: 'Put the internet in order.', doodle: 'polaroid', color: { l: 0.78, c: 0.15, h: 58 } },
  { id: 'blitz', name: 'Blitz', tagline: 'Name as many as you can, fast.', doodle: 'bolt', color: { l: 0.87, c: 0.16, h: 95 } },
  { id: 'rebus', name: 'Rebus', tagline: 'Sound out the emoji.', doodle: 'ear', color: { l: 0.72, c: 0.13, h: 245 } },
];

// One "Bento Pass" unlocks every game's archive. `demo: true` unlocks this device without
// charging anyone. Before launch: demo: false + checkoutUrl (e.g. a Stripe Payment Link).
export const PAYWALL = { enabled: true, name: 'Bento Pass', price: '$5', demo: true, checkoutUrl: null };

export const gameInfo = (id) => GAMES.find((g) => g.id === id);
export const colorVars = (g) => `--gl:${g.color.l};--gc:${g.color.c};--gh:${g.color.h}`;

// Pages: index.html (home) and games/<id>/index.html. Links are relative so the app works
// from any folder or host.
export const homeHref = (fromGame) => (fromGame ? '../../' : './');
export const gameHref = (id, fromGame) => (fromGame ? `../${id}/` : `games/${id}/`);
export const shareUrl = (id) => (BENTO.url ? `${BENTO.url}/games/${id}/` : new URL(`../${id}/`, location.href).href);
