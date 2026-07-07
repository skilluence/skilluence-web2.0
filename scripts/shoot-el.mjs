import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const edge = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => existsSync(p));

const [, , out, selector, url] = process.argv;

const browser = await puppeteer.launch({
  executablePath: edge,
  headless: "shell",
  args: ["--disable-gpu", "--hide-scrollbars"],
  defaultViewport: { width: 1600, height: 1000 },
});
const page = await browser.newPage();
await page.goto(url ?? "http://localhost:3001", { waitUntil: "networkidle0", timeout: 60000 });
await page.evaluate((sel) => {
  document.querySelector(sel)?.scrollIntoView({ block: "center" });
}, selector);
await new Promise((r) => setTimeout(r, 1300));
await page.screenshot({ path: out });
await browser.close();
console.log("saved", out);
