import puppeteer from "puppeteer-core";
import { existsSync } from "node:fs";

const edge = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
].find((p) => existsSync(p));

const browser = await puppeteer.launch({
  executablePath: edge,
  headless: "shell",
  args: ["--disable-gpu", "--hide-scrollbars"],
  defaultViewport: { width: 1600, height: 900 },
});
const page = await browser.newPage();
await page.goto(process.argv[4] ?? "http://localhost:3001", { waitUntil: "networkidle0", timeout: 60000 });
await page.screenshot({ path: process.argv[2] });
await page.evaluate(() => window.scrollTo(0, 1400));
await new Promise((r) => setTimeout(r, 900));
await page.screenshot({ path: process.argv[3] });
await browser.close();
console.log("done");
