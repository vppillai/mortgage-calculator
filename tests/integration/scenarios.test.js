import { describe, it, expect, beforeEach } from 'vitest';
import { calculateMortgage } from '../../src/services/mortgageCalculator.js';
import { validateMortgageInputs } from '../../src/services/validation.js';
import { formatCAD } from '../../src/services/currencyFormatter.js';

describe('Integration: Complete Calculation Flow', () => {
    let validInputs;

    beforeEach(() => {
        validInputs = {
            principal: 500000,
            interestRate: 5.25,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        };
    });

    it('should validate and calculate mortgage successfully', () => {
        const validation = validateMortgageInputs(validInputs);
        expect(validation.isValid).toBe(true);

        const result = calculateMortgage(validInputs);
        expect(result.regularPayment).toBeGreaterThan(0);
        expect(result.totalInterest).toBeGreaterThan(0);
    });

    it('should format calculation results in CAD', () => {
        const result = calculateMortgage(validInputs);
        const formatted = formatCAD(result.regularPayment);

        expect(formatted).toContain('$');
        expect(formatted).toContain(',');
    });

    it('should handle invalid inputs gracefully', () => {
        const invalidInputs = { ...validInputs, principal: -100000 };
        const validation = validateMortgageInputs(invalidInputs);

        expect(validation.isValid).toBe(false);
        expect(validation.errors.length).toBeGreaterThan(0);
    });

    it('should calculate different payment frequencies correctly', () => {
        const monthly = calculateMortgage({ ...validInputs, paymentFrequency: 'monthly' });
        const biweekly = calculateMortgage({ ...validInputs, paymentFrequency: 'bi-weekly' });
        const weekly = calculateMortgage({ ...validInputs, paymentFrequency: 'weekly' });

        expect(biweekly.regularPayment).toBeLessThan(monthly.regularPayment);
        expect(weekly.regularPayment).toBeLessThan(biweekly.regularPayment);

        // All should have similar total costs (within a small range due to payment frequency differences)
        expect(Math.abs(monthly.totalCost - biweekly.totalCost)).toBeLessThan(1500);
    });

    it('should match known benchmark values', () => {
        // Test against known Canadian mortgage calculator results
        const benchmark = {
            principal: 300000,
            interestRate: 4.5,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        };

        const result = calculateMortgage(benchmark);

        // Expected monthly payment approximately $1,660.42 (with Canadian semi-annual compounding)
        expect(result.regularPayment).toBeCloseTo(1660.42, 1);
    });
});

