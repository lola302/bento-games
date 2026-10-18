// Theme: Build a burger. Realistic cut-out photos in img/burger/ (generated with Higgsfield,
// transparent PNG, trimmed and converted to WebP by the process-ingredients script).
//
// Both players always get a bun and a beef patty, so it stays a burger. The auction is for
// everything else. At the end the burger is assembled bottom-to-top by `order`, not by the
// order things were won, so it looks like a real burger.
//
// Each item:
//   ratio  height ÷ width of its photo (printed by the trimming script)
//   w      how wide it sits on the burger (1 = full bun width)
//   k      flattening (1 = as photographed; toppings are pressed thinner like a real burger)
//   cover  how much of it the next layer up may hide (the rest always shows)
//   order  where it goes in the burger (bottom bun = 0, top bun = 10)
//   cat    category for judging; taste / fancy / wild feed Judge Patty's score
export default {
  id: 'burger',
  title: 'Build a burger',
  noun: 'burger',
  judge: 'Judge Patty',
  dir: 'img/burger',
  bread: '🍞',
  base: { bottom: 'bun-bottom', main: 'patty', top: 'bun-top' },
  parts: {
    'bun-bottom': { ratio: 0.281, w: 1, cover: 0.55, order: 0, k: 1 },
    patty: { img: 'beef-patty', name: 'Beef patty', cat: 'main', taste: 9, ratio: 0.512, w: 0.98, cover: 0.25, order: 4, k: 0.8 },
    'bun-top': { ratio: 0.517, w: 1, cover: 0, order: 10, k: 0.92 },
  },
  items: {
    'beef-patty': { name: 'Extra patty', emoji: '🥩', cat: 'main', taste: 7, ratio: 0.512, w: 0.98, cover: 0.25, order: 4.5, k: 0.8 },
    cheese: { name: 'Cheddar cheese', emoji: '🧀', cat: 'cheese', taste: 6, ratio: 0.387, w: 1.05, cover: 0.5, order: 5, k: 0.75 },
    mushrooms: { name: 'Mushrooms', emoji: '🍄', cat: 'veg', taste: 4, fancy: true, ratio: 0.288, w: 0.94, cover: 0.45, order: 5.5, k: 0.6 },
    bacon: { name: 'Crispy bacon', emoji: '🥓', cat: 'extra', taste: 7, ratio: 0.237, w: 1.05, cover: 0.45, order: 6, k: 0.7 },
    egg: { name: 'Fried egg', emoji: '🍳', cat: 'extra', taste: 5, fancy: true, ratio: 0.217, w: 1.02, cover: 0.5, order: 7, k: 0.7 },
    'onion-rings': { name: 'Onion rings', emoji: '💍', cat: 'crunch', taste: 5, fancy: true, ratio: 0.263, w: 0.98, cover: 0.4, order: 7.5, k: 0.6 },
    avocado: { name: 'Avocado', emoji: '🥑', cat: 'veg', taste: 5, fancy: true, ratio: 0.2, w: 0.97, cover: 0.45, order: 8, k: 0.6 },
    onion: { name: 'Red onion', emoji: '🧅', cat: 'veg', taste: 3, ratio: 0.137, w: 0.95, cover: 0.35, order: 8.2, k: 0.7 },
    jalapenos: { name: 'Jalapeños', emoji: '🌶️', cat: 'spice', taste: 4, fancy: true, ratio: 0.204, w: 0.93, cover: 0.45, order: 8.4, k: 0.6 },
    pineapple: { name: 'Pineapple', emoji: '🍍', cat: 'sweet', taste: 3, fancy: true, ratio: 0.194, w: 0.93, cover: 0.4, order: 8.6, k: 0.7 },
    pickles: { name: 'Pickles', emoji: '🥒', cat: 'veg', taste: 3, ratio: 0.119, w: 0.92, cover: 0.3, order: 8.8, k: 0.8 },
    'hot-chips': { name: 'Hot chips', emoji: '🔥', cat: 'crunch', taste: 2, wild: true, ratio: 0.321, w: 0.97, cover: 0.45, order: 9.2, k: 0.55 },
    lettuce: { name: 'Lettuce', emoji: '🥬', cat: 'veg', taste: 3, ratio: 0.256, w: 1.12, cover: 0.55, order: 2, k: 0.6 },
    tomato: { name: 'Tomato', emoji: '🍅', cat: 'veg', taste: 3, ratio: 0.333, w: 0.96, cover: 0.45, order: 3, k: 0.55 },
    'special-sauce': { name: 'Special sauce', emoji: '🥫', cat: 'sauce', taste: 4, ratio: 0.231, w: 1.0, cover: 0.7, order: 1, k: 0.7 },
    'bbq-sauce': { name: 'BBQ sauce', emoji: '🍯', cat: 'sauce', taste: 4, ratio: 0.217, w: 1.01, cover: 0.5, order: 9.5, k: 0.7 },
  },
  lines: {
    empty: 'Just a patty in a bun. Classic, I guess.',
    noMain: 'Where’s the patty? This is a bread hug.',
    twoMains: 'Two patties! Somebody’s hungry.',
    tooTall: 'I need a bigger mouth for this one.',
    good: 'Solid burger. I’d order it again.',
    meh: 'It’s… technically a burger.',
  },
  combos: [
    { has: ['bacon', 'cheese'], taste: 4, line: 'Bacon and cheese. A classic for a reason.' },
    { has: ['lettuce', 'tomato'], taste: 2, line: 'Lettuce and tomato. Fresh and responsible.' },
    { has: ['egg', 'bacon'], taste: 3, line: 'Egg and bacon? A breakfast burger. Respect.' },
    { has: ['avocado', 'jalapenos'], taste: 3, line: 'Avocado plus jalapeños. Somebody’s been to California.' },
    { has: ['pineapple', 'bbq-sauce'], taste: 3, line: 'Pineapple and BBQ sauce. Aloha, flavor.' },
    { has: ['onion-rings', 'bbq-sauce'], taste: 3, line: 'Onion rings and BBQ sauce. Yeehaw.' },
    { has: ['mushrooms', 'cheese'], taste: 2, line: 'A mushroom melt. Fancy.' },
  ],
};
