import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const edgePaths = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
];
const executablePath = edgePaths.find((p) => existsSync(p));

const url = process.argv[2] ?? "http://localhost:3001";
const out = process.argv[3] ?? "page.png";
const width = Number(process.argv[4] ?? 1600);

const browser = await puppeteer.launch({
  executablePath,
  headless: "shell",
  args: ["--disable-gpu", "--hide-scrollbars"],
  defaultViewport: { width, height: 1000 },
});

const page = await browser.newPage();
await page.goto(url, { waitUntil: "networkidle0", timeout: 60000 });

// scroll through the page so whileInView animations fire, then return to top
await page.evaluate(async () => {
  const step = 700;
  for (let y = 0; y <= document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 120));
  }
  window.scrollTo(0, 0);
});
await new Promise((r) => setTimeout(r, 1200));

await page.screenshot({ path: out, fullPage: true });
await browser.close();
console.log("saved", out);
