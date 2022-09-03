"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const test_1 = require("@playwright/test");
(0, test_1.test)("modal renders", async ({ page }) => {
    await page.goto("http://localhost:8080");
    const area = await page.waitForSelector(".area");
    await area.click({ position: { x: 100, y: 100 } });
    const modal = await page.waitForSelector("restricted-modal");
    (0, test_1.expect)(modal).not.toBeNull();
});
(0, test_1.test)("modal top recalc", async ({ page }) => {
    await page.goto("http://localhost:8080");
    const area = await page.waitForSelector(".area");
    const areaRect = await area.evaluate((el) => el.getBoundingClientRect());
    await area.click({ position: { x: 100, y: areaRect.bottom - 100 } });
    await page.waitForTimeout(1000);
    const modalRect = await page.$eval("restricted-modal", (el) => el.getBoundingClientRect());
    (0, test_1.expect)(modalRect.top).toBe(areaRect.bottom - modalRect.height);
});
