import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const edge = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => existsSync(p));

const browser = await puppeteer.launch({
  executablePath: edge,
  headless: "shell",
  args: ["--disable-gpu"],
  defaultViewport: { width: 1600, height: 900 },
});
const page = await browser.newPage();
await page.goto("http://localhost:3001", { waitUntil: "networkidle0", timeout: 60000 });

const grab = () =>
  page.evaluate(() =>
    [...document.querySelectorAll('[class*="hero-layer"]')].map(
      (el) => getComputedStyle(el).transform
    )
  );

const atTop = await grab();
await page.evaluate(() => window.scrollTo(0, 450));
await new Promise((r) => setTimeout(r, 600));
const scrolled = await grab();

console.log("layers:", atTop.length);
console.log("at top:  ", atTop);
console.log("scrolled:", scrolled);
console.log(
  "scroll parallax:",
  atTop.length === 3 && atTop.some((t, i) => t !== scrolled[i]) ? "YES" : "NO"
);
await browser.close();
