import { writeFileSync } from "node:fs";

let seed = 10082026;
function rand() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
const between = (a, b) => a + rand() * (b - a);

const W = 1920;
const H = 1080;

/*
 * City skyline generator. Buildings are rects rising from a base line, with
 * occasional rooftop setbacks and antennas; nearer layers get lit windows.
 */
function skyline({ baseY, minH, maxH, minW, maxW, windowChance = 0, windowColor = "#f0e6ba" }) {
  const buildings = [];
  const windows = [];
  let x = -50;
  while (x < W + 50) {
    const w = between(minW, maxW);
    const h = rand() < 0.14 ? between(maxH, maxH * 1.35) : between(minH, maxH); // occasional tower
    const top = baseY - h;
    buildings.push(`<rect x="${Math.round(x)}" y="${Math.round(top)}" width="${Math.round(w)}" height="${Math.round(h + 80)}"/>`);
    if (rand() < 0.32) {
      const sw = w * between(0.35, 0.6);
      buildings.push(`<rect x="${Math.round(x + (w - sw) / 2)}" y="${Math.round(top - between(12, 26))}" width="${Math.round(sw)}" height="30"/>`);
    }
    if (rand() < 0.16) {
      buildings.push(`<rect x="${Math.round(x + w / 2 - 1.5)}" y="${Math.round(top - between(20, 44))}" width="3" height="50"/>`);
    }
    if (windowChance > 0) {
      const cols = Math.floor(w / 17);
      const rows = Math.floor(h / 24);
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          if (rand() > windowChance) continue;
          const wx = x + 7 + c * 17;
          const wy = top + 10 + r * 24;
          const o = between(0.18, 0.6).toFixed(2);
          windows.push(`<rect x="${Math.round(wx)}" y="${Math.round(wy)}" width="6" height="9" fill="${windowColor}" opacity="${o}"/>`);
        }
      }
    }
    x += w + between(2, 30);
  }
  return { buildings: buildings.join("\n    "), windows: windows.join("\n    ") };
}

function stars(count, maxY) {
  const out = [];
  for (let i = 0; i < count; i++) {
    const x = Math.round(between(0, W));
    const y = Math.round(between(20, maxY));
    const r = between(0.7, 1.7).toFixed(1);
    const o = between(0.12, 0.55).toFixed(2);
    out.push(`  <circle cx="${x}" cy="${y}" r="${r}" fill="#e8f1e6" opacity="${o}"/>`);
  }
  return out.join("\n");
}

const head = (extra = "") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
  <defs>
${extra}
  </defs>
`;

/* ── hero layer 1: starfield sky + hazy distant skyline ── */
const far = skyline({ baseY: 790, minH: 50, maxH: 170, minW: 34, maxW: 90 });
const sky = `${head(`    <linearGradient id="hsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0f2626"/>
      <stop offset="0.45" stop-color="#284744"/>
      <stop offset="0.78" stop-color="#6f8f85"/>
      <stop offset="1" stop-color="#a7bfae"/>
    </linearGradient>
    <radialGradient id="hglow" cx="0.5" cy="0.66" r="0.62">
      <stop offset="0" stop-color="#f0f2da" stop-opacity="0.8"/>
      <stop offset="0.4" stop-color="#d5e0c6" stop-opacity="0.3"/>
      <stop offset="1" stop-color="#d5e0c6" stop-opacity="0"/>
    </radialGradient>
    <filter id="hsoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="hhaze" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28"/></filter>
    <filter id="hgrain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.04 0"/>
    </filter>`)}
  <rect width="${W}" height="${H}" fill="url(#hsky)"/>
${stars(70, 420)}
  <rect width="${W}" height="${H}" fill="url(#hglow)"/>
  <g fill="#71908a" filter="url(#hsoft)" opacity="0.75">
    ${far.buildings}
  </g>
  <rect x="-100" y="700" width="${W + 200}" height="180" fill="#dde8d8" opacity="0.32" filter="url(#hhaze)"/>
  <rect width="${W}" height="${H}" filter="url(#hgrain)" opacity="0.5"/>
