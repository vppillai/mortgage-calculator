/**
 * E2E Test Helpers - Common functions to reduce test duplication and improve performance
 */

/**
 * Fill calculator with values and wait for calculation
 * Accounts for debounce delay (500ms) + calculation time
 */
export async function fillAndCalculate(page, { principal = '500000', interestRate = '5.25', amortizationYears = '25' } = {}) {
    await page.fill('#principal', principal);
    await page.fill('#interestRate', interestRate);
    await page.fill('#amortizationYears', amortizationYears);

    // Wait for calculation result - account for debounce (500ms) + calculation time
    await page.locator('#base-mortgage-results').waitFor({ state: 'visible' });
    
    // Small delay to ensure debounce has triggered
    await page.waitForTimeout(600); // Wait for debounce (500ms) + buffer
    
    // Wait for the loading state to disappear and results to appear
    await page.waitForFunction(() => {
        const results = document.querySelector('#base-mortgage-results');
        if (!results) return false;
        const text = results.textContent || '';
        // Check that we have actual results (contains $) and not just "Calculating..."
        return text.includes('$') && !text.includes('Calculating...');
    }, { timeout: 15000 }); // Increased timeout to 15s to account for debounce + calculation
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