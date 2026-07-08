import { writeFileSync } from "node:fs";

/*
 * Hiring-constellation backgrounds: ghosted candidate profile chips and
 * company nodes joined by faint threads, plus one green "right match" thread.
 * Emits bento-bg.svg (left-heading layout) and comparison-bg.svg (centered
 * heading layout, its own arrangement).
 */

function makeScene({ seed, H, clear, match }) {
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const between = (a, b) => a + rand() * (b - a);
  const W = 1920;

  const nodes = [];
  const COLS = 6;
  const ROWS = 6;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (rand() < 0.12) continue;
      const x = (c + 0.5) * (W / COLS) + between(-100, 100);
      const y = (r + 0.5) * (H / ROWS) + between(-80, 80);
      if (clear(x, y)) continue;
      nodes.push({
        x: Math.round(x),
        y: Math.round(y),
        rot: between(-9, 9).toFixed(1),
        s: between(0.8, 1.4).toFixed(2),
        company: rand() < 0.3,
      });
    }
  }
  const matchNodes = match.map((m) => ({ rot: "-4", s: "0.95", company: false, ...m }));
  nodes.push(...matchNodes);

  const place = (n) => `translate(${n.x},${n.y}) rotate(${n.rot}) scale(${n.s})`;
  const chips = nodes
    .map((n) => `  <use xlink:href="#${n.company ? "company" : "profile"}" transform="${place(n)}"/>`)
    .join("\n");

  const curve = (a, b, bend = 0.16) => {
    const mx = (a.x + b.x) / 2;
    const my = (a.y + b.y) / 2;
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return `M${a.x},${a.y} Q${Math.round(mx - dy * bend)},${Math.round(my + dx * bend)} ${b.x},${b.y}`;
  };

  const links = [];
  for (let i = 0; i < nodes.length; i++) {
    if (rand() > 0.55) continue;
    const a = nodes[i];
    const candidates = nodes
      .filter((b) => b !== a && b.x > a.x)
      .sort((p, q) => Math.hypot(p.x - a.x, p.y - a.y) - Math.hypot(q.x - a.x, q.y - a.y));
    if (!candidates.length) continue;
    links.push(`  <path d="${curve(a, candidates[0])}" />`);
  }

  const [t1, t2, t3] = matchNodes;
  const thread = `  <g stroke="#149d4a" fill="none" opacity="0.4">
    <path stroke-width="2.5" d="${curve(t1, t2, 0.2)}"/>
    <path stroke-width="2.5" d="${curve(t2, t3, -0.18)}"/>
  </g>
  <g fill="none" stroke="#149d4a" stroke-width="2.5" opacity="0.5">
    <circle cx="${t1.x}" cy="${t1.y}" r="30"/>
    <circle cx="${t2.x}" cy="${t2.y}" r="30"/>
    <circle cx="${t3.x}" cy="${t3.y}" r="34"/>
  </g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#edf4ed"/>
      <stop offset="0.4" stop-color="#eef5ee"/>
      <stop offset="1" stop-color="#eaf2ea"/>
    </linearGradient>
    <radialGradient id="bsun" cx="0.74" cy="0.1" r="0.5">
      <stop offset="0" stop-color="#f4f1d8" stop-opacity="0.7"/>
      <stop offset="1" stop-color="#f4f1d8" stop-opacity="0"/>
    </radialGradient>
    <g id="profile">
      <rect x="-78" y="-30" width="156" height="60" rx="16" fill="#fbfdfb" stroke="#c9dccd" stroke-width="1.5"/>
      <circle cx="-48" cy="0" r="15" fill="#dce9de"/>
      <rect x="-24" y="-12" width="76" height="8" rx="4" fill="#d7e5d9"/>
      <rect x="-24" y="4" width="48" height="8" rx="4" fill="#e3eee4"/>
    </g>
    <g id="company">
      <rect x="-34" y="-34" width="68" height="68" rx="17" fill="#fbfdfb" stroke="#c9dccd" stroke-width="1.5"/>
      <rect x="-17" y="-6" width="34" height="22" rx="5" fill="none" stroke="#c2d7c7" stroke-width="3"/>
      <path d="M-8,-6 v-5 a4,4 0 0 1 4,-4 h8 a4,4 0 0 1 4,4 v5" fill="none" stroke="#c2d7c7" stroke-width="3"/>
    </g>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bsky)"/>
  <rect width="${W}" height="${H}" fill="url(#bsun)"/>

  <g stroke="#cfe0d3" stroke-width="1.8" fill="none" opacity="0.9">
${links.join("\n")}
  </g>

${chips}

${thread}
</svg>
`;
}

