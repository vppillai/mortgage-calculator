/**
 * Input validation service
 */

import { MORTGAGE_CONSTANTS } from '../utils/constants.js';

export function validateMortgageInputs(inputs) {
    const errors = [];
    const warnings = [];

    const { principal, interestRate, amortizationMonths, paymentFrequency, isHighRatio } = inputs;

    // Validate principal
    if (principal < MORTGAGE_CONSTANTS.MIN_PRINCIPAL) {
        errors.push('PRINCIPAL_TOO_LOW');
    }
    if (principal > MORTGAGE_CONSTANTS.MAX_PRINCIPAL) {
        errors.push('PRINCIPAL_TOO_HIGH');
    }

    // Validate interest rate
    if (interestRate < MORTGAGE_CONSTANTS.MIN_INTEREST_RATE) {
        errors.push('RATE_TOO_LOW');
    }
    if (interestRate > MORTGAGE_CONSTANTS.MAX_INTEREST_RATE) {
        errors.push('RATE_TOO_HIGH');
    }

    // Validate amortization
    if (amortizationMonths < MORTGAGE_CONSTANTS.MIN_AMORTIZATION) {
        errors.push('TERM_TOO_SHORT');
    }

    if (isHighRatio && amortizationMonths > MORTGAGE_CONSTANTS.MAX_AMORTIZATION_HIGH_RATIO) {
        errors.push('TERM_TOO_LONG_HIGH_RATIO');
    } else if (amortizationMonths > MORTGAGE_CONSTANTS.MAX_AMORTIZATION_CONVENTIONAL) {
        errors.push('TERM_TOO_LONG_CONVENTIONAL');
    }

    // Validate payment frequency
    if (!MORTGAGE_CONSTANTS.PAYMENTS_PER_YEAR[paymentFrequency]) {
        errors.push('INVALID_PAYMENT_FREQUENCY');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
}

export default { validateMortgageInputs };

