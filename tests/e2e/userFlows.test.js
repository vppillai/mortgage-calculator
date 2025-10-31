import { test, expect } from '@playwright/test';

test.describe('Basic Mortgage Calculation User Journey', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should display the calculator page', async ({ page }) => {
        await expect(page.locator('h1')).toContainText('Mortgage Prepayment Calculator');
        await expect(page.locator('#theme-toggle')).toBeVisible();
    });

    test('should toggle dark mode', async ({ page }) => {
        const htmlElement = page.locator('html');

        // Check initial state
        const initialClasses = await htmlElement.getAttribute('class');

        // Toggle theme
        await page.click('#theme-toggle');

        // Wait for transition
        await page.waitForTimeout(300);

        // Check theme changed
        const newClasses = await htmlElement.getAttribute('class');
        expect(initialClasses).not.toBe(newClasses);
    });

    test('should calculate mortgage payment', async ({ page }) => {
        // Wait for calculator to load
        await expect(page.locator('#calculator-container')).toBeVisible();
        
        // Fill in calculator inputs
        await page.fill('#principal', '500000');
        await page.fill('#interestRate', '5.25');
        await page.fill('#amortizationYears', '25');
        
        // Wait for calculation (debounced)
        await page.waitForTimeout(500);
        
        // Check results are displayed
        await expect(page.locator('#base-mortgage-results')).toBeVisible();
    });

    test('should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });

        // Check mobile layout
        await expect(page.locator('h1')).toBeVisible();
        await expect(page.locator('#theme-toggle')).toBeVisible();
    });

    test('should persist theme preference', async ({ page, context }) => {
        // Toggle to dark mode
        await page.click('#theme-toggle');
        await page.waitForTimeout(300);

        // Reload page
        await page.reload();

        // Check theme persisted
        const htmlClasses = await page.locator('html').getAttribute('class');
        expect(htmlClasses).toContain('dark');
    });
});