const bento = makeScene({
  seed: 9082026,
  H: 1700,
  clear: (x, y) => y < 330 && x < 1150,
  match: [
    { x: 1235, y: 205 },
    { x: 1520, y: 130 },
    { x: 1790, y: 235, company: true },
  ],
});

/*
 * Comparison background: quiet diagonal light rays falling across the
 * section — directional luminance for the glass table to frost, nothing
 * figurative competing with the data.
 */
const rays = [
  { x: 60, w: 210, fill: "#d9ead9", o: 0.55 },
  { x: 400, w: 110, fill: "#f2eed2", o: 0.6 },
  { x: 640, w: 300, fill: "#dcebdb", o: 0.5 },
  { x: 1060, w: 150, fill: "#e6f0e0", o: 0.65 },
  { x: 1330, w: 90, fill: "#f2eed2", o: 0.5 },
  { x: 1560, w: 260, fill: "#d5e7d6", o: 0.5 },
]
  .map(
    (r) =>
      `    <rect x="${r.x}" y="-600" width="${r.w}" height="2800" fill="${r.fill}" opacity="${r.o}"/>`
  )
  .join("\n");

const comparison = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1500" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="rsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.45" stop-color="#f4f8f3"/>
      <stop offset="1" stop-color="#edf4ed"/>
    </linearGradient>
    <radialGradient id="rsun" cx="0.8" cy="0.05" r="0.55">
      <stop offset="0" stop-color="#f4f0d4" stop-opacity="0.75"/>
      <stop offset="1" stop-color="#f4f0d4" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="rfade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.6"/>
    </linearGradient>
    <filter id="rblur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="46"/></filter>
  </defs>
  <rect width="1920" height="1500" fill="url(#rsky)"/>
  <rect width="1920" height="1500" fill="url(#rsun)"/>
  <g transform="rotate(-27 960 750)" filter="url(#rblur)">
${rays}
  </g>
  <rect width="1920" height="1500" fill="url(#rfade)"/>
</svg>
`;

/*
 * Services background: a "toolkit field" — oversized ghosted outline glyphs
 * of the service instruments (resume, chat, briefcase, calendar, search,
 * mic, pen) drifting behind the cards. One green check = the delivered one.
 */
function makeToolkit() {
  let s = 12082026;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const between = (a, b) => a + rand() * (b - a);
  const W = 1920;
  const H = 1300;
  const glyphs = ["doc", "chat", "case", "cal", "search", "mic", "pen", "id", "grad"];

  // WhatsApp-doodle density: small icons on a tight jittered grid
  const items = [];
  const COLS = 13;
  const ROWS = 9;
  let gi = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (rand() < 0.1) continue;
      const x = (c + 0.5) * (W / COLS) + between(-34, 34) + (r % 2 ? W / COLS / 2 : 0);
      const y = (r + 0.5) * (H / ROWS) + between(-26, 26);
      const g = glyphs[gi++ % glyphs.length];
      const green = rand() < 0.05;
      items.push(
        `    <use xlink:href="#${g}" transform="translate(${Math.round(x)},${Math.round(y)}) rotate(${between(-20, 20).toFixed(1)}) scale(${between(0.34, 0.52).toFixed(2)})"${green ? ' color="#149d4a" opacity="0.32"' : ""}/>`
      );
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="tsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e9f1ec"/>
      <stop offset="0.5" stop-color="#f3f8f2"/>
      <stop offset="1" stop-color="#eef5ee"/>
    </linearGradient>
    <radialGradient id="tsun" cx="0.2" cy="0.08" r="0.5">
      <stop offset="0" stop-color="#f4f1d8" stop-opacity="0.6"/>
      <stop offset="1" stop-color="#f4f1d8" stop-opacity="0"/>
    </radialGradient>
    <g id="doc" stroke="currentColor" stroke-width="3" fill="none">
      <rect x="-34" y="-44" width="68" height="88" rx="10"/>
      <line x1="-18" y1="-18" x2="18" y2="-18"/>
      <line x1="-18" y1="0" x2="18" y2="0"/>
      <line x1="-18" y1="18" x2="6" y2="18"/>
    </g>
    <g id="chat" stroke="currentColor" stroke-width="3" fill="none">
      <path d="M-38,-30 h76 a10,10 0 0 1 10,10 v34 a10,10 0 0 1 -10,10 h-40 l-20,18 v-18 h-16 a10,10 0 0 1 -10,-10 v-34 a10,10 0 0 1 10,-10 z"/>
      <line x1="-20" y1="-8" x2="20" y2="-8"/>
      <line x1="-20" y1="8" x2="8" y2="8"/>
    </g>
    <g id="case" stroke="currentColor" stroke-width="3" fill="none">
      <rect x="-40" y="-22" width="80" height="52" rx="10"/>
      <path d="M-14,-22 v-8 a8,8 0 0 1 8,-8 h12 a8,8 0 0 1 8,8 v8"/>
    </g>
    <g id="cal" stroke="currentColor" stroke-width="3" fill="none">
      <rect x="-36" y="-34" width="72" height="70" rx="10"/>
      <line x1="-36" y1="-14" x2="36" y2="-14"/>
      <line x1="-16" y1="-46" x2="-16" y2="-30"/>
      <line x1="16" y1="-46" x2="16" y2="-30"/>
      <path d="M-12,8 l8,8 l16,-16"/>
    </g>
    <g id="search" stroke="currentColor" stroke-width="3" fill="none">
      <circle cx="-6" cy="-6" r="26"/>
      <line x1="14" y1="14" x2="34" y2="34"/>
    </g>
    <g id="mic" stroke="currentColor" stroke-width="3" fill="none">
      <rect x="-12" y="-40" width="24" height="46" rx="12"/>
      <path d="M-26,-6 a26,26 0 0 0 52,0"/>
      <line x1="0" y1="22" x2="0" y2="38"/>
    </g>
    <g id="pen" stroke="currentColor" stroke-width="3" fill="none">
      <path d="M-30,30 l44,-44 l14,14 l-44,44 l-18,4 z"/>
      <line x1="8" y1="-8" x2="20" y2="4"/>
    </g>
    <g id="id" stroke="currentColor" stroke-width="3" fill="none">
      <rect x="-42" y="-28" width="84" height="56" rx="10"/>
      <circle cx="-20" cy="-2" r="10"/>
      <line x1="2" y1="-10" x2="30" y2="-10"/>
      <line x1="2" y1="6" x2="22" y2="6"/>
    </g>
    <g id="grad" stroke="currentColor" stroke-width="3" fill="none">
      <path d="M-40,-8 l40,-18 l40,18 l-40,18 z"/>
      <path d="M-22,2 v18 a22,10 0 0 0 44,0 v-18"/>
      <line x1="40" y1="-8" x2="40" y2="16"/>
    </g>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#tsky)"/>
  <rect width="${W}" height="${H}" fill="url(#tsun)"/>
  <g color="#c6dacb" opacity="0.75">
${items.join("\n")}
  </g>
</svg>
`;
}

