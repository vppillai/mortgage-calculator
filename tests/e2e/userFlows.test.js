import { test, expect } from '@playwright/test';
import { setupCalculator, fillAndCalculate, verifyThemeToggle } from './helpers.js';

test.describe('Mortgage Calculator Core Features', () => {
    test.beforeEach(async ({ page }) => {
        await setupCalculator(page);
    });

    test('should display calculator and calculate mortgage payment', async ({ page }) => {
        // Verify calculator loaded
        await expect(page.locator('h1')).toContainText('Mortgage Prepayment Calculator');
        await expect(page.locator('#theme-toggle')).toBeVisible();

        // Test calculation
        await fillAndCalculate(page);
        await expect(page.locator('#base-mortgage-results')).toContainText('$');
    });

    test('should toggle dark mode and persist preference', async ({ page }) => {
        // Toggle theme and verify
        await verifyThemeToggle(page);
        await expect(page.locator('html')).toHaveClass(/dark/);

        // Verify persistence after reload
        await page.reload();
        await setupCalculator(page); // Wait for reload
        await expect(page.locator('html')).toHaveClass(/dark/);
    });

    test('should work on mobile viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // Verify mobile layout and calculation
        await expect(page.locator('#principal')).toBeVisible();
        await fillAndCalculate(page, { principal: '400000' });
        await expect(page.locator('#base-mortgage-results')).toContainText('$');
    });
});

