/**
 * Input validation service
 */

import { MORTGAGE_CONSTANTS } from '../utils/constants.js';
import { formatCAD } from './currencyFormatter.js';

// User-friendly error messages
const ERROR_MESSAGES = {
    PRINCIPAL_TOO_LOW: `Loan amount must be at least ${formatCAD(MORTGAGE_CONSTANTS.MIN_PRINCIPAL)}`,
    PRINCIPAL_TOO_HIGH: `Loan amount cannot exceed ${formatCAD(MORTGAGE_CONSTANTS.MAX_PRINCIPAL)}`,
    RATE_TOO_LOW: `Interest rate must be at least ${MORTGAGE_CONSTANTS.MIN_INTEREST_RATE}%`,
    RATE_TOO_HIGH: `Interest rate cannot exceed ${MORTGAGE_CONSTANTS.MAX_INTEREST_RATE}%`,
    TERM_TOO_SHORT: 'Amortization period must be at least 1 year',
    TERM_TOO_LONG_HIGH_RATIO: 'High-ratio mortgages (over 80% LTV) cannot exceed 25 years',
    TERM_TOO_LONG_CONVENTIONAL: 'Conventional mortgages cannot exceed 30 years',
    INVALID_PAYMENT_FREQUENCY: 'Please select a valid payment frequency',
};

export function validateMortgageInputs(inputs) {
    const errors = [];
    const warnings = [];
    const fieldErrors = {};

    const { principal, interestRate, amortizationMonths, paymentFrequency, isHighRatio } = inputs;

    // Validate principal
    if (principal < MORTGAGE_CONSTANTS.MIN_PRINCIPAL) {
        const error = 'PRINCIPAL_TOO_LOW';
        errors.push(error);
        fieldErrors.principal = ERROR_MESSAGES[error];
    }
    if (principal > MORTGAGE_CONSTANTS.MAX_PRINCIPAL) {
        const error = 'PRINCIPAL_TOO_HIGH';
        errors.push(error);
        fieldErrors.principal = ERROR_MESSAGES[error];
    }

    // Validate interest rate
    if (interestRate < MORTGAGE_CONSTANTS.MIN_INTEREST_RATE) {
        const error = 'RATE_TOO_LOW';
        errors.push(error);
        fieldErrors.interestRate = ERROR_MESSAGES[error];
    }
    if (interestRate > MORTGAGE_CONSTANTS.MAX_INTEREST_RATE) {
        const error = 'RATE_TOO_HIGH';
        errors.push(error);
        fieldErrors.interestRate = ERROR_MESSAGES[error];
    }

    // Validate amortization
    if (amortizationMonths < MORTGAGE_CONSTANTS.MIN_AMORTIZATION) {
        const error = 'TERM_TOO_SHORT';
        errors.push(error);
        fieldErrors.amortizationMonths = ERROR_MESSAGES[error];
    }

    if (isHighRatio && amortizationMonths > MORTGAGE_CONSTANTS.MAX_AMORTIZATION_HIGH_RATIO) {
        const error = 'TERM_TOO_LONG_HIGH_RATIO';
        errors.push(error);
        fieldErrors.amortizationMonths = ERROR_MESSAGES[error];
    } else if (amortizationMonths > MORTGAGE_CONSTANTS.MAX_AMORTIZATION_CONVENTIONAL) {
        const error = 'TERM_TOO_LONG_CONVENTIONAL';
        errors.push(error);
        fieldErrors.amortizationMonths = ERROR_MESSAGES[error];
    }

    // Validate payment frequency
    if (!MORTGAGE_CONSTANTS.PAYMENTS_PER_YEAR[paymentFrequency]) {
        const error = 'INVALID_PAYMENT_FREQUENCY';
        errors.push(error);
        fieldErrors.paymentFrequency = ERROR_MESSAGES[error];
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        fieldErrors,
        errorMessages: errors.map(code => ERROR_MESSAGES[code] || code),
    };
}

/**
 * Get user-friendly error message for an error code
 */
export function getErrorMessage(errorCode) {
    return ERROR_MESSAGES[errorCode] || errorCode;
}

export default { validateMortgageInputs };