/*
 * Process background: a trail map — organic topographic contours around a
 * few peaks, crossed by one dashed trail with four checkpoints (the four
 * steps) ending at a small green flag.
 */
function makeTrailMap() {
  let s = 13082026;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const between = (a, b) => a + rand() * (b - a);
  const W = 1920;
  const H = 1600;

  const peaks = [
    { cx: 300, cy: 400 },
    { cx: 1590, cy: 340 },
    { cx: 1120, cy: 1260 },
    { cx: 210, cy: 1330 },
  ];

  const contours = [];
  for (const p of peaks) {
    const p1 = between(0, Math.PI * 2);
    const p2 = between(0, Math.PI * 2);
    const p3 = between(0, Math.PI * 2);
    const rings = 6;
    for (let i = 1; i <= rings; i++) {
      const R = 70 + i * between(78, 96);
      const pts = [];
      for (let k = 0; k <= 72; k++) {
        const t = (k / 72) * Math.PI * 2;
        const r =
          R *
          (1 +
            0.16 * Math.sin(3 * t + p1) +
            0.09 * Math.sin(5 * t + p2) +
            0.05 * Math.sin(8 * t + p3));
        pts.push(`${Math.round(p.cx + r * Math.cos(t))},${Math.round(p.cy + r * Math.sin(t))}`);
      }
      contours.push(`    <path d="M${pts.join(" L")} Z"/>`);
    }
  }

  const checkpoints = [
    [470, 250],
    [905, 520],
    [965, 1075],
    [1430, 1345],
  ]
    .map(([x, y]) => `  <circle cx="${x}" cy="${y}" r="5" fill="#149d4a" opacity="0.4"/>`)
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="psky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f6faf5"/>
      <stop offset="0.5" stop-color="#eef5ee"/>
      <stop offset="1" stop-color="#f3f8f2"/>
    </linearGradient>
    <radialGradient id="psun" cx="0.5" cy="0" r="0.6">
      <stop offset="0" stop-color="#f4f1d8" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#f4f1d8" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#psky)"/>
  <rect width="${W}" height="${H}" fill="url(#psun)"/>
  <g stroke="#cfe0d3" stroke-width="1.6" fill="none" opacity="0.75">
${contours.join("\n")}
  </g>
  <path d="M130,190 C470,120 770,300 905,520 C1050,740 850,900 965,1075 C1075,1245 1210,1300 1430,1345 C1540,1367 1620,1385 1685,1398"
    stroke="#149d4a" stroke-opacity="0.32" stroke-width="2.5" stroke-dasharray="2 11" stroke-linecap="round" fill="none"/>
${checkpoints}
  <g stroke="#149d4a" stroke-opacity="0.55" stroke-width="2.5" fill="none">
    <line x1="1700" y1="1398" x2="1700" y2="1358"/>
    <path d="M1700,1358 l30,10 l-30,10 z" fill="#149d4a" fill-opacity="0.4"/>
  </g>
</svg>
`;
}

/*
 * Testimonials background: soft oversized editorial quotation marks drifting
 * as watermarks — the unmistakable signal for a wall of voices. A few render
 * in brand green. Top-centre band kept clear for the heading + flagship quote.
 */
function makeQuotes() {
  let s = 14082026;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const between = (a, b) => a + rand() * (b - a);
  const W = 1920;
  const H = 1500;

  const marks = [];
  const COLS = 5;
  const ROWS = 4;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (rand() < 0.14) continue;
      const x = (c + 0.5) * (W / COLS) + between(-90, 90) + (r % 2 ? W / COLS / 2 : 0);
      const y = (r + 0.5) * (H / ROWS) + between(-70, 70);
      if (y < 520 && x > 470 && x < 1450) continue; // heading + flagship band
      const size = Math.round(between(90, 200));
      const rot = between(-10, 10).toFixed(1);
      const green = rand() < 0.1;
      const glyph = rand() < 0.75 ? "“" : "”";
      marks.push(
        `  <text x="${Math.round(x)}" y="${Math.round(y)}" font-size="${size}" transform="rotate(${rot} ${Math.round(x)} ${Math.round(y)})"${green ? ' fill="#149d4a" opacity="0.14"' : ""}>${glyph}</text>`
      );
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="qsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f3f7f4"/>
      <stop offset="0.5" stop-color="#eef5ee"/>
      <stop offset="1" stop-color="#f1f6f1"/>
    </linearGradient>
    <radialGradient id="qsun" cx="0.5" cy="0.16" r="0.55">
      <stop offset="0" stop-color="#f2efd6" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#f2efd6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#qsky)"/>
  <rect width="${W}" height="${H}" fill="url(#qsun)"/>
  <g fill="#d7e6da" font-family="Georgia, 'Times New Roman', serif" font-weight="700" text-anchor="middle" dominant-baseline="middle">
${marks.join("\n")}
  </g>
</svg>
`;
}