</svg>
`;

/* ── hero layer 2: mid skyline with sparse lit windows ── */
const mid = skyline({ baseY: 905, minH: 110, maxH: 300, minW: 46, maxW: 120, windowChance: 0.05 });
const midSvg = `${head(`    <filter id="hmid" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2"/></filter>
    <filter id="hhaze2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="26"/></filter>`)}
  <g filter="url(#hmid)">
    <g fill="#42615b">
    ${mid.buildings}
    </g>
    <g>
    ${mid.windows}
    </g>
  </g>
  <rect x="-100" y="800" width="${W + 200}" height="150" fill="#d3dfcd" opacity="0.26" filter="url(#hhaze2)"/>
</svg>
`;

/* ── hero layer 3: near dark skyline, more lit windows ── */
const front = skyline({ baseY: 1105, minH: 200, maxH: 430, minW: 64, maxW: 170, windowChance: 0.09 });
const frontSvg = `${head(`    <filter id="hhaze3" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="24"/></filter>`)}
  <g fill="#0f2528">
    ${front.buildings}
  </g>
  <g>
    ${front.windows}
  </g>
  <rect x="-100" y="960" width="${W + 200}" height="120" fill="#c9d6c4" opacity="0.15" filter="url(#hhaze3)"/>
</svg>
`;

/* ── dark cityscape for the direct-path section ── */
const cFar = skyline({ baseY: 720, minH: 60, maxH: 190, minW: 36, maxW: 96 });
const cMid = skyline({ baseY: 880, minH: 120, maxH: 330, minW: 50, maxW: 130, windowChance: 0.06, windowColor: "#e8dba6" });
const cNear = skyline({ baseY: 1110, minH: 220, maxH: 470, minW: 70, maxW: 180, windowChance: 0.08, windowColor: "#e8dba6" });
const city = `${head(`    <linearGradient id="csky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0a1c1c"/>
      <stop offset="0.55" stop-color="#1d3936"/>
      <stop offset="0.85" stop-color="#54736a"/>
      <stop offset="1" stop-color="#7d988a"/>
    </linearGradient>
    <radialGradient id="cglow" cx="0.5" cy="0.72" r="0.6">
      <stop offset="0" stop-color="#e9efd6" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#e9efd6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="cvig" cx="0.5" cy="0.45" r="0.9">
      <stop offset="0" stop-color="#04110f" stop-opacity="0"/>
      <stop offset="0.7" stop-color="#04110f" stop-opacity="0"/>
      <stop offset="1" stop-color="#04110f" stop-opacity="0.5"/>
    </radialGradient>
    <filter id="csoft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="cmid" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6"/></filter>
    <filter id="chaze" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="26"/></filter>
    <filter id="cgrain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.045 0"/>
    </filter>`)}
  <rect width="${W}" height="${H}" fill="url(#csky)"/>
${stars(46, 330)}
  <rect width="${W}" height="${H}" fill="url(#cglow)"/>
  <g fill="#3c5a53" filter="url(#csoft)" opacity="0.8">
    ${cFar.buildings}
  </g>
  <rect x="-100" y="640" width="${W + 200}" height="160" fill="#c9d8c6" opacity="0.2" filter="url(#chaze)"/>
  <g filter="url(#cmid)">
    <g fill="#1c3833">
    ${cMid.buildings}
    </g>
    <g>
    ${cMid.windows}
    </g>
  </g>
  <rect x="-100" y="810" width="${W + 200}" height="140" fill="#bccbba" opacity="0.16" filter="url(#chaze)"/>
  <g fill="#0a1e1f">
    ${cNear.buildings}
  </g>
  <g>
    ${cNear.windows}
  </g>
  <rect width="${W}" height="${H}" fill="url(#cvig)"/>
  <rect width="${W}" height="${H}" filter="url(#cgrain)" opacity="0.5"/>
</svg>
`;

writeFileSync(new URL("../public/hero-sky.svg", import.meta.url), sky);
writeFileSync(new URL("../public/hero-mid.svg", import.meta.url), midSvg);
writeFileSync(new URL("../public/hero-front.svg", import.meta.url), frontSvg);
writeFileSync(new URL("../public/city-bg.svg", import.meta.url), city);
console.log("hero-sky, hero-mid, hero-front, city-bg written");
