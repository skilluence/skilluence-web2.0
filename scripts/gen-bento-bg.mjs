import { writeFileSync } from "node:fs";

let seed = 9082026;
function rand() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
const between = (a, b) => a + rand() * (b - a);

const W = 1920;
const H = 1700;

/*
 * A hiring constellation: ghosted candidate profile chips and company nodes
 * scattered across the section, joined by faint connector threads.
 * One green thread runs through the field — the "right match".
 */

// jittered grid so chips spread evenly but never look arranged
const nodes = [];
const COLS = 6;
const ROWS = 6;
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    if (rand() < 0.12) continue; // gaps
    const x = (c + 0.5) * (W / COLS) + between(-100, 100);
    const y = (r + 0.5) * (H / ROWS) + between(-80, 80);
    if (y < 330 && x < 1150) continue; // keep the heading zone clear
    nodes.push({
      x: Math.round(x),
      y: Math.round(y),
      rot: between(-9, 9).toFixed(1),
      s: between(0.8, 1.4).toFixed(2),
      company: rand() < 0.3,
    });
  }
}

// the match-thread lives in the open band beside the heading
const matchNodes = [
  { x: 1235, y: 205, rot: "-5", s: "0.95", company: false },
  { x: 1520, y: 130, rot: "4", s: "0.85", company: false },
  { x: 1790, y: 235, rot: "-3", s: "1.0", company: true },
];
nodes.push(...matchNodes);

const place = (n) =>
  `translate(${n.x},${n.y}) rotate(${n.rot}) scale(${n.s})`;

const chips = nodes
  .map((n) => `  <use xlink:href="#${n.company ? "company" : "profile"}" transform="${place(n)}"/>`)
  .join("\n");

// faint connector threads between a handful of neighbouring nodes
function curve(a, b, bend = 0.16) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return `M${a.x},${a.y} Q${Math.round(mx - dy * bend)},${Math.round(my + dx * bend)} ${b.x},${b.y}`;
}

const links = [];
for (let i = 0; i < nodes.length; i++) {
  if (rand() > 0.55) continue;
  const a = nodes[i];
  // link to the nearest node that sits to the right
  const candidates = nodes
    .filter((b) => b !== a && b.x > a.x)
    .sort((p, q) => Math.hypot(p.x - a.x, p.y - a.y) - Math.hypot(q.x - a.x, q.y - a.y));
  if (!candidates.length) continue;
  links.push(`  <path d="${curve(a, candidates[0])}" />`);
}

// the one green match-thread: person → person → company, in the open band
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

const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="bsky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ffffff"/>
      <stop offset="0.4" stop-color="#f3f8f2"/>
      <stop offset="1" stop-color="#ecf3ec"/>
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

writeFileSync(new URL("../public/bento-bg.svg", import.meta.url), svg);
console.log(`bento-bg.svg written — ${nodes.length} nodes, ${links.length} links`);