/*
 * FAQ background: soft oversized question marks drifting as watermarks — the
 * plain-language symbol of a questions section, parallel to the testimonials
 * quote marks. A few render in brand green. Left heading band kept clear.
 */
function makeQuestions() {
  let s = 15082026;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
  const between = (a, b) => a + rand() * (b - a);
  const W = 1920;
  const H = 1300;

  const marks = [];
  const COLS = 8;
  const ROWS = 6;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (rand() < 0.08) continue;
      const x = (c + 0.5) * (W / COLS) + between(-70, 70) + (r % 2 ? W / COLS / 2 : 0);
      const y = (r + 0.5) * (H / ROWS) + between(-55, 55);
      const size = Math.round(between(64, 150));
      const rot = between(-14, 14).toFixed(1);
      const green = rand() < 0.1;
      marks.push(
        `  <text x="${Math.round(x)}" y="${Math.round(y)}" font-size="${size}" transform="rotate(${rot} ${Math.round(x)} ${Math.round(y)})"${green ? ' fill="#149d4a" opacity="0.16"' : ""}>?</text>`
      );
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="fqsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#f3f7f4"/>
      <stop offset="0.5" stop-color="#eef5ee"/>
      <stop offset="1" stop-color="#f1f6f1"/>
    </linearGradient>
    <radialGradient id="fqsun" cx="0.85" cy="0.12" r="0.55">
      <stop offset="0" stop-color="#f2efd6" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#f2efd6" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#fqsky)"/>
  <rect width="${W}" height="${H}" fill="url(#fqsun)"/>
  <g fill="#bcd2c1" font-family="Georgia, 'Times New Roman', serif" font-weight="700" text-anchor="middle" dominant-baseline="middle">
${marks.join("\n")}
  </g>
</svg>
`;
}

writeFileSync(new URL("../public/bento-bg.svg", import.meta.url), bento);
writeFileSync(new URL("../public/comparison-bg.svg", import.meta.url), comparison);
writeFileSync(new URL("../public/services-bg.svg", import.meta.url), makeToolkit());
writeFileSync(new URL("../public/process-bg.svg", import.meta.url), makeTrailMap());
writeFileSync(new URL("../public/testimonials-bg.svg", import.meta.url), makeQuotes());
writeFileSync(new URL("../public/faq-bg.svg", import.meta.url), makeQuestions());
console.log("bento + comparison + services + process + testimonials + faq backgrounds written");
