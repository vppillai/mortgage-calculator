/**
 * E2E Test Helpers - Common functions to reduce test duplication and improve performance
 */

/**
 * E2E Test Helpers - Common functions to reduce test duplication and improve performance
 */

import { expect } from '@playwright/test';

/**
 * Fill calculator with values and wait for calculation
 * Uses Playwright's expect with proper timeout handling
 */
export async function fillAndCalculate(page, { principal = '500000', interestRate = '5.25', amortizationYears = '25' } = {}) {
    // Fill in the form fields
    await page.fill('#principal', principal);
    await page.fill('#interestRate', interestRate);
    await page.fill('#amortizationYears', amortizationYears);

    // Wait for results container to be visible
    const resultsLocator = page.locator('#base-mortgage-results');
    await resultsLocator.waitFor({ state: 'visible', timeout: 2000 });

    // Wait for debounce delay to complete (500ms) + small buffer
    await page.waitForTimeout(700);

    // Wait for loading state to disappear - check that "Calculating..." is not present
    // This uses Playwright's expect which respects the expect.timeout setting
    await expect(resultsLocator).not.toContainText('Calculating...', { timeout: 15000 });

    // Wait for actual results to appear (must contain $)
    await expect(resultsLocator).toContainText('$', { timeout: 15000 });
}

/**
 * Setup calculator page with common prerequisites
 */
export async function setupCalculator(page) {
    await page.goto('/');
    await page.locator('h1').waitFor({ state: 'visible' });
}

/**
 * Add scenario to comparison and verify
 */
export async function addScenarioToComparison(page) {
    await page.click('#add-to-comparison');
    await page.locator('#inline-comparison-table').waitFor({ state: 'visible' });
}

/**
 * Verify theme toggle works
 */
export async function verifyThemeToggle(page, expectedClass = 'dark') {
    const htmlElement = page.locator('html');
    await page.click('#theme-toggle');
    await page.waitForFunction(
        (className) => document.documentElement.classList.contains(className),
        expectedClass,
        { timeout: 3000 }
    );
}