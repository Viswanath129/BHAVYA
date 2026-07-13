import { test, expect } from '@playwright/test';

test('verify dashboard', async ({ page }) => {
  await page.goto('http://localhost:3000/#/');
  // Dashboard is the default route.
  // Sidebar should be there
  await expect(page.locator('aside')).toBeVisible();
  await expect(page.locator('text=Behavioral Patterns')).toBeVisible();
});

test('verify journal', async ({ page }) => {
  await page.goto('http://localhost:3000/#/journal');
  await expect(page.locator('text=How are you feeling right now?')).toBeVisible();
});

test('verify affective', async ({ page }) => {
    await page.goto('http://localhost:3000/#/affective');
    // Look for text in AffectiveAnalysis page
    await expect(page.locator('body')).toContainText(/Affective/i);
});
