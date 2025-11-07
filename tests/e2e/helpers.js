/**
 * E2E Test Helpers - Common functions to reduce test duplication and improve performance
 */

import { expect } from '@playwright/test';

/**
 * Fill calculator with values and wait for calculation
 * Uses Playwright's expect with proper timeout handling
 */
export async function fillAndCalculate(page, { principal = '500000', interestRate = '5.25', amortizationYears = '25' } = {}) {
    // Clear fields first to ensure change detection works
    await page.fill('#principal', '');
    await page.fill('#interestRate', '');
    await page.fill('#amortizationYears', '');
    await page.waitForTimeout(100);
    
    // Fill in the form fields
    await page.fill('#principal', principal);
    await page.fill('#interestRate', interestRate);
    await page.fill('#amortizationYears', amortizationYears);

    // Trigger input events to ensure calculation is triggered
    await page.locator('#principal').dispatchEvent('input');
    await page.locator('#interestRate').dispatchEvent('input');
    await page.locator('#amortizationYears').dispatchEvent('input');
    
    // Wait for results container to be visible
    const resultsLocator = page.locator('#base-mortgage-results');
    await resultsLocator.waitFor({ state: 'visible', timeout: 2000 });

    // Wait for debounce delay to complete (500ms) + calculation time
    // Wait longer to ensure calculation completes
    await page.waitForTimeout(1000);

    // Wait for actual results to appear (must contain $)
    // Use a more flexible approach - wait for either results or check if still calculating
    try {
        await expect(resultsLocator).toContainText('$', { timeout: 25000 });
    } catch (e) {
        // If timeout, check what state we're in
        const text = await resultsLocator.textContent();
        if (text && text.includes('Calculating...')) {
            throw new Error(`Calculation timed out - still showing "Calculating..." after 25s. Current text: ${text.substring(0, 100)}`);
        }
        if (text && text.includes('Enter your mortgage details')) {
            throw new Error(`Calculation didn't trigger - showing empty state. Current text: ${text.substring(0, 100)}`);
        }
        throw e;
    }
    
    // Final verification that we have results
    const text = await resultsLocator.textContent();
    if (!text || !text.includes('$')) {
        throw new Error(`Expected results with $ but got: ${text?.substring(0, 100)}`);
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