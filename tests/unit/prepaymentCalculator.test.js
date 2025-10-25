import { describe, it, expect } from 'vitest';
import { calculateWithPrepayment } from '../../src/services/prepaymentCalculator.js';

describe('Prepayment Calculator', () => {
    it('should calculate interest savings with extra payments', () => {
        const base = {
            principal: 500000,
            interestRate: 5.25,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        };

        const withPrepayment = calculateWithPrepayment({
            ...base,
            extraPayment: 500,
            extraPaymentFrequency: 'per-payment',
        });

        // Extra payments should reduce total interest
        expect(withPrepayment.totalInterestSaved).toBeGreaterThan(0);
        expect(withPrepayment.monthsSaved).toBeGreaterThan(0);
        expect(withPrepayment.actualPayoffMonths).toBeLessThan(300);
    });

    it('should handle annual lump sum payments', () => {
        const result = calculateWithPrepayment({
            principal: 500000,
            interestRate: 5.0,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
            extraPayment: 10000,
            extraPaymentFrequency: 'annual',
        });

        expect(result.totalInterestSaved).toBeGreaterThan(0);
    });

    it('should calculate accelerated payoff date', () => {
        const result = calculateWithPrepayment({
            principal: 300000,
            interestRate: 4.5,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
            extraPayment: 1000,
            extraPaymentFrequency: 'per-payment',
        });

        // With significant extra payment, should save years
        expect(result.monthsSaved).toBeGreaterThan(50);
    });
});

