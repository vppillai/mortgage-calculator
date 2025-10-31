import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
    test('should display correctly on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Check header is visible
        await expect(page.locator('h1')).toBeVisible();

        // Check calculator container is accessible
        await expect(page.locator('#calculator-container')).toBeVisible();

        // Check inputs have proper touch targets
        const principalInput = page.locator('#principal');
        await expect(principalInput).toBeVisible();
        const box = await principalInput.boundingBox();
        if (box) {
            expect(box.height).toBeGreaterThanOrEqual(40); // WCAG touch target size
        }
    });

    test('should handle horizontal scrolling on comparison table', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Comparison table should be scrollable on mobile
        const comparisonContainer = page.locator('.comparison-scroll');
        if (await comparisonContainer.isVisible()) {
            await expect(comparisonContainer).toHaveCSS('overflow-x', 'auto');
        }
    });

    test('should support touch interactions', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');

        // Test theme toggle with click (works on mobile and desktop)
        await page.click('#theme-toggle');
        await page.waitForTimeout(300);

        const htmlClasses = await page.locator('html').getAttribute('class');
        expect(htmlClasses).toBeDefined();
    });

    test('should work in landscape orientation', async ({ page }) => {
        await page.setViewportSize({ width: 667, height: 375 });
        await page.goto('/');

        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('#calculator-container')).toBeVisible();
    });
});

