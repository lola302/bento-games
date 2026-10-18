// Five sound-alike emoji puzzles per day, all on one theme. Day 1 = BENTO.launch in engine/games.js.
//
// The rule: say the emoji out loud and the SOUNDS make the answer. The answer must NOT just be
// the things in the picture. 🥧 + 🐀 = "pie-rat" → Pirate (good). 🐱 + 🐟 = Catfish (too literal).
// `alt` lists other accepted answers. Matching ignores capitals, spaces and punctuation.
export default [
  {
    theme: 'Animals',
    clues: [
      { emoji: '2️⃣ + 🥫', answer: 'Toucan', how: 'two + can' },
      { emoji: '📯 + 🥅', answer: 'Hornet', how: 'horn + net' },
      { emoji: '👋 + 👦', answer: 'Bison', how: 'bye + son' },
      { emoji: '🖊️ + 🏆', answer: 'Penguin', how: 'pen + win' },
      { emoji: '🌧️ + 🦌', answer: 'Reindeer', how: 'rain + deer' },
    ],
  },
  {
    theme: 'Around the house',
    clues: [
      { emoji: '🚗 + 🐶', answer: 'Carpet', how: 'car + pet' },
      { emoji: '💊 + 😮', answer: 'Pillow', how: 'pill + oh' },
      { emoji: '🍳 + 🌳', answer: 'Pantry', how: 'pan + tree' },
      { emoji: '🐱 + 🅰️ + 🪵', answer: 'Catalog', alt: ['Catalogue'], how: 'cat + a + log' },
      { emoji: '👀', answer: 'Stairs', how: 'stares' },
    ],
  },
  {
    theme: 'Your body',
    clues: [
      { emoji: '🧒 + 🦵', answer: 'Kidney', how: 'kid + knee' },
      { emoji: '🐶 + 💊', answer: 'Pupil', how: 'pup + pill' },
      { emoji: '👋 + ☕', answer: 'Hiccup', how: 'hi + cup' },
      { emoji: '🐻 + 🦶', answer: 'Barefoot', how: 'bear + foot' },
      { emoji: '🐐 + 🍵', answer: 'Goatee', how: 'goat + tea' },
    ],
  },
  {
    theme: 'Big words',
    clues: [
      { emoji: '🐝 + 🍃', answer: 'Belief', how: 'bee + leaf' },
      { emoji: '🌫️ + 🥩', answer: 'Mistake', how: 'mist + steak' },
      { emoji: '🍬 + 📅', answer: 'Candidate', how: 'candy + date' },
      { emoji: '⛺ + 🤕', answer: 'Campaign', how: 'camp + pain' },
      { emoji: '🔟 + 🐜', answer: 'Tenant', how: 'ten + ant' },
    ],
  },
  {
    theme: 'Wild card',
    clues: [
      { emoji: '🥧 + 🐀', answer: 'Pirate', how: 'pie + rat' },
      { emoji: '👁️ + 🛬', answer: 'Island', how: 'eye + land' },
      { emoji: '🌊 + 👦', answer: 'Season', how: 'sea + son' },
      { emoji: '👨 + 🚣', answer: 'Hero', how: 'he + row' },
      { emoji: '🚗 + 🎵', answer: 'Cartoon', how: 'car + tune' },
    ],
  },
  {
    theme: 'Countries',
    clues: [
      { emoji: '🌶️', answer: 'Chile', how: 'chili' },
      { emoji: '🐋', answer: 'Wales', how: 'whales' },
      { emoji: '🙅 + 🛣️', answer: 'Norway', how: 'no + way' },
      { emoji: '😮 + 👨', answer: 'Oman', how: 'oh + man' },
      { emoji: '🧊 + 🅰️', answer: 'Cuba', how: 'cube + a' },
    ],
  },
  {
    theme: 'Snack time',
    clues: [
      { emoji: '👁️ + 😱', answer: 'Ice cream', alt: ['Icecream'], how: 'eye + scream' },
      { emoji: '🏖️ + 🧙‍♀️', answer: 'Sandwich', how: 'sand + witch' },
      { emoji: '💵 + 👞', answer: 'Cashew', how: 'cash + shoe' },
      { emoji: '🚗 + 🐀', answer: 'Carrot', how: 'car + rat' },
      { emoji: '🎣 + ⬆️', answer: 'Ketchup', alt: ['Catsup'], how: 'catch + up' },
    ],
  },
  {
    theme: 'Mixed bag',
    clues: [
      { emoji: '2️⃣ + 👄', answer: 'Tulip', how: 'two + lip' },
      { emoji: '🎸 + 🍌', answer: 'Bandana', how: 'band + nana' },
      { emoji: '🐷 + 🌿', answer: 'Pigment', how: 'pig + mint' },
      { emoji: '🐂 + 😴', answer: 'Bulldozer', how: 'bull + dozer' },
      { emoji: '🌙 + 🐴', answer: 'Nightmare', how: 'night + mare' },
    ],
  },
  {
    theme: 'Mixed bag',
    clues: [
      { emoji: '🚕 + 🧓', answer: 'Cabbage', how: 'cab + age' },
      { emoji: '4️⃣ + 😴', answer: 'Forest', how: 'for + rest' },
      { emoji: '🚫 + 🧊', answer: 'Notice', how: 'not + ice' },
      { emoji: '🎸 + 👴', answer: 'Bandage', how: 'band + age' },
      { emoji: '🖊️ + 🦵', answer: 'Penny', how: 'pen + knee' },
    ],
  },
];
