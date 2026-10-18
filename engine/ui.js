// Small drawn UI pieces games share.
import { h } from './util.js';

/** Map a share-grid emoji to a marker color class. */
export const toneOf = (mark) =>
  ({ '🎯': 'exact', '🟩': 'good', '🟨': 'close', '🟧': 'close', '🟥': 'bad', '⬛': 'bad', '❌': 'bad' })[mark] || 'todo';

/**
 * A row of hand-drawn progress boxes.
 * states: 'todo' | 'current' | 'exact' | 'good' | 'close' | 'bad'
 */
export function pips(states) {
  return h(
    'div',
    { class: 'pips', 'aria-hidden': 'true' },
    states.map((s) => h('span', { class: `pip is-${s}` })),
  );
}

/** A label-maker style tag, e.g. tag('Take 2 of 5'). */
export const tag = (text, extra = '') => h('span', { class: `tag ${extra}`.trim() }, text);
