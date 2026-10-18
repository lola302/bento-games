# Bento Games

Seven little daily games in one app. One fresh "bento box" every day at midnight, and everyone gets the same puzzles.

| Game | What you do |
|---|---|
| **Outbid** | A 2-player game. Each player gets $20 and bids (with a slider) on 10 items for today's theme. Won items fly onto your creation, built from realistic food photos; Judge Patty scores both |
| **Unpopular Opinion** | 5 takes on today's theme: agree/disagree, then guess what % of players agreed |
| **Blind Rank** | 10 things revealed one at a time: drop each into a tier S–F with no take-backs, then see how your taste compares |
| **Guesstimate** | 5 number questions, 3 guesses each with higher/lower hints. Only the exact number is a bullseye |
| **Memeline** | Put 5 moments from internet history in order, 3 tries (green = right spot, black = wrong) |
| **Blitz** | Name as many as you can before the clock runs out. Rare answers ("deep cuts") are worth more volts |
| **Rebus** | Say the emoji out loud: 🥧 + 🐀 = pie-rat = Pirate |

Every game gets the same features for free: a how-to-play sheet, a results card with a funny rank title and a shareable emoji grid, streaks and stats, an archive behind the Bento Pass, and links to the games you haven't played yet today. The home page shows today's box and which compartments you've finished.

No installs needed. Plain HTML/CSS/JavaScript.

## Run it

```bash
node dev.mjs
```

Then open http://localhost:5173.

## Folder map

```
index.html           the home page (today's bento box)
engine/              shared by every game: change once, all of them update
  games.js           the list of games (names, colors, doodles), launch date, Bento Pass price
  shell.js           header, results, share, stats, archive, Bento Pass
  home.js            the home page
  engine.css         the whole look: paper, ink, tape, stamps, buttons
  doodles.js         the hand-drawn SVG doodles
  crowd.js           where "what did other players answer?" comes from
games/<name>/
  game.js            the rules for this game
  puzzles.js         one entry per day ← this is what you edit most
  game.css           styles only this game needs
```

## Outbid themes

Each theme is a file in `games/outbid/themes/` plus its cut-out photos in `games/outbid/img/<theme>/`. The burger photos were generated with Higgsfield (transparent PNGs, trimmed and converted to WebP by a small script). For each item, `ratio` is the photo's height ÷ width, `w` is how wide it sits, and `sink` is how much it tucks into the layer below. Then list the theme's items for a day in `games/outbid/puzzles.js`.

## Add more puzzles

Open `games/<name>/puzzles.js` and add entries to the end of the list. Day 1 is `BENTO.launch` in `engine/games.js`; each entry after that is the next day. If you run out, it loops back to the start, so stay ahead! Each puzzles file starts with tips for writing good ones.

## Make a new game

1. Copy the game folder closest to your idea (e.g. `games/rebus` → `games/my-game`).
2. Add it to `GAMES` in `engine/games.js` with a name, tagline, color and doodle.
3. Change `id` in its `game.js`, then rewrite `mount()` and `puzzles.js`.

A game's `mount(board, ctx)` draws into `board` and uses:
- `ctx.puzzle`: today's entry from puzzles.js
- `ctx.saved` / `ctx.save(state)`: resume progress after a refresh
- `ctx.finish({ pct, score, line, grid, shareLine }, state)`: ends the game and shows the results card (`pct` is 0–1 and picks the rank stamp)
- `ctx.done`: true when the puzzle is finished (show a review instead)
- `ctx.fx` (`shake`, `pop`, `confetti`, `buzz`), `ctx.toast()`, `ctx.crowd`

## Put it online

Upload the whole folder to Netlify, Vercel, Cloudflare Pages or GitHub Pages (all have free plans) and connect a domain. Then set `BENTO.url` in `engine/games.js` so share links point to it.

## Before launching for real

- **Crowd numbers.** Unpopular Opinion and Blind Rank show *sample* numbers, labeled "Sample crowd data". When a free database (Supabase or Firebase) is connected in `engine/crowd.js`, everyone gets compared with the real players of that day. Blitz's "deep cut" lists should come from real data too (how many players found each answer).
- **Payments.** The Bento Pass unlock is a demo: it unlocks the device without charging. To charge real money, set `demo: false` and a `checkoutUrl` in `engine/games.js` (e.g. a Stripe Payment Link). Payment accounts usually need someone 18+ to set them up.
- **Images.** Memeline photos are freely licensed; credits are in `games/memeline/img/CREDITS.md`. Keep the photographers' credit visible, and don't swap in copyrighted meme images or screenshots.
- **Check your facts.** Guesstimate, Memeline and Blitz answers should be double-checked before they go live.
