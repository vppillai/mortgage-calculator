import { describe, it, expect } from 'vitest';
import {
    MortgageCalculatorError,
    ValidationError,
    CalculationError,
    StorageError,
    formatErrorMessage,
    logError,
} from '../../src/utils/errors.js';

describe('Error Classes', () => {
    describe('MortgageCalculatorError', () => {
        it('should create error with message and code', () => {
            const error = new MortgageCalculatorError('Test error', 'TEST_CODE');
            expect(error.message).toBe('Test error');
            expect(error.code).toBe('TEST_CODE');
            expect(error.name).toBe('MortgageCalculatorError');
            expect(error).toBeInstanceOf(Error);
        });
    });

    describe('ValidationError', () => {
        it('should create validation error with field and value', () => {
            const error = new ValidationError('principal', 'Invalid principal', 100000);
            expect(error.message).toBe('Invalid principal');
            expect(error.field).toBe('principal');
            expect(error.value).toBe(100000);
            expect(error.name).toBe('ValidationError');
            expect(error).toBeInstanceOf(MortgageCalculatorError);
        });

        it('should have correct error code', () => {
            const error = new ValidationError('principal', 'Invalid', 0);
            expect(error.code).toBe('INVALID_PRINCIPAL');
        });
    });

    describe('CalculationError', () => {
        it('should create calculation error', () => {
            const error = new CalculationError('Calculation failed');
            expect(error.message).toBe('Calculation failed');
            expect(error.name).toBe('CalculationError');
            expect(error.code).toBe('CALCULATION_ERROR');
            expect(error).toBeInstanceOf(MortgageCalculatorError);
        });
    });

    describe('StorageError', () => {
        it('should create storage error', () => {
            const error = new StorageError('Storage unavailable');
            expect(error.message).toBe('Storage unavailable');
            expect(error.name).toBe('StorageError');
            expect(error.code).toBe('STORAGE_ERROR');
            expect(error).toBeInstanceOf(MortgageCalculatorError);
        });
    });
});

describe('Error Utilities', () => {
    describe('formatErrorMessage()', () => {
        it('should format ValidationError messages', () => {
            const error = new ValidationError('principal', 'Invalid principal', 0);
            const formatted = formatErrorMessage(error);
            expect(formatted).toBe('Invalid principal');
        });

        it('should format CalculationError messages', () => {
            const error = new CalculationError('Division by zero');
            const formatted = formatErrorMessage(error);
            expect(formatted).toBe('Calculation error: Division by zero');
        });

        it('should format StorageError messages', () => {
            const error = new StorageError('Quota exceeded');
            const formatted = formatErrorMessage(error);
            expect(formatted).toBe('Storage error: Quota exceeded. Your data may not be saved.');
        });

        it('should format generic errors', () => {
            const error = new Error('Generic error');
            const formatted = formatErrorMessage(error);
            expect(formatted).toBe('An unexpected error occurred: Generic error');
        });

        it('should handle MortgageCalculatorError without specific type', () => {
            const error = new MortgageCalculatorError('Unknown error', 'UNKNOWN');
            const formatted = formatErrorMessage(error);
            expect(formatted).toBe('An unexpected error occurred: Unknown error');
        });
    });

    describe('logError()', () => {
        it('should log error with context', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const error = new ValidationError('principal', 'Invalid', 0);
            const context = { userId: '123', action: 'calculate' };

            logError(error, context);

            expect(consoleSpy).toHaveBeenCalled();
            const callArgs = consoleSpy.mock.calls[0][1];
            expect(callArgs.name).toBe('ValidationError');
            expect(callArgs.message).toBe('Invalid');
            expect(callArgs.userId).toBe('123');
            expect(callArgs.action).toBe('calculate');

            consoleSpy.mockRestore();
        });

        it('should log error without context', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const error = new Error('Test error');

            logError(error);

            expect(consoleSpy).toHaveBeenCalled();
            consoleSpy.mockRestore();
        });

        it('should include stack trace in log', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const error = new Error('Test error');

            logError(error);

            const callArgs = consoleSpy.mock.calls[0][1];
            expect(callArgs.stack).toBeDefined();

            consoleSpy.mockRestore();
        });
    });
});

