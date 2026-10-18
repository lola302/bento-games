// One topic per day with TEN items, revealed one at a time in a shuffled order (the same for
// everyone that day). Day 1 = BENTO.launch in engine/games.js.
// Good topics: everyone has opinions, nothing is an obvious S or F, items are easy to picture.
//
// Each item: [name, emoji, crowd]. `crowd` is a SAMPLE average tier (0 = S, 1 = A, 2 = B,
// 3 = C, 4 = D, 5 = F) used until a real crowd database is connected (engine/crowd.js).
// Then it becomes the real average of every player's list that day.
const topic = (name, items) => ({
  topic: name,
  items: items.map(([label, emoji, crowd]) => ({
    id: label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
    name: label,
    emoji,
    crowd,
  })),
});

export default [
  topic('Pizza toppings', [
    ['Pepperoni', '🍕', 0.8], ['Extra cheese', '🧀', 1.4], ['Bacon', '🥓', 1.6], ['Sausage', '🌭', 1.9], ['Mushrooms', '🍄', 2.5],
    ['Ham', '🍖', 2.6], ['Jalapeños', '🌶️', 2.7], ['Onions', '🧅', 3.1], ['Pineapple', '🍍', 3.1], ['Olives', '🫒', 3.4],
  ]),
  topic('Desserts', [
    ['Ice cream', '🍦', 1.0], ['Brownies', '🍫', 1.4], ['Cookies', '🍪', 1.5], ['Cheesecake', '🍰', 1.6], ['Churros', '🥖', 1.9],
    ['Donuts', '🍩', 2.0], ['Tiramisu', '☕', 2.2], ['Crème brûlée', '🍮', 2.2], ['Mochi', '🍡', 2.3], ['Apple pie', '🥧', 2.6],
  ]),
  topic('Superpowers', [
    ['Teleporting', '🌀', 0.9], ['Flying', '🕊️', 1.0], ['Time travel', '⏳', 1.2], ['Healing', '💚', 1.9], ['Mind reading', '🧠', 2.0],
    ['Shape-shifting', '🦎', 2.1], ['Invisibility', '👻', 2.2], ['Never needing sleep', '🌙', 2.4], ['Talking to animals', '🐾', 2.6], ['Super strength', '💪', 3.0],
  ]),
  topic('Sports to watch', [
    ['Soccer', '⚽', 1.4], ['Basketball', '🏀', 1.5], ['American football', '🏈', 1.8], ['Formula 1', '🏎️', 2.1], ['Gymnastics', '🤸', 2.2],
    ['Tennis', '🎾', 2.6], ['Boxing', '🥊', 2.6], ['Hockey', '🏒', 2.7], ['Baseball', '⚾', 3.0], ['Golf', '⛳', 3.9],
  ]),
  topic('Holidays', [
    ['Christmas', '🎄', 0.9], ['Your birthday', '🎂', 1.1], ['Halloween', '🎃', 1.2], ['New Year’s Eve', '🎆', 1.6], ['Thanksgiving', '🦃', 1.9],
    ['Fourth of July', '🎇', 2.1], ['Lunar New Year', '🧧', 2.2], ['Diwali', '🪔', 2.3], ['Easter', '🐣', 2.8], ['Valentine’s Day', '💘', 3.3],
  ]),
  topic('Sandwiches', [
    ['Grilled cheese', '🧀', 1.2], ['Philly cheesesteak', '🥩', 1.5], ['BLT', '🥓', 1.7], ['Meatball sub', '🍝', 2.0], ['Banh mi', '🥖', 2.0],
    ['Cuban', '🐖', 2.1], ['Club', '🥪', 2.2], ['PB&J', '🥜', 2.4], ['Reuben', '🥒', 2.6], ['Tuna melt', '🐟', 3.0],
  ]),
  topic('Fast food chains', [
    ['Chick-fil-A', '🐔', 0.9], ['McDonald’s', '🍟', 1.6], ['Five Guys', '🍔', 1.7], ['Chipotle', '🌯', 1.8], ['Taco Bell', '🌮', 1.9],
    ['Popeyes', '🍗', 2.0], ['Wendy’s', '🥤', 2.3], ['KFC', '🪣', 2.6], ['Burger King', '👑', 2.7], ['Subway', '🥪', 3.0],
  ]),
  topic('Streaming services', [
    ['YouTube', '▶️', 0.8], ['Netflix', '🎬', 1.0], ['Disney+', '🏰', 2.0], ['Prime Video', '📦', 2.2], ['Max', '🎭', 2.3],
    ['Twitch', '🎮', 2.5], ['Hulu', '📺', 2.6], ['Crunchyroll', '🍥', 2.8], ['Apple TV+', '🍎', 3.0], ['Peacock', '🦚', 3.4],
  ]),
  topic('Social media apps', [
    ['YouTube', '▶️', 0.9], ['TikTok', '🎵', 1.0], ['Instagram', '📸', 1.1], ['Snapchat', '👻', 2.0], ['Discord', '💬', 2.1],
    ['Reddit', '🤖', 2.4], ['Pinterest', '📌', 2.6], ['X', '🐦', 3.2], ['BeReal', '📷', 3.4], ['Facebook', '📘', 3.8],
  ]),
  topic('Pixar movies', [
    ['Toy Story', '🤠', 0.8], ['Up', '🎈', 1.2], ['The Incredibles', '🦸', 1.2], ['Inside Out', '😊', 1.3], ['Finding Nemo', '🐠', 1.3],
    ['Coco', '💀', 1.4], ['Monsters, Inc.', '👾', 1.5], ['Ratatouille', '🐀', 1.6], ['WALL-E', '🤖', 1.7], ['Cars', '🏎️', 2.5],
  ]),
  topic('Candy', [
    ['Reese’s', '🥜', 1.0], ['KitKat', '🍫', 1.3], ['Sour Patch Kids', '🍬', 1.7], ['M&M’s', '🔴', 1.8], ['Twix', '🥢', 1.8],
    ['Snickers', '🌰', 1.9], ['Skittles', '🌈', 2.0], ['Gummy bears', '🐻', 2.2], ['Starburst', '⭐', 2.4], ['Hershey’s bar', '🟫', 2.8],
  ]),
  topic('Coffee orders', [
    ['Iced coffee', '🧊', 1.4], ['Latte', '🥛', 1.5], ['Cold brew', '🫙', 1.7], ['Cappuccino', '☕', 1.8], ['Mocha', '🍫', 2.2],
    ['Matcha latte', '🍵', 2.3], ['Frappuccino', '🥤', 2.4], ['Flat white', '🤍', 2.4], ['Americano', '🇺🇸', 2.8], ['Espresso', '⚡', 2.9],
  ]),
  topic('Cities to visit', [
    ['Tokyo', '🗼', 0.9], ['New York', '🗽', 1.1], ['Paris', '🥐', 1.2], ['Rome', '🏛️', 1.4], ['London', '💂', 1.6],
    ['Barcelona', '⚽', 1.7], ['Seoul', '🏯', 2.0], ['Sydney', '🦘', 2.0], ['Dubai', '🏙️', 2.2], ['Los Angeles', '🌴', 2.4],
  ]),
  topic('Board & card games', [
    ['Uno', '🃏', 1.4], ['Chess', '♟️', 1.9], ['Catan', '🌾', 2.0], ['Jenga', '🧱', 2.1], ['Poker', '♠️', 2.2],
    ['Clue', '🔍', 2.2], ['Monopoly', '🎩', 2.3], ['Exploding Kittens', '🐈', 2.4], ['Scrabble', '🔤', 2.6], ['Connect 4', '🔴', 2.8],
  ]),
  topic('Video game series', [
    ['Mario', '🍄', 1.0], ['Minecraft', '⛏️', 1.1], ['Pokémon', '⚡', 1.2], ['Zelda', '🗡️', 1.5], ['GTA', '🚓', 1.9],
    ['Animal Crossing', '🍃', 2.0], ['The Sims', '💎', 2.1], ['Fortnite', '🪂', 2.5], ['Call of Duty', '🎖️', 2.6], ['EA FC', '🏟️', 3.0],
  ]),
  topic('Dream jobs', [
    ['Astronaut', '🚀', 1.4], ['Doctor', '🩺', 1.9], ['Chef', '🍳', 2.0], ['Pilot', '✈️', 2.0], ['Artist', '🎨', 2.1],
    ['YouTuber', '🎥', 2.3], ['Firefighter', '🚒', 2.3], ['Engineer', '🛠️', 2.4], ['Lawyer', '⚖️', 2.8], ['Teacher', '🍎', 2.9],
  ]),
  topic('Taylor Swift albums', [
    ['1989', '🕶️', 1.0], ['Red', '❤️', 1.3], ['folklore', '🌲', 1.4], ['reputation', '🐍', 1.6], ['Midnights', '🌙', 1.9],
    ['Fearless', '✨', 2.0], ['Speak Now', '💜', 2.0], ['Lover', '💗', 2.1], ['evermore', '🍂', 2.2], ['The Tortured Poets Department', '🖋️', 2.6],
  ]),
  topic('Marvel heroes', [
    ['Spider-Man', '🕷️', 0.9], ['Iron Man', '🦾', 1.0], ['Deadpool', '⚔️', 1.6], ['Black Panther', '🐆', 1.7], ['Wolverine', '🐺', 1.7],
    ['Thor', '⚡', 1.8], ['Captain America', '🛡️', 1.8], ['Doctor Strange', '🔮', 2.1], ['Hulk', '💚', 2.2], ['Black Widow', '🕸️', 2.4],
  ]),
];
