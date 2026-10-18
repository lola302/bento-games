// Hand-drawn doodles (inline SVG). Lines use .ink (pen color), fills use .fill (the game color,
// via --dc) and sit slightly off the outline, like a misprinted sticker. The #sketch filter
// makes every line a little wobbly so nothing looks computer-perfect.

const DOODLES = {
  bento: `
    <rect class="k1" x="10" y="16" width="14" height="16" rx="3"/>
    <rect class="k2" x="27" y="16" width="13" height="16" rx="3"/>
    <rect class="k3" x="43" y="16" width="14" height="16" rx="3"/>
    <rect class="k4" x="10" y="36" width="14" height="17" rx="3"/>
    <rect class="k5" x="27" y="36" width="13" height="17" rx="3"/>
    <rect class="k6" x="43" y="36" width="14" height="17" rx="3"/>
    <path class="ink" d="M8 13.5C20 12.2 44 12.6 57.5 13.2C58.6 26 58.1 42 57.2 54.6C44 55.4 20 55 7.6 54.4C6.6 42 6.9 26 8 13.5Z"/>
    <path class="ink" d="M25 13.5C24.4 27 25.2 41 24.8 54.6M41.4 13.2C42 27 41.1 41 41.6 54.8M7.7 34C24 34.9 42 33.4 57.5 34.3"/>
    <path class="ink" d="M29 10.5L61.5 3.5M31.5 12.6L62.5 8.4"/>`,

  chili: `
    <path class="fill" transform="translate(2.5 2.5)" d="M20 25C33 21 47 28 51 42C53 50 51 57 47 56C44 46 36 37 23 35C15 34 13 27 20 25Z"/>
    <path class="ink" d="M20 25C33 21 47 28 51 42C53 50 51 57 47 56C44 46 36 37 23 35C15 34 13 27 20 25Z"/>
    <path class="leaf" d="M14 28C16 22 23 20.5 27.5 24.5C24 27.5 18 29.5 14 28Z"/>
    <path class="ink" d="M14 28C16 22 23 20.5 27.5 24.5M19.5 24C17 18 20 13 26.5 11"/>
    <path class="ink thin" d="M28 28.5C33.5 28.6 38.5 31.5 41.5 35.5"/>`,

  mask: `
    <path class="fill" transform="translate(2 2.5)" d="M9 28C9 19 22 17 32 23C42 17 55 19 55 28C55 39 43 42 32 36C21 42 9 39 9 28Z"/>
    <path class="ink" d="M9 28C9 19 22 17 32 23C42 17 55 19 55 28C55 39 43 42 32 36C21 42 9 39 9 28Z"/>
    <path class="ink" d="M9 27C6 26 4 26.2 1.8 27.4M55 27C58 26 60 26.2 62.2 27.4"/>
    <path class="ink" d="M15.5 29C18.5 32.4 23.5 32.4 26.5 29M37.5 29C40.5 32.4 45.5 32.4 48.5 29"/>
    <path class="ink thin" d="M17.5 32L16 35M21 33.2V36.4M24.5 32L26 35M39.5 32L38 35M43 33.2V36.4M46.5 32L48 35"/>
    <path class="ink" d="M27.5 9C27.5 4.5 36.5 4 36.5 8.6C36.5 12 32 12 32 15.2M32 18.4V18.8"/>`,

  jar: `
    <path class="glass" d="M18 16C12.5 21 12 48 16 55C26 57 40 57 48 55C52 48 51.5 21 46 16Z"/>
    <ellipse class="k1" cx="23" cy="49" rx="4.4" ry="2.8" transform="rotate(-20 23 49)"/>
    <ellipse class="k3" cx="32" cy="51" rx="4.4" ry="2.8" transform="rotate(15 32 51)"/>
    <ellipse class="k5" cx="41" cy="49" rx="4.4" ry="2.8" transform="rotate(-10 41 49)"/>
    <ellipse class="k2" cx="27" cy="43" rx="4.4" ry="2.8" transform="rotate(25 27 43)"/>
    <ellipse class="k4" cx="37" cy="43" rx="4.4" ry="2.8" transform="rotate(-30 37 43)"/>
    <ellipse class="k6" cx="20" cy="40" rx="4.2" ry="2.7" transform="rotate(40 20 40)"/>
    <ellipse class="k1" cx="44" cy="39" rx="4.2" ry="2.7" transform="rotate(-45 44 39)"/>
    <ellipse class="k5" cx="31.5" cy="36" rx="4.2" ry="2.7" transform="rotate(5 31.5 36)"/>
    <path class="fill" transform="translate(1.6 1.6)" d="M20 7.5C28 6.8 37 7.2 44 7.4L44.4 14.6C36 15.2 28 14.8 19.8 14.8Z"/>
    <path class="ink" d="M20 7.5C28 6.8 37 7.2 44 7.4L44.4 14.6C36 15.2 28 14.8 19.8 14.8Z"/>
    <path class="ink" d="M18.5 15.5C12.5 21 12 48 16 55.2C26 57.2 40 57.2 48.2 55.2C52 48 51.6 21 45.6 15.5"/>
    <path class="ink thin" d="M21 22C19.5 27 19.3 32 19.8 35"/>`,

  polaroid: `
    <g transform="rotate(-6 32 32)">
      <path class="paper" d="M12 7C25 6.5 40 6.8 52 7.2C52.6 25 52.4 42 52 58C39 58.6 25 58.3 12.2 58C11.6 41 11.6 24 12 7Z"/>
      <path class="fill" d="M16.5 11.5H47.5V43.5H16.5Z"/>
      <circle class="sun" cx="40.5" cy="19.5" r="3.8"/>
      <path class="ink" d="M12 7C25 6.5 40 6.8 52 7.2C52.6 25 52.4 42 52 58C39 58.6 25 58.3 12.2 58C11.6 41 11.6 24 12 7Z"/>
      <path class="ink" d="M16 11.2C26 10.9 38 11.1 48 11.3C48.3 22 48.2 33 48 44C38 44.3 26 44.2 16.2 44C15.9 33 15.9 22 16 11.2Z"/>
      <path class="ink" d="M16.5 40.5L26 28.5L32 35.5L37 30.5L47.5 40.5"/>
      <circle class="ink thin" cx="40.5" cy="19.5" r="3.8"/>
      <path class="ink thin" d="M19 51.5C23 49.5 27 53.5 31 51.5C35 49.5 39 53.5 43 51.5"/>
    </g>`,

  bolt: `
    <path class="fill" transform="translate(2.5 2.5)" d="M37 4L14 36L30 35L23 60L51 24L34 25L42 4Z"/>
    <path class="ink" d="M37 4L14 36L30 35L23 60L51 24L34 25L42 4Z"/>
    <path class="ink thin" d="M52.5 9L57 5.5M55.5 15.5H61M11.5 47.5L7 51M10 41H4"/>`,

  ear: `
    <path class="fill" transform="translate(2.5 2.5)" d="M21 27C20 14 32 7.5 41 11C50 14.5 51 29 43.5 35C38.5 39 38.5 44 36 50C33 57 23 57.5 20.5 50.5C18.5 44.5 22.5 40 21 27Z"/>
    <path class="ink" d="M21 27C20 14 32 7.5 41 11C50 14.5 51 29 43.5 35C38.5 39 38.5 44 36 50C33 57 23 57.5 20.5 50.5C18.5 44.5 22.5 40 21 27Z"/>
    <path class="ink" d="M27.5 26C27 19.5 35 16.5 39 20.5C43 24.5 39.5 29.5 35.5 30.5C32.5 31.3 32.2 35 34 37.5"/>
    <path class="ink" d="M53 23.5C57 28 57 34 53 38.5M58 18.5C64 26 64 36 58 43.5"/>`,

  gavel: `
    <path class="paper" d="M31 27L35 23L57 45C58 47 56 49 54 48Z"/>
    <path class="ink" d="M31 27L35 23L57 45C58 47 56 49 54 48Z"/>
    <path class="fill" transform="translate(2 2)" d="M12 21L28 5L42 19L26 35Z"/>
    <path class="ink" d="M12 21L28 5L42 19L26 35Z"/>
    <path class="ink thin" d="M17 16L31 30M23 10L37 24"/>
    <path class="fill" transform="translate(1.5 1.5)" d="M6 54C14 52.6 30 52.8 38 54L38 60H6Z"/>
    <path class="ink" d="M6 54C14 52.6 30 52.8 38 54L38 60H6Z"/>
    <path class="ink thin" d="M46 52L52 50M44 58L51 59M8 8L4 4M14 4L13 0"/>`,

  chef: `
    <path class="paper" d="M17 38C5 36 6 18 19 20C19 8 40 6 42 18C55 14 60 34 47 38Z"/>
    <path class="ink" d="M17 38C5 36 6 18 19 20C19 8 40 6 42 18C55 14 60 34 47 38Z"/>
    <path class="fill" transform="translate(1.5 1.5)" d="M18 38H47V52H18Z"/>
    <path class="ink" d="M18 38C28 37 38 37.4 47 38L47 52C38 52.6 28 52.4 18 52Z"/>
    <path class="ink thin" d="M26 42V49M32.5 42V49M39 42V49"/>`,

  note: `
    <ellipse class="fill" cx="21" cy="47" rx="8.5" ry="6.2" transform="rotate(-20 21 47)"/>
    <ellipse class="fill" cx="45" cy="41" rx="8.5" ry="6.2" transform="rotate(-20 45 41)"/>
    <path class="ink" d="M28.5 45V14.5L52.5 8.5V39"/>
    <path class="ink" d="M28.5 23L52.5 17"/>
    <ellipse class="ink" cx="21" cy="47" rx="8.5" ry="6.2" transform="rotate(-20 21 47)"/>
    <ellipse class="ink" cx="45" cy="41" rx="8.5" ry="6.2" transform="rotate(-20 45 41)"/>`,

  play: `
    <path class="fill" transform="translate(2 2)" d="M9 12C24 10.5 40 10.5 55 12C56.6 24 56.6 40 55 52C40 53.5 24 53.5 9 52C7.5 40 7.5 24 9 12Z"/>
    <path class="ink" d="M9 12C24 10.5 40 10.5 55 12C56.6 24 56.6 40 55 52C40 53.5 24 53.5 9 52C7.5 40 7.5 24 9 12Z"/>
    <path class="paper" d="M26 21.5L43 32L26 42.5Z"/>
    <path class="ink" d="M26 21.5L43 32L26 42.5Z"/>`,

  bubble: `
    <path class="fill" transform="translate(2 2)" d="M8 14C8 8 14 6 32 6C50 6 56 8 56 14V35C56 41 50 43 32 43H25L13 55L15 43C10 43 8 41 8 35Z"/>
    <path class="ink" d="M8 14C8 8 14 6 32 6C50 6 56 8 56 14V35C56 41 50 43 32 43H25L13 55L15 43C10 43 8 41 8 35Z"/>
    <path class="ink thin" d="M18 19.5H46M18 29H38"/>`,

  check: `<path class="ink" d="M10 34C16 38 20 44 23 50C30 34 40 22 54 12"/>`,
  cross: `<path class="ink" d="M14 14C26 26 38 38 50 50M50 14C38 26 26 38 14 50"/>`,
  star: `<path class="fill" transform="translate(2 2)" d="M32 6L39 24L58 25L43 37L48 56L32 45L16 56L21 37L6 25L25 24Z"/>
    <path class="ink" d="M32 6L39 24L58 25L43 37L48 56L32 45L16 56L21 37L6 25L25 24Z"/>`,
};

/** <svg> markup for a doodle. Size it with CSS (--size) and color it with --dc. */
export function doodle(name, label) {
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"';
  return `<svg class="doodle doodle-${name}" viewBox="0 0 64 64" ${a11y}>${DOODLES[name] || ''}</svg>`;
}

/** The shared SVG filter that roughens lines. Insert once per page. */
export const SKETCH_DEFS = `<svg class="defs" width="0" height="0" aria-hidden="true" focusable="false">
  <filter id="sketch" x="-8%" y="-8%" width="116%" height="116%">
    <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="noise"/>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.2" xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</svg>`;
