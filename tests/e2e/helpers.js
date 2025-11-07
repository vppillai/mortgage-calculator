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

    // Wait for debounce delay to complete (500ms) + calculation time
    // Instead of checking for "not Calculating", just wait for results to appear
    // This is more reliable - if results appear, Calculating is gone
    await expect(resultsLocator).toContainText('$', { timeout: 20000 });
    
    // Additional check: ensure we have actual results, not just loading state
    // Wait a bit more to ensure calculation is complete
    await page.waitForTimeout(500);
    
    // Final verification that we have results
    const text = await resultsLocator.textContent();
    if (text && text.includes('Calculating...')) {
        throw new Error('Calculation still in progress after timeout');
    }
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