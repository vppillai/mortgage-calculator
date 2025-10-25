import { describe, it, expect } from 'vitest';
import { formatCAD, parseCAD } from '../../src/services/currencyFormatter.js';

describe('CAD Currency Formatter', () => {
    it('should format numbers as CAD currency', () => {
        expect(formatCAD(1000)).toBe('$1,000.00');
        expect(formatCAD(500000)).toBe('$500,000.00');
        expect(formatCAD(1234567.89)).toBe('$1,234,567.89');
    });

    it('should handle decimal precision correctly', () => {
        expect(formatCAD(100.12)).toBe('$100.12');
        expect(formatCAD(100.1)).toBe('$100.10');
        expect(formatCAD(100)).toBe('$100.00');
    });

    it('should format negative numbers', () => {
        expect(formatCAD(-1000)).toContain('-');
        expect(formatCAD(-1000)).toContain('1,000');
    });

    it('should use Canadian locale formatting', () => {
        const formatted = formatCAD(1000000);
        expect(formatted).toMatch(/\$1,000,000\.00/);
    });

    it('should parse CAD strings to numbers', () => {
        expect(parseCAD('$1,000.00')).toBe(1000);
        expect(parseCAD('$500,000.00')).toBe(500000);
        expect(parseCAD('1000')).toBe(1000);
    });

    it('should handle invalid input gracefully', () => {
        expect(parseCAD('invalid')).toBe(0);
        expect(parseCAD('')).toBe(0);
        expect(parseCAD(null)).toBe(0);
    });
});

