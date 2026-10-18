// Date math for "puzzle #N". A new puzzle unlocks at the player's local midnight, like Wordle.

const DAY = 864e5;

/** Whole days since 1970 for a calendar date in the player's timezone (DST-safe). */
const dayIndex = (d) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY);

const isoIndex = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / DAY);
};

/** Today's puzzle number, where `launch` (YYYY-MM-DD) is puzzle #1. */
export const todayNumber = (launch, now = new Date()) => dayIndex(now) - isoIndex(launch) + 1;

/** The calendar date a puzzle number was (or will be) live. */
export function dateOf(launch, n) {
  const utc = new Date((isoIndex(launch) + n - 1) * DAY);
  return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
}

export const formatDate = (date) =>
  date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

export function msUntilMidnight(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) - now;
}

export function formatCountdown(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}
