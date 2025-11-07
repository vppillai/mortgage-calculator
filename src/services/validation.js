/**
 * Input validation service
 */

import { MORTGAGE_CONSTANTS } from '../utils/constants.js';
import { formatCAD } from './currencyFormatter.js';

// User-friendly error messages with contextual help
const ERROR_MESSAGES = {
    PRINCIPAL_TOO_LOW: {
        message: `Loan amount must be at least ${formatCAD(MORTGAGE_CONSTANTS.MIN_PRINCIPAL)}`,
        help: 'Canadian mortgages typically start at $1,000. Enter your total loan amount including any down payment.'
    },
    PRINCIPAL_TOO_HIGH: {
        message: `Loan amount cannot exceed ${formatCAD(MORTGAGE_CONSTANTS.MAX_PRINCIPAL)}`,
        help: 'For loans over $10M, please consult with a mortgage specialist for custom calculations.'
    },
    RATE_TOO_LOW: {
        message: `Interest rate must be at least ${MORTGAGE_CONSTANTS.MIN_INTEREST_RATE}%`,
        help: 'Enter the annual interest rate as a percentage (e.g., 4.05 for 4.05%).'
    },
    RATE_TOO_HIGH: {
        message: `Interest rate cannot exceed ${MORTGAGE_CONSTANTS.MAX_INTEREST_RATE}%`,
        help: 'Please verify your interest rate. Rates above 30% are unusual for Canadian mortgages.'
    },
    TERM_TOO_SHORT: {
        message: 'Amortization period must be at least 1 year',
        help: 'The amortization period is the total time to pay off your mortgage. Minimum is 1 year (12 months).'
    },
    INVALID_PAYMENT_FREQUENCY: {
        message: 'Please select a valid payment frequency',
        help: 'Choose how often you make payments: weekly (52/year), bi-weekly (26/year), or monthly (12/year).'
    },
};

/**
 * Get error message (backward compatible)
 * @param {string} errorCode - Error code
 * @returns {string} Error message
 */
function getErrorMessageText(errorCode) {
    const error = ERROR_MESSAGES[errorCode];
    return error?.message || error || errorCode;
}

/**
 * Get error help text
 * @param {string} errorCode - Error code
 * @returns {string|undefined} Help text
 */
export function getErrorHelp(errorCode) {
    return ERROR_MESSAGES[errorCode]?.help;
}

export function validateMortgageInputs(inputs) {
    const errors = [];
    const warnings = [];
    const fieldErrors = {};

    const { principal, interestRate, amortizationMonths, paymentFrequency, isHighRatio } = inputs;

    // Validate principal
    if (principal < MORTGAGE_CONSTANTS.MIN_PRINCIPAL) {
        const error = 'PRINCIPAL_TOO_LOW';
        errors.push(error);
        fieldErrors.principal = getErrorMessageText(error);
    }
    if (principal > MORTGAGE_CONSTANTS.MAX_PRINCIPAL) {
        const error = 'PRINCIPAL_TOO_HIGH';
        errors.push(error);
        fieldErrors.principal = getErrorMessageText(error);
    }

    // Validate interest rate
    if (interestRate < MORTGAGE_CONSTANTS.MIN_INTEREST_RATE) {
        const error = 'RATE_TOO_LOW';
        errors.push(error);
        fieldErrors.interestRate = getErrorMessageText(error);
    }
    if (interestRate > MORTGAGE_CONSTANTS.MAX_INTEREST_RATE) {
        const error = 'RATE_TOO_HIGH';
        errors.push(error);
        fieldErrors.interestRate = getErrorMessageText(error);
    }

    // Validate amortization - only check minimum for flexibility
    if (amortizationMonths < MORTGAGE_CONSTANTS.MIN_AMORTIZATION) {
        const error = 'TERM_TOO_SHORT';
        errors.push(error);
        fieldErrors.amortizationMonths = getErrorMessageText(error);
    }

    // Removed maximum amortization constraints for flexibility
    // Users can enter any term they need for calculations

    // Validate payment frequency
    if (!MORTGAGE_CONSTANTS.PAYMENTS_PER_YEAR[paymentFrequency]) {
        const error = 'INVALID_PAYMENT_FREQUENCY';
        errors.push(error);
        fieldErrors.paymentFrequency = getErrorMessageText(error);
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        fieldErrors,
        errorMessages: errors.map(code => getErrorMessageText(code)),
        errorHelp: errors.reduce((acc, code) => {
            acc[code] = getErrorHelp(code);
            return acc;
        }, {}),
    };
}

/**
 * Get user-friendly error message for an error code
 * @param {string} errorCode - Error code
 * @returns {string} Error message
 */
export function getErrorMessage(errorCode) {
    return getErrorMessageText(errorCode);
}

export default { validateMortgageInputs };
