// Feedback effects: toasts, shake, confetti, tiny vibrations.
import { prefersReducedMotion } from './util.js';

let toastHost;

export function toast(message, ms = 1800) {
  if (!toastHost) {
    toastHost = document.createElement('div');
    toastHost.className = 'toasts';
    toastHost.setAttribute('role', 'status');
    toastHost.setAttribute('aria-live', 'polite');
    toastHost.setAttribute('popover', 'manual'); // popovers sit above open dialogs
    document.body.append(toastHost);
  }
  try {
    if (toastHost.matches(':popover-open')) toastHost.hidePopover();
    toastHost.showPopover?.();
  } catch {
    /* older browsers: it's still a fixed-position element */
  }
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = message;
  toastHost.append(el);
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => el.remove(), 250);
  }, ms);
}

export function shake(el) {
  if (!el) return;
  el.classList.remove('shake');
  void el.offsetWidth; // restart the animation
  el.classList.add('shake');
  buzz([20, 40, 20]);
}

export function pop(el) {
  if (!el) return;
  el.classList.remove('pop');
  void el.offsetWidth;
  el.classList.add('pop');
}

export function buzz(pattern = 12) {
  // Browsers only allow vibration after the player has tapped something.
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* not supported */
  }
}

export function confetti({ count = 140, duration = 1800 } = {}) {
  if (prefersReducedMotion()) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'confetti';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W = (canvas.width = innerWidth * dpr);
  const H = (canvas.height = innerHeight * dpr);
  const ctx = canvas.getContext('2d');
  const css = getComputedStyle(document.documentElement);
  const colors = [
    css.getPropertyValue('--game').trim() || '#f55',
    css.getPropertyValue('--good').trim() || '#3c6',
    css.getPropertyValue('--close').trim() || '#fc3',
    css.getPropertyValue('--line').trim() || '#222',
    '#ffffff',
  ];
  const bits = Array.from({ length: count }, () => ({
    x: W / 2 + (Math.random() - 0.5) * W * 0.3,
    y: H * 0.35,
    vx: (Math.random() - 0.5) * 22 * dpr,
    vy: (-Math.random() * 18 - 6) * dpr,
    w: (6 + Math.random() * 8) * dpr,
    h: (4 + Math.random() * 6) * dpr,
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.4,
    c: colors[Math.floor(Math.random() * colors.length)],
  }));
  const start = performance.now();
  const frame = (now) => {
    const t = now - start;
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = Math.max(0, 1 - Math.max(0, t - duration * 0.6) / (duration * 0.4));
    for (const b of bits) {
      b.vy += 0.55 * dpr;
      b.vx *= 0.985;
      b.x += b.vx;
      b.y += b.vy;
      b.r += b.vr;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.r);
      ctx.fillStyle = b.c;
      ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
    }
    if (t < duration) requestAnimationFrame(frame);
    else canvas.remove();
  };
  requestAnimationFrame(frame);
}
