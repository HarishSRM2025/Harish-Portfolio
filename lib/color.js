// Converts "#6366f1" -> "99 102 241" (space separated RGB channels),
// the format Tailwind needs for `rgb(var(--x) / <alpha-value>)`.
export function hexToRgbChannels(hex) {
  if (!hex) return "99 102 241";
  const clean = hex.replace("#", "");
  const bigint = parseInt(
    clean.length === 3
      ? clean.split("").map((c) => c + c).join("")
      : clean,
    16
  );
  if (Number.isNaN(bigint)) return "99 102 241";
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r} ${g} ${b}`;
}

function mix(hex, targetHex, weight) {
  const clean = (h) => h.replace("#", "");
  const c1 = parseInt(clean(hex), 16);
  const c2 = parseInt(clean(targetHex), 16);
  const r = Math.round(((c1 >> 16) & 255) * (1 - weight) + ((c2 >> 16) & 255) * weight);
  const g = Math.round(((c1 >> 8) & 255) * (1 - weight) + ((c2 >> 8) & 255) * weight);
  const b = Math.round((c1 & 255) * (1 - weight) + (c2 & 255) * weight);
  return `${r} ${g} ${b}`;
}

// Builds the full set of CSS variable values derived from a single primary hex color.
export function buildPrimaryShades(hex) {
  const safeHex = /^#([0-9a-f]{3}){1,2}$/i.test(hex || "") ? hex : "#6366f1";
  return {
    "--color-primary": hexToRgbChannels(safeHex),
    "--color-primary-50": mix(safeHex, "#ffffff", 0.92),
    "--color-primary-100": mix(safeHex, "#ffffff", 0.82),
    "--color-primary-700": mix(safeHex, "#000000", 0.25)
  };
}
