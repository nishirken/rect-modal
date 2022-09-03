import { test, expect } from "@playwright/test";

test("modal renders", async ({ page }) => {
  await page.goto("http://localhost:8080");
  const area = await page.waitForSelector(".area");
  await area.click({ position: { x: 100, y: 100 } });
  const modal = await page.waitForSelector("restricted-modal");
  expect(modal).not.toBeNull();
});

test("modal top recalc", async ({ page }) => {
  await page.goto("http://localhost:8080");
  const area = await page.waitForSelector(".area");
  const areaRect = await area.evaluate<DOMRect>((el) =>
    el.getBoundingClientRect()
  );
  await area.click({ position: { x: 100, y: areaRect.bottom - 100 } });
  await page.waitForTimeout(1000);
  const modalRect = await page.$eval<DOMRect>("restricted-modal", (el) =>
    el.getBoundingClientRect()
  );
  expect(modalRect.top).toBe(areaRect.bottom - modalRect.height);
});
