/**
 * E2E Test Helpers - Common functions to reduce test duplication and improve performance
 */

import { expect } from '@playwright/test';

/**
 * Fill calculator with values and wait for calculation
 * Uses Playwright's expect with proper timeout handling
 */
export async function fillAndCalculate(page, { principal = '500000', interestRate = '5.25', amortizationYears = '25' } = {}) {
    // Fill in the form fields - use type instead of fill to trigger proper input events
    // This ensures the change detection works correctly
    await page.locator('#principal').fill('');
    await page.locator('#principal').type(principal, { delay: 50 });

    await page.locator('#interestRate').fill('');
    await page.locator('#interestRate').type(interestRate, { delay: 50 });

    await page.locator('#amortizationYears').fill('');
    await page.locator('#amortizationYears').type(amortizationYears, { delay: 50 });

    // Wait a moment for all input events to process
    await page.waitForTimeout(200);

    // Wait for results container to be visible
    const resultsLocator = page.locator('#base-mortgage-results');
    await resultsLocator.waitFor({ state: 'visible', timeout: 2000 });

    // Wait for debounce delay (500ms) + calculation time
    // The calculation should start after debounce completes
    await page.waitForTimeout(800);

    // Wait for actual results to appear (must contain $)
    // This will wait up to 25 seconds for the calculation to complete
    await expect(resultsLocator).toContainText('$', { timeout: 25000 });

    // Final verification that we have actual results
    const text = await resultsLocator.textContent();
    if (!text || !text.includes('$')) {
        throw new Error(`Expected results with $ but got: ${text?.substring(0, 100)}`);
    }
    if (text && text.includes('Calculating...')) {
        throw new Error(`Calculation still in progress. Current text: ${text.substring(0, 100)}`);
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