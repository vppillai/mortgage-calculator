/**
 * Custom error classes and error handling utilities
 */

import { MORTGAGE_CONSTANTS } from './constants.js';

/**
 * Base error class for mortgage calculator
 */
export class MortgageCalculatorError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'MortgageCalculatorError';
        this.code = code;
    }
}

/**
 * Validation error
 */
export class ValidationError extends MortgageCalculatorError {
    constructor(field, message, value) {
        super(message, MORTGAGE_CONSTANTS.ERROR_CODES.INVALID_PRINCIPAL);
        this.name = 'ValidationError';
        this.field = field;
        this.value = value;
    }
}

/**
 * Calculation error
 */
export class CalculationError extends MortgageCalculatorError {
    constructor(message) {
        super(message, MORTGAGE_CONSTANTS.ERROR_CODES.CALCULATION_ERROR);
        this.name = 'CalculationError';
    }
}

/**
 * Storage error
 */
export class StorageError extends MortgageCalculatorError {
    constructor(message) {
        super(message, MORTGAGE_CONSTANTS.ERROR_CODES.STORAGE_ERROR);
        this.name = 'StorageError';
    }
}

/**
 * Format error for user display
 * @param {Error} error
 * @returns {string}
 */
export function formatErrorMessage(error) {
    if (error instanceof ValidationError) {
        return error.message;
    }

    if (error instanceof CalculationError) {
        return `Calculation error: ${error.message}`;
    }

    if (error instanceof StorageError) {
        return `Storage error: ${error.message}. Your data may not be saved.`;
    }

    return `An unexpected error occurred: ${error.message}`;
}

/**
 * Log error with context
 * @param {Error} error
 * @param {Object} context
 */
export function logError(error, context = {}) {
    console.error('[Mortgage Calculator Error]', {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack,
        ...context,
    });
}

export default {
    MortgageCalculatorError,
    ValidationError,
    CalculationError,
    StorageError,
    formatErrorMessage,
    logError,
};

