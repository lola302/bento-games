// One set of five takes per day: three to think about on the day's theme, two just for fun.
// Day 1 = BENTO.launch in engine/games.js.
//
// How to keep takes interesting (check every new one against this):
//  1. It SPLITS people. If you can't guess whether most people agree, it's good.
//     Aim for 30–70% agreeing. "Pizza is tasty" (99%) is boring.
//  2. Everyone has an opinion from their OWN life (dating, phones, friends, school, food).
//  3. It's SPECIFIC. "Crocs are fine at a wedding" beats "Crocs are good".
//  4. A little bit outrageous, never mean about a group of people. No hot-button politics.
//  5. Each day: 3 thinking takes on the theme + 2 fun ones mixed in.
// Once real player data is connected, drop any take that lands above 85% or below 15%.
//
// `agree` is a SAMPLE percentage used until a real crowd database is connected (engine/crowd.js).
export default [
  {
    theme: "Love & dating",
    takes: [
      { id: "it-s-okay-to-look-through-your-partner-s-phone", text: "It’s okay to look through your partner’s phone.", agree: 22 },
      { id: "a-hot-dog-is-a-sandwich", text: "A hot dog is a sandwich.", agree: 32 },
      { id: "whoever-asks-someone-out-should-pay-on-the-first", text: "Whoever asks someone out should pay on the first date.", agree: 58 },
      { id: "people-who-clap-when-the-plane-lands-are-right", text: "People who clap when the plane lands are right.", agree: 35 },
      { id: "you-can-t-be-real-friends-with-your-ex", text: "You can’t be real friends with your ex.", agree: 48 },
    ],
  },
  {
    theme: "Fame & celebrities",
    takes: [
      { id: "celebrities-should-keep-their-opinions-to-themse", text: "Celebrities should keep their opinions to themselves.", agree: 50 },
      { id: "shrek-is-a-genuine-masterpiece", text: "Shrek is a genuine masterpiece.", agree: 58 },
      { id: "award-shows-don-t-matter-anymore", text: "Award shows don’t matter anymore.", agree: 60 },
      { id: "flying-is-a-better-superpower-than-invisibility", text: "Flying is a better superpower than invisibility.", agree: 60 },
      { id: "being-an-influencer-is-a-real-job", text: "Being an influencer is a real job.", agree: 52 },
    ],
  },
  {
    theme: "Tech & AI",
    takes: [
      { id: "ai-generated-art-is-real-art", text: "AI-generated art is real art.", agree: 35 },
      { id: "i-d-rather-fight-one-horse-sized-duck-than-100-d", text: "I’d rather fight one horse-sized duck than 100 duck-sized horses.", agree: 53 },
      { id: "kids-under-13-shouldn-t-own-smartphones", text: "Kids under 13 shouldn’t own smartphones.", agree: 60 },
      { id: "cereal-is-a-soup", text: "Cereal is a soup.", agree: 18 },
      { id: "self-driving-cars-will-be-safer-than-human-drive", text: "Self-driving cars will be safer than human drivers.", agree: 50 },
    ],
  },
  {
    theme: "Internet life",
    takes: [
      { id: "posting-your-relationship-online-is-cringe", text: "Posting your relationship online is cringe.", agree: 45 },
      { id: "the-middle-armrest-belongs-to-the-middle-seat", text: "The middle armrest belongs to the middle seat.", agree: 70 },
      { id: "every-group-chat-needs-rules", text: "Every group chat needs rules.", agree: 35 },
      { id: "the-office-is-overrated", text: "The Office is overrated.", agree: 38 },
      { id: "unfollowing-a-friend-is-a-bigger-deal-than-peopl", text: "Unfollowing a friend is a bigger deal than people admit.", agree: 62 },
    ],
  },
  {
    theme: "Little moral dilemmas",
    takes: [
      { id: "it-s-okay-to-lie-about-your-age-online", text: "It’s okay to lie about your age online.", agree: 40 },
      { id: "a-world-without-music-is-worse-than-a-world-with", text: "A world without music is worse than a world without movies.", agree: 70 },
      { id: "pirating-a-movie-is-fine-if-it-s-not-on-any-stre", text: "Pirating a movie is fine if it’s not on any streaming service.", agree: 55 },
      { id: "i-d-last-longer-than-most-people-in-a-zombie-apo", text: "I’d last longer than most people in a zombie apocalypse.", agree: 46 },
      { id: "reading-a-text-that-pops-up-on-someone-s-screen", text: "Reading a text that pops up on someone’s screen is fair game.", agree: 35 },
    ],
  },
  {
    theme: "Friends & social rules",
    takes: [
      { id: "reclining-your-seat-on-a-plane-is-rude", text: "Reclining your seat on a plane is rude.", agree: 48 },
      { id: "ranch-is-the-greatest-sauce-ever-invented", text: "Ranch is the greatest sauce ever invented.", agree: 40 },
      { id: "re-gifting-a-present-is-totally-fine", text: "Re-gifting a present is totally fine.", agree: 62 },
      { id: "watching-videos-on-speaker-in-public-should-be-i", text: "Watching videos on speaker in public should be illegal.", agree: 72 },
      { id: "you-can-only-have-one-true-best-friend", text: "You can only have one true best friend.", agree: 45 },
    ],
  },
  {
    theme: "Family & growing up",
    takes: [
      { id: "the-oldest-sibling-has-it-the-hardest", text: "The oldest sibling has it the hardest.", agree: 57 },
      { id: "the-book-is-always-better-than-the-movie", text: "The book is always better than the movie.", agree: 62 },
      { id: "kids-should-get-paid-for-doing-chores", text: "Kids should get paid for doing chores.", agree: 52 },
      { id: "being-too-hot-is-worse-than-being-too-cold", text: "Being too hot is worse than being too cold.", agree: 55 },
      { id: "being-an-only-child-beats-having-siblings", text: "Being an only child beats having siblings.", agree: 36 },
    ],
  },
  {
    theme: "School",
    takes: [
      { id: "college-isn-t-worth-the-money-anymore", text: "College isn’t worth the money anymore.", agree: 45 },
      { id: "if-aliens-landed-and-offered-me-a-ride-i-d-go", text: "If aliens landed and offered me a ride, I’d go.", agree: 38 },
      { id: "phones-should-be-banned-at-school-all-day", text: "Phones should be banned at school all day.", agree: 45 },
      { id: "breakfast-for-dinner-beats-actual-dinner", text: "Breakfast for dinner beats actual dinner.", agree: 55 },
      { id: "being-smart-matters-less-than-being-hard-working", text: "Being smart matters less than being hard-working.", agree: 68 },
    ],
  },
  {
    theme: "Life choices",
    takes: [
      { id: "you-should-never-lend-money-to-friends", text: "You should never lend money to friends.", agree: 45 },
      { id: "standing-up-the-second-the-plane-lands-is-fine", text: "Standing up the second the plane lands is fine.", agree: 31 },
      { id: "lottery-tickets-are-a-waste-of-money-even-just-f", text: "Lottery tickets are a waste of money, even “just for fun.”", agree: 55 },
      { id: "every-superhero-movie-is-basically-the-same-movi", text: "Every superhero movie is basically the same movie.", agree: 55 },
      { id: "waking-up-at-5-a-m-is-overrated", text: "Waking up at 5 a.m. is overrated.", agree: 64 },
    ],
  },
  {
    theme: "Love & dating",
    takes: [
      { id: "long-distance-relationships-are-never-worth-it", text: "Long-distance relationships are never worth it.", agree: 35 },
      { id: "calling-is-better-than-texting", text: "Calling is better than texting.", agree: 32 },
      { id: "meeting-on-an-app-is-just-as-good-as-meeting-in", text: "Meeting on an app is just as good as meeting in person.", agree: 45 },
      { id: "living-forever-would-be-a-curse-not-a-gift", text: "Living forever would be a curse, not a gift.", agree: 56 },
      { id: "your-partner-should-be-your-best-friend", text: "Your partner should be your best friend.", agree: 70 },
    ],
  },
  {
    theme: "Fame & celebrities",
    takes: [
      { id: "reality-tv-is-better-than-scripted-tv", text: "Reality TV is better than scripted TV.", agree: 30 },
      { id: "fries-dipped-in-a-milkshake-is-elite", text: "Fries dipped in a milkshake is elite.", agree: 50 },
      { id: "most-movie-sequels-are-cash-grabs", text: "Most movie sequels are cash grabs.", agree: 66 },
      { id: "clapping-when-a-movie-ends-is-cringe", text: "Clapping when a movie ends is cringe.", agree: 52 },
      { id: "nepo-babies-deserve-their-success-if-they-re-act", text: "Nepo babies deserve their success if they’re actually talented.", agree: 47 },
    ],
  },
  {
    theme: "Tech & AI",
    takes: [
      { id: "using-ai-to-write-an-essay-is-cheating-even-if-y", text: "Using AI to write an essay is cheating, even if you edit it.", agree: 55 },
      { id: "movies-are-way-too-long-now", text: "Movies are way too long now.", agree: 64 },
      { id: "social-media-has-done-more-harm-than-good", text: "Social media has done more harm than good.", agree: 62 },
      { id: "sunrises-are-prettier-than-sunsets", text: "Sunrises are prettier than sunsets.", agree: 29 },
      { id: "ai-chatbots-will-make-people-lonelier", text: "AI chatbots will make people lonelier.", agree: 60 },
    ],
  },
  {
    theme: "Internet life",
    takes: [
      { id: "read-receipts-should-be-banned", text: "Read receipts should be banned.", agree: 48 },
      { id: "talking-to-animals-beats-speaking-every-language", text: "Talking to animals beats speaking every language.", agree: 61 },
      { id: "you-should-never-post-someone-without-asking", text: "You should never post someone without asking.", agree: 66 },
      { id: "a-pop-tart-is-basically-a-ravioli", text: "A Pop-Tart is basically a ravioli.", agree: 24 },
      { id: "online-friends-can-be-just-as-real-as-friends-yo", text: "Online friends can be just as real as friends you see in person.", agree: 56 },
    ],
  },
  {
    theme: "Little moral dilemmas",
    takes: [
      { id: "white-lies-make-relationships-stronger", text: "White lies make relationships stronger.", agree: 52 },
      { id: "a-voice-note-longer-than-a-minute-is-a-crime", text: "A voice note longer than a minute is a crime.", agree: 57 },
      { id: "if-self-checkout-misses-an-item-that-s-not-your", text: "If self-checkout misses an item, that’s not your problem.", agree: 41 },
      { id: "harry-potter-is-overrated", text: "Harry Potter is overrated.", agree: 34 },
      { id: "eating-a-grape-or-two-at-the-store-before-paying", text: "Eating a grape or two at the store before paying is fine.", agree: 39 },
    ],
  },
  {
    theme: "Friends & social rules",
    takes: [
      { id: "friend-breakups-hurt-more-than-romantic-breakups", text: "Friend breakups hurt more than romantic breakups.", agree: 54 },
      { id: "traveling-to-the-past-beats-traveling-to-the-fut", text: "Traveling to the past beats traveling to the future.", agree: 56 },
      { id: "you-should-never-date-a-friend-s-ex", text: "You should never date a friend’s ex.", agree: 66 },
      { id: "i-d-go-to-space-if-the-ticket-was-free", text: "I’d go to space if the ticket was free.", agree: 63 },
      { id: "a-group-chat-without-one-of-the-friends-in-it-is", text: "A group chat without one of the friends in it is a betrayal.", agree: 31 },
    ],
  },
  {
    theme: "Family & growing up",
    takes: [
      { id: "parents-should-be-able-to-see-their-teenager-s-l", text: "Parents should be able to see their teenager’s location.", agree: 55 },
      { id: "water-has-a-taste", text: "Water has a taste.", agree: 51 },
      { id: "teenagers-should-have-a-curfew", text: "Teenagers should have a curfew.", agree: 63 },
      { id: "texting-just-hey-and-nothing-else-is-rude", text: "Texting just “hey” and nothing else is rude.", agree: 41 },
      { id: "you-should-move-out-as-soon-as-you-turn-18", text: "You should move out as soon as you turn 18.", agree: 27 },
    ],
  },
  {
    theme: "School",
    takes: [
      { id: "homework-should-be-banned", text: "Homework should be banned.", agree: 49 },
      { id: "musicals-are-better-than-regular-movies", text: "Musicals are better than regular movies.", agree: 28 },
      { id: "school-should-start-at-10-a-m", text: "School should start at 10 a.m.", agree: 67 },
      { id: "a-big-party-beats-a-small-hangout", text: "A big party beats a small hangout.", agree: 37 },
      { id: "students-should-get-to-grade-their-teachers", text: "Students should get to grade their teachers.", agree: 61 },
    ],
  },
  {
    theme: "Life choices",
    takes: [
      { id: "cold-showers-are-worth-it", text: "Cold showers are worth it.", agree: 42 },
      { id: "being-the-funniest-person-in-the-room-beats-bein", text: "Being the funniest person in the room beats being the smartest.", agree: 57 },
      { id: "airports-are-secretly-fun", text: "Airports are secretly fun.", agree: 47 },
      { id: "cold-pizza-beats-hot-pizza", text: "Cold pizza beats hot pizza.", agree: 34 },
      { id: "having-a-five-year-plan-is-pointless", text: "Having a five-year plan is pointless.", agree: 45 },
    ],
  },
  {
    theme: "Love & dating",
    takes: [
      { id: "couples-should-know-each-other-s-phone-passwords", text: "Couples should know each other’s phone passwords.", agree: 40 },
      { id: "taking-your-shoes-off-on-a-plane-is-fine", text: "Taking your shoes off on a plane is fine.", agree: 33 },
      { id: "love-at-first-sight-is-real", text: "Love at first sight is real.", agree: 48 },
      { id: "shrek-2-is-better-than-the-first-shrek", text: "Shrek 2 is better than the first Shrek.", agree: 52 },
      { id: "soulmates-don-t-exist", text: "Soulmates don’t exist.", agree: 42 },
    ],
  },
  {
    theme: "Fame & celebrities",
    takes: [
      { id: "celebrities-owe-fans-a-selfie-if-they-ask-nicely", text: "Celebrities owe fans a selfie if they ask nicely.", agree: 30 },
      { id: "christmas-is-better-than-your-birthday", text: "Christmas is better than your birthday.", agree: 54 },
      { id: "paparazzi-photos-should-be-illegal", text: "Paparazzi photos should be illegal.", agree: 52 },
      { id: "i-d-swap-lives-with-my-pet-for-a-day", text: "I’d swap lives with my pet for a day.", agree: 49 },
      { id: "lip-syncing-at-a-concert-is-fine-if-the-show-is", text: "Lip-syncing at a concert is fine if the show is amazing.", agree: 40 },
    ],
  },
  {
    theme: "Tech & AI",
    takes: [
      { id: "having-an-ai-as-a-friend-is-totally-fine", text: "Having an AI as a friend is totally fine.", agree: 28 },
      { id: "pancakes-are-better-than-waffles", text: "Pancakes are better than waffles.", agree: 53 },
      { id: "using-ai-to-write-a-birthday-message-is-lazy", text: "Using AI to write a birthday message is lazy.", agree: 62 },
      { id: "singing-happy-birthday-at-a-restaurant-is-embarr", text: "Singing “Happy Birthday” at a restaurant is embarrassing for everyone.", agree: 48 },
      { id: "ai-tutors-will-be-better-than-human-teachers", text: "AI tutors will be better than human teachers.", agree: 33 },
    ],
  },
  {
    theme: "Little moral dilemmas",
    takes: [
      { id: "using-a-friend-s-streaming-password-is-totally-f", text: "Using a friend’s streaming password is totally fine.", agree: 68 },
      { id: "taylor-swift-s-old-songs-are-better-than-her-new", text: "Taylor Swift’s old songs are better than her new ones.", agree: 55 },
      { id: "if-you-find-20-on-the-street-you-should-try-to-f", text: "If you find $20 on the street, you should try to find who dropped it.", agree: 34 },
      { id: "city-life-beats-country-life", text: "City life beats country life.", agree: 51 },
      { id: "faking-sick-to-skip-something-you-dread-is-okay", text: "Faking sick to skip something you dread is okay.", agree: 51 },
    ],
  },
  {
    theme: "Friends & social rules",
    takes: [
      { id: "hanging-out-with-your-friend-s-friend-without-th", text: "Hanging out with your friend’s friend without them is fine.", agree: 58 },
      { id: "mint-chocolate-chip-tastes-like-toothpaste", text: "Mint chocolate chip tastes like toothpaste.", agree: 43 },
      { id: "a-real-friend-tells-you-your-outfit-looks-bad-ev", text: "A real friend tells you your outfit looks bad, even right before you leave.", agree: 69 },
      { id: "not-returning-your-shopping-cart-tells-you-every", text: "Not returning your shopping cart tells you everything about a person.", agree: 64 },
      { id: "moving-to-a-new-city-ends-most-friendships", text: "Moving to a new city ends most friendships.", agree: 47 },
    ],
  },
  {
    theme: "School",
    takes: [
      { id: "online-school-beats-going-in-person", text: "Online school beats going in person.", agree: 26 },
      { id: "every-song-sounds-better-sped-up", text: "Every song sounds better sped up.", agree: 27 },
      { id: "copying-homework-isn-t-really-cheating", text: "Copying homework isn’t really cheating.", agree: 29 },
      { id: "beach-trips-beat-mountain-trips", text: "Beach trips beat mountain trips.", agree: 58 },
      { id: "taking-a-gap-year-is-smarter-than-going-straight", text: "Taking a gap year is smarter than going straight to college.", agree: 45 },
    ],
  },
  {
    theme: "Life choices",
    takes: [
      { id: "it-s-better-to-be-overdressed-than-underdressed", text: "It’s better to be overdressed than underdressed.", agree: 68 },
      { id: "crunchy-peanut-butter-beats-smooth", text: "Crunchy peanut butter beats smooth.", agree: 41 },
      { id: "you-should-meet-their-parents-within-the-first-t", text: "You should meet their parents within the first three months.", agree: 44 },
      { id: "walking-in-a-row-that-blocks-the-whole-sidewalk", text: "Walking in a row that blocks the whole sidewalk should be illegal.", agree: 70 },
      { id: "stan-culture-has-made-the-internet-worse", text: "Stan culture has made the internet worse.", agree: 58 },
    ],
  },
  {
    theme: "Love & dating",
    takes: [
      { id: "texting-your-partner-all-day-is-too-much", text: "Texting your partner all day is too much.", agree: 46 },
      { id: "minecraft-is-the-greatest-video-game-ever-made", text: "Minecraft is the greatest video game ever made.", agree: 44 },
      { id: "breaking-up-over-text-is-okay-if-you-only-dated", text: "Breaking up over text is okay if you only dated a few weeks.", agree: 52 },
      { id: "being-famous-would-be-better-than-being-rich", text: "Being famous would be better than being rich.", agree: 21 },
      { id: "splitting-everything-50-50-is-fair-even-if-one-p", text: "Splitting everything 50/50 is fair, even if one person earns way more.", agree: 38 },
    ],
  },
  {
    theme: "Fame & celebrities",
    takes: [
      { id: "concert-tickets-over-200-are-never-worth-it", text: "Concert tickets over $200 are never worth it.", agree: 57 },
      { id: "ketchup-belongs-in-the-fridge", text: "Ketchup belongs in the fridge.", agree: 63 },
      { id: "putting-your-name-on-a-book-someone-else-wrote-i", text: "Putting your name on a book someone else wrote is basically lying.", agree: 49 },
      { id: "old-disney-channel-shows-beat-anything-on-tv-now", text: "Old Disney Channel shows beat anything on TV now.", agree: 59 },
      { id: "you-can-still-love-a-song-even-if-you-can-t-stan", text: "You can still love a song even if you can’t stand the singer.", agree: 72 },
    ],
  },
  {
    theme: "Tech & AI",
    takes: [
      { id: "esports-are-real-sports", text: "Esports are real sports.", agree: 46 },
      { id: "sharks-are-cooler-than-dinosaurs", text: "Sharks are cooler than dinosaurs.", agree: 30 },
      { id: "parents-shouldn-t-post-their-kids-online", text: "Parents shouldn’t post their kids online.", agree: 54 },
      { id: "sushi-is-overrated", text: "Sushi is overrated.", agree: 33 },
      { id: "social-media-would-be-better-without-like-counts", text: "Social media would be better without like counts.", agree: 57 },
    ],
  },
  {
    theme: "Little moral dilemmas",
    takes: [
      { id: "wearing-clothes-once-and-then-returning-them-is", text: "Wearing clothes once and then returning them is fine.", agree: 24 },
      { id: "showering-at-night-beats-showering-in-the-mornin", text: "Showering at night beats showering in the morning.", agree: 52 },
      { id: "if-you-see-a-friend-s-partner-flirting-with-some", text: "If you see a friend’s partner flirting with someone else, stay out of it.", agree: 37 },
      { id: "sour-candy-is-better-than-chocolate", text: "Sour candy is better than chocolate.", agree: 42 },
      { id: "looking-someone-up-online-before-a-first-date-is", text: "Looking someone up online before a first date is smart, not creepy.", agree: 74 },
    ],
  },
  {
    theme: "Life choices",
    takes: [
      { id: "guys-and-girls-can-be-just-friends", text: "Guys and girls can be just friends.", agree: 64 },
      { id: "the-window-seat-is-the-only-acceptable-seat-on-a", text: "The window seat is the only acceptable seat on a plane.", agree: 55 },
      { id: "grandparents-are-more-fun-than-parents", text: "Grandparents are more fun than parents.", agree: 61 },
      { id: "hot-chocolate-beats-coffee", text: "Hot chocolate beats coffee.", agree: 50 },
      { id: "kids-should-be-allowed-to-call-their-parents-by", text: "Kids should be allowed to call their parents by their first names.", agree: 19 },
    ],
  },
];
