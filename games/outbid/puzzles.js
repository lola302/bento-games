// One auction per day: a theme and the 10 items that come up, in order.
// Day 1 = BENTO.launch in engine/games.js. Themes live in themes/; item ids come from the theme.
// Both players already have a bun and a patty; "beef-patty" here is an EXTRA patty.
// The plan is a different theme every day. Until more themes are made, every day is a burger
// with a different set of items.

const burger = (items) => ({ theme: 'burger', items });

export default [
  burger(['cheese', 'lettuce', 'bacon', 'tomato', 'mushrooms', 'onion', 'special-sauce', 'avocado', 'pickles', 'beef-patty']),
  burger(['bacon', 'cheese', 'egg', 'onion-rings', 'lettuce', 'hot-chips', 'tomato', 'bbq-sauce', 'jalapenos', 'pickles']),
  burger(['lettuce', 'tomato', 'jalapenos', 'cheese', 'pineapple', 'bacon', 'mushrooms', 'special-sauce', 'hot-chips', 'beef-patty']),
  burger(['bacon', 'avocado', 'cheese', 'onion', 'egg', 'hot-chips', 'pickles', 'bbq-sauce', 'lettuce', 'tomato']),
  burger(['tomato', 'cheese', 'onion-rings', 'lettuce', 'pineapple', 'bacon', 'jalapenos', 'special-sauce', 'mushrooms', 'beef-patty']),
  burger(['pickles', 'cheese', 'bacon', 'mushrooms', 'avocado', 'egg', 'tomato', 'bbq-sauce', 'onion', 'lettuce']),
  burger(['cheese', 'bacon', 'lettuce', 'egg', 'tomato', 'onion-rings', 'special-sauce', 'pickles', 'jalapenos', 'beef-patty']),
];
