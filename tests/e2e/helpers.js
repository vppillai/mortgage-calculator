/**
 * E2E Test Helpers - Common functions to reduce test duplication and improve performance
 */

/**
 * Fill calculator with values and wait for calculation
 */
export async function fillAndCalculate(page, { principal = '500000', interestRate = '5.25', amortizationYears = '25' } = {}) {
    await page.fill('#principal', principal);
    await page.fill('#interestRate', interestRate);
    await page.fill('#amortizationYears', amortizationYears);

    // Wait for calculation result instead of arbitrary timeout
    // Account for debounce delay (500ms) + calculation time
    await page.locator('#base-mortgage-results').waitFor({ state: 'visible' });
    await page.waitForFunction(() => {
        const results = document.querySelector('#base-mortgage-results');
        // Check for results (either loading spinner or actual results with $)
        if (!results) return false;
        const text = results.textContent || '';
        // Results should contain $ (currency) or be in loading state
        return text.includes('$') || text.includes('Calculating');
    }, { timeout: 10000 }); // Increased timeout to account for debounce + calculation
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