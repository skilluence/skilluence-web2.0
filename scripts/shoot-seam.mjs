import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const edge = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => existsSync(p));

const [, , out, selector] = process.argv;

const browser = await puppeteer.launch({
  executablePath: edge,
  headless: "shell",
  args: ["--disable-gpu", "--hide-scrollbars"],
  defaultViewport: { width: 1600, height: 700 },
});
const page = await browser.newPage();
await page.goto("http://localhost:3001", { waitUntil: "networkidle0", timeout: 60000 });
// scroll so the top edge of the target sits in the middle of the viewport
await page.evaluate((sel) => {
  const el = document.querySelector(sel);
  const top = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo(0, top - 350);
}, selector);
await new Promise((r) => setTimeout(r, 900));
await page.screenshot({ path: out });
await browser.close();
console.log("saved", out);
