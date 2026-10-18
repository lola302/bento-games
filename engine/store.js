// Saves progress, stats and unlocks in the browser. Each site keeps its own data.
// Storage can be blocked (private mode, school devices), so every call fails quietly.

export function createStore(namespace) {
  const key = (k) => `${namespace}:v1:${k}`;
  return {
    get(k, fallback = null) {
      try {
        const raw = localStorage.getItem(key(k));
        return raw == null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(k, value) {
      try {
        localStorage.setItem(key(k), JSON.stringify(value));
      } catch {
        /* storage full or blocked: the game still works, it just won't remember */
      }
    },
  };
}
