// "What did everyone else answer?" lives here.
//
// Hot Take and Tier List compare you with all players. That needs a shared database
// (Supabase or Firebase both have free tiers). Until one is connected, this returns the
// sample numbers written into each puzzle file and the UI labels them "Sample crowd data".
//
// To go live, replace the two functions below with real calls, e.g. for Supabase:
//   submit → insert into answers (game, day, key, value)
//   get    → select the aggregate for (game, day, key)
// and set isSample to false.

export function createCrowd({ gameId, day, store }) {
  return {
    isSample: true,

    /** Record this player's answer, e.g. submit('take:hotdog', { vote: 'agree', guess: 40 }) */
    async submit(key, value) {
      store.set(`crowd:${day}:${key}`, value);
    },

    /** Get the crowd's result for a key. `sample` is the fallback from the puzzle file. */
    async get(key, sample) {
      return sample;
    },
  };
}
