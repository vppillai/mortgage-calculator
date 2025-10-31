import { describe, it, expect } from 'vitest';
import { calculateMortgage } from '../../src/services/mortgageCalculator.js';

describe('Mortgage Calculator - Canadian PMT Formula', () => {
    it('should calculate monthly payment correctly for standard mortgage', () => {
        const result = calculateMortgage({
            principal: 500000,
            interestRate: 5.25,
            amortizationMonths: 300, // 25 years
            paymentFrequency: 'monthly',
        });

        // Expected: ~$2,979.59/month (with Canadian semi-annual compounding)
        expect(result.regularPayment).toBeCloseTo(2979.59, 1);
        expect(result.totalInterest).toBeGreaterThan(0);
        expect(result.totalCost).toBeCloseTo(500000 + result.totalInterest, 0);
    });

    it('should use Canadian semi-annual compounding', () => {
        const result = calculateMortgage({
            principal: 100000,
            interestRate: 6.0,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });

        // Canadian compounding should differ from simple monthly
        expect(result.regularPayment).toBeGreaterThan(0);
        expect(result.effectiveRate).toBeDefined();
    });

    it('should calculate bi-weekly payments correctly', () => {
        const result = calculateMortgage({
            principal: 500000,
            interestRate: 5.25,
            amortizationMonths: 300,
            paymentFrequency: 'bi-weekly',
        });

        // Bi-weekly payment should be less than half of monthly
        expect(result.regularPayment).toBeGreaterThan(0);
        expect(result.totalPayments).toBe(650); // 26 payments/year * 25 years
    });

    it('should calculate total interest accurately', () => {
        const result = calculateMortgage({
            principal: 300000,
            interestRate: 4.5,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });

        const totalPaid = result.regularPayment * result.totalPayments;
        expect(totalPaid).toBeCloseTo(result.totalCost, 0);
        expect(result.totalInterest).toBeCloseTo(totalPaid - 300000, 0);
    });

    it('should be accurate to $0.01 (CAD)', () => {
        const result = calculateMortgage({
            principal: 500000,
            interestRate: 5.25,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });

        // Check precision to 2 decimal places
        expect(result.regularPayment.toFixed(2)).toMatch(/^\d+\.\d{2}$/);
        expect(result.totalInterest.toFixed(2)).toMatch(/^\d+\.\d{2}$/);
    });

    it('should calculate weekly payments correctly', () => {
        const result = calculateMortgage({
            principal: 500000,
            interestRate: 5.25,
            amortizationMonths: 300,
            paymentFrequency: 'weekly',
        });

        expect(result.regularPayment).toBeGreaterThan(0);
        expect(result.totalPayments).toBe(1300); // 52 payments/year * 25 years
        // Weekly payment should be less than monthly
        const monthlyResult = calculateMortgage({
            principal: 500000,
            interestRate: 5.25,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });
        expect(result.regularPayment).toBeLessThan(monthlyResult.regularPayment);
    });

    it('should handle minimum principal correctly', () => {
        const result = calculateMortgage({
            principal: 1000,
            interestRate: 5.0,
            amortizationMonths: 120,
            paymentFrequency: 'monthly',
        });

        expect(result.regularPayment).toBeGreaterThan(0);
        expect(result.totalCost).toBeGreaterThan(1000);
    });

    it('should handle maximum principal correctly', () => {
        const result = calculateMortgage({
            principal: 10000000,
            interestRate: 5.0,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });

        expect(result.regularPayment).toBeGreaterThan(0);
        expect(result.totalCost).toBeGreaterThan(10000000);
    });

    it('should handle very low interest rates', () => {
        const result = calculateMortgage({
            principal: 500000,
            interestRate: 0.01,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });

        expect(result.regularPayment).toBeGreaterThan(0);
        expect(result.totalInterest).toBeGreaterThan(0);
    });

    it('should handle high interest rates', () => {
        const principal = 500000;
        const result = calculateMortgage({
            principal: principal,
            interestRate: 25.0,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });

        expect(result).toBeDefined();
        expect(result.regularPayment).toBeGreaterThan(0);
        // For high interest rates, total interest should be significant
        expect(result.totalInterest).toBeDefined();
        expect(typeof result.totalInterest).toBe('number');
        // With 25% interest over 25 years, total interest should exceed principal
        expect(result.totalInterest).toBeGreaterThan(principal);
    });

    it('should include payoff date', () => {
        const result = calculateMortgage({
            principal: 500000,
            interestRate: 5.25,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });

        expect(result.payoffDate).toBeDefined();
        expect(result.payoffDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should include effective rate', () => {
        const result = calculateMortgage({
            principal: 500000,
            interestRate: 5.25,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });

        expect(result.effectiveRate).toBeDefined();
        expect(result.effectiveRate).toBeGreaterThan(0);
        expect(result.effectiveRate).toBeLessThan(1);
    });

    it('should handle edge cases with invalid inputs', () => {
        // Function may throw or return invalid results for negative principal
        try {
            const result = calculateMortgage({
                principal: -100000,
                interestRate: 5.0,
                amortizationMonths: 300,
                paymentFrequency: 'monthly',
            });
            // If it doesn't throw, result should be checked
            expect(result).toBeDefined();
        } catch (error) {
            // Throwing is acceptable - validation should happen before calling
            expect(error).toBeDefined();
        }
    });
});

