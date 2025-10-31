import { describe, it, expect } from 'vitest';
import {
    decimal,
    add,
    subtract,
    multiply,
    divide,
    power,
    round,
    toNumber,
    toCurrency,
} from '../../src/utils/decimal-wrapper.js';

describe('Decimal Wrapper', () => {
    describe('decimal()', () => {
        it('should create Decimal from number', () => {
            const d = decimal(100);
            expect(d.toNumber()).toBe(100);
        });

        it('should create Decimal from string', () => {
            const d = decimal('100.50');
            expect(d.toNumber()).toBe(100.5);
        });

        it('should handle large numbers', () => {
            const d = decimal(1000000000);
            expect(d.toNumber()).toBe(1000000000);
        });

        it('should handle decimal precision', () => {
            const d = decimal(0.1);
            expect(d.toNumber()).toBe(0.1);
        });
    });

    describe('add()', () => {
        it('should add two numbers precisely', () => {
            const result = add(0.1, 0.2);
            expect(toNumber(result)).toBeCloseTo(0.3, 10);
        });

        it('should handle large numbers', () => {
            const result = add(1000000, 500000);
            expect(toNumber(result)).toBe(1500000);
        });

        it('should handle decimal numbers', () => {
            const result = add(100.50, 50.25);
            expect(toNumber(result)).toBe(150.75);
        });

        it('should handle string inputs', () => {
            const result = add('100', '50');
            expect(toNumber(result)).toBe(150);
        });
    });

    describe('subtract()', () => {
        it('should subtract numbers precisely', () => {
            const result = subtract(1.0, 0.9);
            expect(toNumber(result)).toBeCloseTo(0.1, 10);
        });

        it('should handle negative results', () => {
            const result = subtract(50, 100);
            expect(toNumber(result)).toBe(-50);
        });

        it('should handle decimal precision', () => {
            const result = subtract(100.75, 50.25);
            expect(toNumber(result)).toBe(50.5);
        });
    });

    describe('multiply()', () => {
        it('should multiply numbers precisely', () => {
            const result = multiply(0.1, 0.2);
            expect(toNumber(result)).toBeCloseTo(0.02, 10);
        });

        it('should handle large multiplications', () => {
            const result = multiply(1000000, 2);
            expect(toNumber(result)).toBe(2000000);
        });

        it('should handle decimal multiplication', () => {
            const result = multiply(100.5, 2);
            expect(toNumber(result)).toBe(201);
        });
    });

    describe('divide()', () => {
        it('should divide numbers precisely', () => {
            const result = divide(1, 3);
            // Should be precise to many decimal places
            expect(toNumber(result)).toBeCloseTo(0.3333333333333333, 10);
        });

        it('should handle division by integer', () => {
            const result = divide(100, 2);
            expect(toNumber(result)).toBe(50);
        });

        it('should handle division by decimal', () => {
            const result = divide(100, 2.5);
            expect(toNumber(result)).toBe(40);
        });

        it('should handle division that results in decimal', () => {
            const result = divide(100, 3);
            expect(toNumber(result)).toBeCloseTo(33.333333333333336, 10);
        });
    });

    describe('power()', () => {
        it('should calculate powers correctly', () => {
            const result = power(2, 3);
            expect(toNumber(result)).toBe(8);
        });

        it('should handle decimal exponents', () => {
            const result = power(100, 0.5); // square root
            expect(toNumber(result)).toBeCloseTo(10, 5);
        });

        it('should handle fractional powers', () => {
            const result = power(16, 0.25); // fourth root
            expect(toNumber(result)).toBeCloseTo(2, 5);
        });
    });

    describe('round()', () => {
        it('should round to 2 decimal places by default', () => {
            expect(round(100.555)).toBe(100.56);
            expect(round(100.554)).toBe(100.55);
        });

        it('should round to specified decimal places', () => {
            expect(round(100.5555, 3)).toBe(100.556);
            expect(round(100.5555, 1)).toBe(100.6);
            expect(round(100.5555, 0)).toBe(101);
        });

        it('should handle rounding up', () => {
            expect(round(100.005, 2)).toBe(100.01);
        });

        it('should handle rounding down', () => {
            expect(round(100.004, 2)).toBe(100.00);
        });

        it('should handle rounding to integer', () => {
            expect(round(100.6, 0)).toBe(101);
            expect(round(100.4, 0)).toBe(100);
        });
    });

    describe('toNumber()', () => {
        it('should convert Decimal to number', () => {
            const d = decimal(100.5);
            expect(toNumber(d)).toBe(100.5);
        });

        it('should maintain precision', () => {
            const d = decimal('0.1').plus(decimal('0.2'));
            expect(toNumber(d)).toBeCloseTo(0.3, 10);
        });
    });

    describe('toCurrency()', () => {
        it('should format as CAD currency', () => {
            const formatted = toCurrency(1000);
            expect(formatted).toContain('$');
            expect(formatted).toContain('1,000');
        });

        it('should format with 2 decimal places', () => {
            const formatted = toCurrency(1000.5);
            expect(formatted).toContain('1,000.50');
        });

        it('should format large numbers with commas', () => {
            const formatted = toCurrency(1000000);
            expect(formatted).toContain('1,000,000');
        });

        it('should format small decimals', () => {
            const formatted = toCurrency(0.5);
            expect(formatted).toContain('0.50');
        });

        it('should format negative numbers', () => {
            const formatted = toCurrency(-1000);
            expect(formatted).toContain('-');
        });
    });

    describe('Precision handling', () => {
        it('should avoid floating point errors', () => {
            // Classic floating point issue: 0.1 + 0.2 !== 0.3
            const result = add(0.1, 0.2);
            expect(toNumber(result)).toBe(0.3);
        });

        it('should maintain precision in compound operations', () => {
            const result = multiply(add(0.1, 0.2), 3);
            expect(toNumber(result)).toBe(0.9);
        });

        it('should handle repeated additions precisely', () => {
            let result = decimal(0);
            for (let i = 0; i < 10; i++) {
                result = add(result, 0.1);
            }
            expect(toNumber(result)).toBe(1);
        });
    });
});

