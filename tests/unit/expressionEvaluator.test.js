import { describe, it, expect } from 'vitest';
import { evaluateExpression, isExpression } from '../../src/utils/expressionEvaluator.js';

describe('Expression Evaluator', () => {
    describe('evaluateExpression', () => {
        it('should evaluate simple addition', () => {
            expect(evaluateExpression('100+50')).toBe(150);
            expect(evaluateExpression('10+20+30')).toBe(60);
        });

        it('should evaluate subtraction', () => {
            expect(evaluateExpression('100-50')).toBe(50);
            expect(evaluateExpression('1000-200-100')).toBe(700);
        });

        it('should evaluate multiplication', () => {
            expect(evaluateExpression('10*5')).toBe(50);
            expect(evaluateExpression('2*3*4')).toBe(24);
        });

        it('should evaluate division', () => {
            expect(evaluateExpression('100/2')).toBe(50);
            expect(evaluateExpression('1200/12')).toBe(100);
            expect(evaluateExpression('100/3')).toBeCloseTo(33.33, 1);
        });

        it('should handle order of operations', () => {
            expect(evaluateExpression('2+3*4')).toBe(14); // 2 + 12
            expect(evaluateExpression('(2+3)*4')).toBe(20);
            expect(evaluateExpression('10-2*3')).toBe(4); // 10 - 6
        });

        it('should handle parentheses', () => {
            expect(evaluateExpression('(100+50)*2')).toBe(300);
            expect(evaluateExpression('(1200/12)+50')).toBe(150);
            expect(evaluateExpression('((10+5)*2)/3')).toBe(10);
        });

        it('should handle decimals', () => {
            expect(evaluateExpression('100.5+50.25')).toBe(150.75);
            expect(evaluateExpression('100.99/2')).toBeCloseTo(50.5, 1);
        });

        it('should remove whitespace', () => {
            expect(evaluateExpression('100 + 50')).toBe(150);
            expect(evaluateExpression('100 +  50  * 2')).toBe(200);
        });

        it('should remove thousand separators (commas)', () => {
            expect(evaluateExpression('1,000+500')).toBe(1500);
            expect(evaluateExpression('10,000/12')).toBeCloseTo(833.33, 1);
        });

        it('should round to 2 decimal places', () => {
            expect(evaluateExpression('100/3')).toBe(33.33);
            expect(evaluateExpression('1/3')).toBe(0.33);
        });

        it('should return null for invalid expressions', () => {
            expect(evaluateExpression('abc')).toBeNull();
            expect(evaluateExpression('100+abc')).toBeNull();
            expect(evaluateExpression('eval("alert(1)")')).toBeNull();
            expect(evaluateExpression('function(){}')).toBeNull();
        });

        it('should return null for expressions with disallowed characters', () => {
            expect(evaluateExpression('100+alert(1)')).toBeNull();
            expect(evaluateExpression('100;alert(1)')).toBeNull();
            expect(evaluateExpression('100%50')).toBeNull();
        });

        it('should return null for expressions that evaluate to invalid numbers', () => {
            expect(evaluateExpression('100/0')).toBeNull(); // Infinity
            expect(evaluateExpression('0/0')).toBeNull(); // NaN
        });

        it('should handle edge cases', () => {
            expect(evaluateExpression('0')).toBe(0);
            expect(evaluateExpression('0+0')).toBe(0);
            expect(evaluateExpression('100-100')).toBe(0);
            expect(evaluateExpression('1*0')).toBe(0);
        });

        it('should handle large numbers', () => {
            expect(evaluateExpression('1000000+500000')).toBe(1500000);
            expect(evaluateExpression('999999.99+0.01')).toBe(1000000);
        });
    });

    describe('isExpression', () => {
        it('should detect expressions with addition', () => {
            expect(isExpression('100+50')).toBe(true);
            expect(isExpression('100 + 50')).toBe(true);
        });

        it('should detect expressions with subtraction', () => {
            expect(isExpression('100-50')).toBe(true);
            expect(isExpression('100 - 50')).toBe(true);
        });

        it('should detect expressions with multiplication', () => {
            expect(isExpression('100*50')).toBe(true);
            expect(isExpression('100 * 50')).toBe(true);
        });

        it('should detect expressions with division', () => {
            expect(isExpression('100/50')).toBe(true);
            expect(isExpression('100 / 50')).toBe(true);
        });

        it('should detect expressions with parentheses', () => {
            expect(isExpression('(100+50)')).toBe(true);
            expect(isExpression('100+(50*2)')).toBe(true);
        });

        it('should return false for plain numbers', () => {
            expect(isExpression('100')).toBe(false);
            expect(isExpression('100.50')).toBe(false);
            expect(isExpression('1000')).toBe(false);
        });

        it('should return false for empty or invalid strings', () => {
            expect(isExpression('')).toBe(false);
            expect(isExpression('   ')).toBe(false);
            expect(isExpression('abc')).toBe(false);
        });

        it('should handle complex expressions', () => {
            expect(isExpression('(1200/12)+50')).toBe(true);
            expect(isExpression('100*2+50-25')).toBe(true);
        });
    });
});

