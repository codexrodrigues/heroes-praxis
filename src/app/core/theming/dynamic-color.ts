/*
  Dynamic Color (Material You) — lightweight integration
  - Tries to use @material/material-color-utilities if available at runtime
  - Falls back to a simple HSL-based scheme derived from a seed color
  - Writes CSS variables for M3 roles via a <style id="dynamic-color-vars"> tag
*/

// Minimal module declaration safety: if the package exists we will import it dynamically.
// Types are not required here; we operate on 'any'.

function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!m) return { r: 63, g: 188, b: 165 };
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function rgbToHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max - min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 5); break; // bias a bit toward green for tealish brands
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360; s = clamp01(s); l = clamp01(l);
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else { r = c; g = 0; b = x; }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const srgb = [r, g, b].map(v => v / 255);
  const lin = srgb.map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

function contrastRatio(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }) {
  const L1 = relativeLuminance(rgb1);
  const L2 = relativeLuminance(rgb2);
  const [a, b] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (a + 0.05) / (b + 0.05);
}

function bestOnColor(bgHex: string): string {
  const bg = hexToRgb(bgHex);
  const white = { r: 255, g: 255, b: 255 };
  const black = { r: 0, g: 0, b: 0 };
  return contrastRatio(bg, white) >= contrastRatio(bg, black) ? '#FFFFFF' : '#1B1B1B';
}

function rotateHue(hex: string, degrees: number, satFactor = 1, lightFactor = 1) {
  const { r, g, b } = hexToRgb(hex);
  const hsl = rgbToHsl(r, g, b);
  const { r: rr, g: gg, b: bb } = hslToRgb(hsl.h + degrees, hsl.s * satFactor, Math.max(0, Math.min(1, hsl.l * lightFactor)));
  return rgbToHex(rr, gg, bb);
}

function buildFallbackScheme(seed: string) {
  const primary = seed;
  const onPrimary = bestOnColor(primary);
  const secondary = rotateHue(seed, -20, 0.7, 1);
  const onSecondary = bestOnColor(secondary);
  const tertiary = rotateHue(seed, 40, 0.8, 1);
  const onTertiary = bestOnColor(tertiary);
  return {
    light: {
      primary, onPrimary, secondary, onSecondary, tertiary, onTertiary,
    },
    dark: {
      primary: rotateHue(primary, 0, 1, 1.1),
      onPrimary: bestOnColor(rotateHue(primary, 0, 1, 1.1)),
      secondary: rotateHue(secondary, 0, 1, 1.1),
      onSecondary: bestOnColor(rotateHue(secondary, 0, 1, 1.1)),
      tertiary: rotateHue(tertiary, 0, 1, 1.1),
      onTertiary: bestOnColor(rotateHue(tertiary, 0, 1, 1.1)),
    }
  };
}

function upsertStyleTag(id: string, css: string) {
  let el = document.getElementById(id) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = css;
}

function writeCssVarsFromScheme(scheme: { light: any; dark: any }) {
  const css = `
  :root:not(.theme-light):not(.theme-dark) {
    --md-sys-color-primary: ${scheme.light.primary};
    --md-sys-color-on-primary: ${scheme.light.onPrimary};
    --md-sys-color-secondary: ${scheme.light.secondary};
    --md-sys-color-on-secondary: ${scheme.light.onSecondary};
    --md-sys-color-tertiary: ${scheme.light.tertiary};
    --md-sys-color-on-tertiary: ${scheme.light.onTertiary};
  }
  .theme-light {
    --md-sys-color-primary: ${scheme.light.primary};
    --md-sys-color-on-primary: ${scheme.light.onPrimary};
    --md-sys-color-secondary: ${scheme.light.secondary};
    --md-sys-color-on-secondary: ${scheme.light.onSecondary};
    --md-sys-color-tertiary: ${scheme.light.tertiary};
    --md-sys-color-on-tertiary: ${scheme.light.onTertiary};
  }
  .theme-dark {
    --md-sys-color-primary: ${scheme.dark.primary};
    --md-sys-color-on-primary: ${scheme.dark.onPrimary};
    --md-sys-color-secondary: ${scheme.dark.secondary};
    --md-sys-color-on-secondary: ${scheme.dark.onSecondary};
    --md-sys-color-tertiary: ${scheme.dark.tertiary};
    --md-sys-color-on-tertiary: ${scheme.dark.onTertiary};
  }`;
  upsertStyleTag('dynamic-color-vars', css);
}

export async function applyDynamicColor(seed?: string) {
  const seedHex = (seed || localStorage.getItem('theme-seed') || '#3FBCA5').trim();
  // Try Material Color Utilities (if installed)
  try {
    // Dynamic import; may fail if the package is not present.
    // Build the module id dynamically to avoid Vite pre-bundling when not installed.
    const modId = '@material/' + 'material-color-utilities';
    // @vite-ignore ensures Vite doesn't try to resolve this at transform time.
    // It will attempt to resolve at runtime, which we catch if absent.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mcu: any = await import(/* @vite-ignore */ modId);
    const argb = mcu.argbFromHex(seedHex);
    const theme = mcu.themeFromSourceColor(argb);
    // Prefer using the scheme conversion to hex map
    const toHex = (scheme: any) => {
      const obj = scheme.toJSON ? scheme.toJSON() : scheme;
      return {
        primary: obj['primary'],
        onPrimary: obj['on-primary'],
        secondary: obj['secondary'],
        onSecondary: obj['on-secondary'],
        tertiary: obj['tertiary'],
        onTertiary: obj['on-tertiary'],
      };
    };
    const light = toHex(theme.schemes.light);
    const dark = toHex(theme.schemes.dark);
    writeCssVarsFromScheme({ light, dark });
    return;
  } catch {
    // fallback
  }

  const scheme = buildFallbackScheme(seedHex);
  writeCssVarsFromScheme(scheme);
}

export function setThemeSeed(seedHex: string) {
  try { localStorage.setItem('theme-seed', seedHex); } catch {}
  return applyDynamicColor(seedHex);
}
