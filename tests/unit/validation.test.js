import { describe, it, expect } from 'vitest';
import { validateMortgageInputs } from '../../src/services/validation.js';

describe('Input Validation', () => {
    it('should accept valid mortgage inputs', () => {
        const result = validateMortgageInputs({
            principal: 500000,
            interestRate: 5.25,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });

        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });

    it('should reject negative principal', () => {
        const result = validateMortgageInputs({
            principal: -100000,
            interestRate: 5.0,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('PRINCIPAL_TOO_LOW');
    });

    it('should reject principal exceeding $10M', () => {
        const result = validateMortgageInputs({
            principal: 11000000,
            interestRate: 5.0,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('PRINCIPAL_TOO_HIGH');
    });

    it('should reject interest rate below 0.01%', () => {
        const result = validateMortgageInputs({
            principal: 500000,
            interestRate: 0,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('RATE_TOO_LOW');
    });

    it('should reject amortization > 25 years for high-ratio mortgages', () => {
        const result = validateMortgageInputs({
            principal: 500000,
            interestRate: 5.0,
            amortizationMonths: 360, // 30 years
            paymentFrequency: 'monthly',
            isHighRatio: true,
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('TERM_TOO_LONG_HIGH_RATIO');
    });

    it('should accept valid payment frequencies', () => {
        const frequencies = ['monthly', 'bi-weekly', 'weekly'];

        frequencies.forEach((freq) => {
            const result = validateMortgageInputs({
                principal: 500000,
                interestRate: 5.0,
                amortizationMonths: 300,
                paymentFrequency: freq,
            });

            expect(result.isValid).toBe(true);
        });
    });

    it('should reject principal below minimum', () => {
        const result = validateMortgageInputs({
            principal: 500,
            interestRate: 5.0,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('PRINCIPAL_TOO_LOW');
    });

    it('should reject principal at zero', () => {
        const result = validateMortgageInputs({
            principal: 0,
            interestRate: 5.0,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('PRINCIPAL_TOO_LOW');
    });

    it('should reject interest rate exceeding maximum', () => {
        const result = validateMortgageInputs({
            principal: 500000,
            interestRate: 35.0,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('RATE_TOO_HIGH');
    });

    it('should reject amortization below minimum', () => {
        const result = validateMortgageInputs({
            principal: 500000,
            interestRate: 5.0,
            amortizationMonths: 6,
            paymentFrequency: 'monthly',
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('TERM_TOO_SHORT');
    });

    it('should accept conventional mortgage with 30-year term', () => {
        const result = validateMortgageInputs({
            principal: 500000,
            interestRate: 5.0,
            amortizationMonths: 360,
            paymentFrequency: 'monthly',
            isHighRatio: false,
        });

        expect(result.isValid).toBe(true);
    });

    it('should reject high-ratio mortgage with 30-year term', () => {
        const result = validateMortgageInputs({
            principal: 500000,
            interestRate: 5.0,
            amortizationMonths: 360,
            paymentFrequency: 'monthly',
            isHighRatio: true,
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('TERM_TOO_LONG_HIGH_RATIO');
    });

    it('should reject invalid payment frequency', () => {
        const result = validateMortgageInputs({
            principal: 500000,
            interestRate: 5.0,
            amortizationMonths: 300,
            paymentFrequency: 'invalid',
        });

        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('INVALID_PAYMENT_FREQUENCY');
    });

    it('should return warnings array (even if empty)', () => {
        const result = validateMortgageInputs({
            principal: 500000,
            interestRate: 5.0,
            amortizationMonths: 300,
            paymentFrequency: 'monthly',
        });

        expect(result.warnings).toBeDefined();
        expect(Array.isArray(result.warnings)).toBe(true);
    });
});

