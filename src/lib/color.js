// WCAG contrast helpers for dynamic accent colors (bot accent_color from DB later).
function srgb(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

export function luminance(hex) {
  const m = hex.replace('#', '');
  const full = m.length === 3 ? m.split('').map((ch) => ch + ch).join('') : m;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
}

export function contrastRatio(a, b) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

// Picks black or white text for a given background accent (>= 4.5:1 target).
export function textOn(hex) {
  return contrastRatio(hex, '#000000') >= contrastRatio(hex, '#ffffff') ? '#000000' : '#ffffff';
}

// Blends accent at alpha over a surface (both hex), returns the blended hex.
export function blendOver(accentHex, surfaceHex, alpha = 0.12) {
  const ch = (h) => {
    const m = h.replace('#', '');
    const f = m.length === 3 ? m.split('').map((c) => c + c).join('') : m;
    return [0, 2, 4].map((i) => parseInt(f.slice(i, i + 2), 16));
  };
  const a = ch(accentHex);
  const s = ch(surfaceHex);
  return (
    '#' +
    a
      .map((v, i) => Math.round(v * alpha + s[i] * (1 - alpha)))
      .map((v) => v.toString(16).padStart(2, '0'))
      .join('')
  );
}

// Theme surfaces used for accent ink math. Mirrors tokens.css --bg-elev values;
// keep in sync when editing tokens.
export const SURFACES = { dark: '#171b21', light: '#ffffff' };

// Best readable ink for text tinted with an accent on a surface: tries the
// accent itself, then black/white, keeps the highest contrast vs the real
// (blended) background. Used for bot accent avatars on any theme.
export function accentInk(accentHex, surfaceHex) {
  const bg = blendOver(accentHex, surfaceHex);
  const candidates = [accentHex, '#000000', '#ffffff'];
  let best = candidates[0];
  let bestC = -1;
  for (const c of candidates) {
    const cr = contrastRatio(c, bg);
    if (cr > bestC) {
      bestC = cr;
      best = c;
    }
  }
  return best;
}
