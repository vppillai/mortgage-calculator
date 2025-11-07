import { test, expect } from '@playwright/test';
import { setupCalculator, fillAndCalculate, addScenarioToComparison } from './helpers.js';

test.describe('Scenario Comparison', () => {
    test.beforeEach(async ({ page }) => {
        await setupCalculator(page);
    });

    test('should add and manage comparison scenarios', async ({ page }) => {
        // Add first scenario
        await fillAndCalculate(page);
        await addScenarioToComparison(page);
        await expect(page.locator('tbody tr')).toHaveCount(1);

        // Add second scenario with different values
        await fillAndCalculate(page, { principal: '600000', interestRate: '4.75' });
        await addScenarioToComparison(page);
        await expect(page.locator('tbody tr')).toHaveCount(2);

        // Verify comparison data shows differences
        const rows = page.locator('tbody tr');
        await expect(rows.first()).toContainText('500000');
        await expect(rows.last()).toContainText('600000');
    });
});

