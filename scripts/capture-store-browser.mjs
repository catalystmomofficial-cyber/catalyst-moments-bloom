import puppeteer from "puppeteer";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.STORE_PREVIEW_URL ?? "http://127.0.0.1:4173";
const outputDir = "out/raw/iphone-6.9/en-US";
const scenes = [
  ["dashboard", "/dashboard"],
  ["workouts", "/workouts"],
  ["meals", "/meal-plan?stage=ttc"],
  ["wellness", "/wellness"],
  ["community", "/community"],
];

await mkdir(outputDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  executablePath: "/Users/cambautista/.cache/puppeteer/chrome-headless-shell/mac_arm-131.0.6778.204/chrome-headless-shell-mac-arm64/chrome-headless-shell",
  args: [
    "--no-first-run",
    "--disable-background-networking",
    "--disable-gpu",
    "--no-sandbox",
    "--user-data-dir=/tmp/catalyst-store-chrome",
  ],
  timeout: 120_000,
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 440, height: 956, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.evaluate(() => {
    localStorage.setItem("catalyst-cookie-consent", JSON.stringify({
      version: 1,
      analytics: false,
      marketing: false,
      updatedAt: new Date().toISOString(),
    }));
  });

  for (const [id, route] of scenes) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle2", timeout: 120_000 });
    await page.evaluate(async (sceneId) => {
      const safeAreaStyle = document.createElement("style");
      safeAreaStyle.dataset.storeCaptureSafeArea = "true";
      safeAreaStyle.textContent = `
        #root {
          box-sizing: border-box;
          padding-top: 84px;
        }
        nav.fixed.top-0 {
          top: 84px !important;
        }
      `;
      document.head.appendChild(safeAreaStyle);
      if (sceneId === "meals") {
        const pageTitle = [...document.querySelectorAll("h1")].find((element) =>
          element.textContent?.trim() === "Ttc Meal Plans"
        );
        if (pageTitle) pageTitle.textContent = "TTC Meal Plans";

        const journeyDescription = [...document.querySelectorAll("p")].find((element) =>
          element.textContent?.trim() === "Nutrition plans tailored for your ttc journey."
        );
        if (journeyDescription) journeyDescription.textContent = "Nutrition plans tailored for your TTC journey.";

        const title = [...document.querySelectorAll("h3")].find((element) =>
          element.textContent?.includes("Complete 30-Day Preconception Meal Plan")
        );
        if (title) {
          title.textContent = "30-Day TTC Fertility Nutrition Plan";
        }

        const image = document.querySelector('img[alt="Complete 30-Day Preconception Meal Plan"]');
        if (image) {
          image.src = "/assets/scene-3-nutrition-CQEdlxI1.jpg";
          image.alt = "Fertility-focused foods in the TTC nutrition plan";
          await image.decode().catch(() => undefined);
        }

        const description = [...document.querySelectorAll("p")].find((element) =>
          element.textContent?.includes("Comprehensive month-long preconception meal plan")
        );
        if (description) {
          description.textContent = "30 fertility-focused recipes featuring folate-rich foods, iron, omega-3s, choline, and practical 15–30 minute prep";
        }

        const duration = [...document.querySelectorAll("div, span")].find((element) =>
          element.childElementCount === 0 && element.textContent?.trim() === "30 Day Complete Plan"
        );
        if (duration) duration.textContent = "30 Days · TTC";

        for (const element of document.querySelectorAll("span, div, h2")) {
          if (element.childElementCount > 0) continue;
          if (element.textContent?.trim().toLowerCase() === "ttc") element.textContent = "TTC";
          if (element.textContent?.trim() === "More ttc plans") element.textContent = "More TTC plans";
        }
      }
      if (document.fonts?.ready) await document.fonts.ready;
      window.scrollTo(0, 0);
    }, id);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    await page.screenshot({ path: `${outputDir}/${id}.png`, fullPage: false });
    console.log(`Captured ${id}`);
  }
} finally {
  await browser.close();
}
