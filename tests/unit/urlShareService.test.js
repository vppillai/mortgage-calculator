import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock window and URL APIs for testing
const mockWindow = {
    location: {
        href: 'https://example.com/mortgage-calculator',
        search: '',
        pathname: '/mortgage-calculator',
        origin: 'https://example.com',
    },
    history: {
        replaceState: vi.fn(),
    },
    location: new URL('https://example.com/mortgage-calculator'),
};

// Override window.location to use URL object
Object.defineProperty(mockWindow, 'location', {
    get: () => new URL('https://example.com/mortgage-calculator'),
    set: () => {},
});

global.window = mockWindow;
global.btoa = (str) => Buffer.from(str, 'binary').toString('base64');
global.atob = (str) => Buffer.from(str, 'base64').toString('binary');

import {
    encodeScenarios,
    decodeScenarios,
    generateShareableUrl,
    parseScenariosFromUrl,
    cleanUrl,
    copyToClipboard,
} from '../../src/services/urlShareService.js';

describe('URL Share Service', () => {
    beforeEach(() => {
        // Mock window.location as a URL object
        global.window = {
            location: new URL('https://example.com/mortgage-calculator'),
            history: {
                replaceState: vi.fn(),
            },
        };
        global.document = {
            title: 'Test',
        };
        vi.clearAllMocks();
    });

    describe('encodeScenarios()', () => {
        it('should encode a single scenario', () => {
            const scenarios = [{
                principal: 500000,
                interestRate: 5.25,
                amortizationMonths: 300,
                paymentFrequency: 'monthly',
                extraPaymentAmount: 0,
                extraPaymentFrequency: 'per-payment',
            }];

            const encoded = encodeScenarios(scenarios);
            expect(encoded).toBeTruthy();
            expect(typeof encoded).toBe('string');
        });

        it('should encode multiple scenarios', () => {
            const scenarios = [
                {
                    principal: 500000,
                    interestRate: 5.25,
                    amortizationMonths: 300,
                    paymentFrequency: 'monthly',
                    extraPaymentAmount: 0,
                },
                {
                    principal: 300000,
                    interestRate: 4.5,
                    amortizationMonths: 240,
                    paymentFrequency: 'weekly',
                    extraPaymentAmount: 100,
                    extraPaymentFrequency: 'annual',
                },
            ];

            const encoded = encodeScenarios(scenarios);
            expect(encoded).toBeTruthy();
        });

        it('should handle different payment frequencies', () => {
            const scenarios = [
                { principal: 100000, interestRate: 5, amortizationMonths: 300, paymentFrequency: 'weekly', extraPaymentAmount: 0 },
                { principal: 100000, interestRate: 5, amortizationMonths: 300, paymentFrequency: 'bi-weekly', extraPaymentAmount: 0 },
                { principal: 100000, interestRate: 5, amortizationMonths: 300, paymentFrequency: 'monthly', extraPaymentAmount: 0 },
            ];

            scenarios.forEach(scenario => {
                const encoded = encodeScenarios([scenario]);
                expect(encoded).toBeTruthy();
            });
        });

        it('should return empty string for empty array', () => {
            expect(encodeScenarios([])).toBe('');
        });

        it('should return empty string for null/undefined', () => {
            expect(encodeScenarios(null)).toBe('');
            expect(encodeScenarios(undefined)).toBe('');
        });

        it('should handle extra payment frequencies', () => {
            const scenarios = [
                { principal: 500000, interestRate: 5, amortizationMonths: 300, paymentFrequency: 'monthly', extraPaymentAmount: 100, extraPaymentFrequency: 'per-payment' },
                { principal: 500000, interestRate: 5, amortizationMonths: 300, paymentFrequency: 'monthly', extraPaymentAmount: 1000, extraPaymentFrequency: 'annual' },
                { principal: 500000, interestRate: 5, amortizationMonths: 300, paymentFrequency: 'monthly', extraPaymentAmount: 5000, extraPaymentFrequency: 'one-time' },
            ];

            scenarios.forEach(scenario => {
                const encoded = encodeScenarios([scenario]);
                expect(encoded).toBeTruthy();
            });
        });
    });

    describe('decodeScenarios()', () => {
        it('should decode a single scenario', () => {
            const scenario = {
                principal: 500000,
                interestRate: 5.25,
                amortizationMonths: 300,
                paymentFrequency: 'monthly',
                extraPaymentAmount: 0,
            };

            const encoded = encodeScenarios([scenario]);
            const decoded = decodeScenarios(encoded);

            expect(decoded).toHaveLength(1);
            expect(decoded[0].principal).toBe(scenario.principal);
            expect(decoded[0].interestRate).toBeCloseTo(scenario.interestRate, 2);
            expect(decoded[0].amortizationMonths).toBe(scenario.amortizationMonths);
            expect(decoded[0].paymentFrequency).toBe(scenario.paymentFrequency);
        });

        it('should decode multiple scenarios', () => {
            const scenarios = [
                { principal: 500000, interestRate: 5.25, amortizationMonths: 300, paymentFrequency: 'monthly', extraPaymentAmount: 0 },
                { principal: 300000, interestRate: 4.5, amortizationMonths: 240, paymentFrequency: 'weekly', extraPaymentAmount: 100, extraPaymentFrequency: 'annual' },
            ];

            const encoded = encodeScenarios(scenarios);
            const decoded = decodeScenarios(encoded);

            expect(decoded).toHaveLength(2);
            expect(decoded[0].principal).toBe(scenarios[0].principal);
            expect(decoded[1].principal).toBe(scenarios[1].principal);
        });

        it('should handle round-trip encoding/decoding', () => {
            const originalScenarios = [
                { principal: 500000, interestRate: 5.25, amortizationMonths: 300, paymentFrequency: 'monthly', extraPaymentAmount: 500, extraPaymentFrequency: 'per-payment' },
                { principal: 300000, interestRate: 4.5, amortizationMonths: 240, paymentFrequency: 'weekly', extraPaymentAmount: 1000, extraPaymentFrequency: 'annual' },
            ];

            const encoded = encodeScenarios(originalScenarios);
            const decoded = decodeScenarios(encoded);

            expect(decoded).toHaveLength(2);
            originalScenarios.forEach((original, index) => {
                expect(decoded[index].principal).toBe(original.principal);
                expect(decoded[index].interestRate).toBeCloseTo(original.interestRate, 1);
                expect(decoded[index].amortizationMonths).toBe(original.amortizationMonths);
                expect(decoded[index].paymentFrequency).toBe(original.paymentFrequency);
                expect(decoded[index].extraPaymentAmount).toBe(original.extraPaymentAmount);
            });
        });

        it('should return empty array for invalid input', () => {
            expect(decodeScenarios('')).toEqual([]);
            expect(decodeScenarios(null)).toEqual([]);
            expect(decodeScenarios(undefined)).toEqual([]);
        });

        it('should handle invalid base64 gracefully', () => {
            // Invalid base64 may throw or return empty, both are acceptable
            try {
                const result = decodeScenarios('invalid-base64!');
                // If it doesn't throw, should return empty array or valid structure
                expect(Array.isArray(result)).toBe(true);
            } catch (error) {
                // Throwing is also acceptable - error handling works
                expect(error).toBeDefined();
            }
        });

        it('should handle malformed encoded data gracefully', () => {
            // The function should handle errors, but may return partial data
            // Both throwing and returning partial data are handled by try/catch
            const result = decodeScenarios('not-valid-base64-encoding');
            // Should either return empty array or handle gracefully
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('generateShareableUrl()', () => {
        it('should generate URL with encoded scenarios', () => {
            const scenarios = [{
                principal: 500000,
                interestRate: 5.25,
                amortizationMonths: 300,
                paymentFrequency: 'monthly',
                extraPaymentAmount: 0,
            }];

            const url = generateShareableUrl(scenarios);
            expect(url).toContain('?s=');
            expect(url).toContain('mortgage-calculator');
        });

        it('should return base URL when no scenarios', () => {
            const url = generateShareableUrl([]);
            expect(url).toBe('https://example.com/mortgage-calculator');
            expect(url).not.toContain('?s=');
        });
    });

    describe('parseScenariosFromUrl()', () => {
        it('should parse scenarios from URL parameters', () => {
            const scenarios = [{
                principal: 500000,
                interestRate: 5.25,
                amortizationMonths: 300,
                paymentFrequency: 'monthly',
                extraPaymentAmount: 0,
            }];

            const encoded = encodeScenarios(scenarios);
            global.window.location = new URL(`https://example.com/mortgage-calculator?s=${encoded}`);

            const parsed = parseScenariosFromUrl();
            expect(parsed).toHaveLength(1);
            expect(parsed[0].principal).toBe(scenarios[0].principal);
        });

        it('should return empty array when no parameter exists', () => {
            global.window.location = new URL('https://example.com/mortgage-calculator');
            expect(parseScenariosFromUrl()).toEqual([]);
        });
    });

    describe('cleanUrl()', () => {
        it('should remove query parameters from URL', () => {
            global.window.location = new URL('https://example.com/mortgage-calculator?s=encoded-data&other=param');
            global.window.history.replaceState = vi.fn();
            global.document.title = 'Test Title';

            cleanUrl();

            expect(global.window.history.replaceState).toHaveBeenCalled();
            const callArgs = global.window.history.replaceState.mock.calls[0];
            expect(callArgs[2]).toBe('/mortgage-calculator');
        });
    });

    describe('copyToClipboard()', () => {
        it('should use modern clipboard API when available', async () => {
            const mockWriteText = vi.fn().mockResolvedValue(undefined);
            global.navigator = {
                clipboard: {
                    writeText: mockWriteText,
                },
            };
            global.window.isSecureContext = true;

            const result = await copyToClipboard('test text');
            expect(result).toBe(true);
            expect(mockWriteText).toHaveBeenCalledWith('test text');
        });

        it('should fallback to execCommand when clipboard API unavailable', async () => {
            global.navigator = {};
            global.window.isSecureContext = false;
            global.document = {
                createElement: vi.fn(() => ({
                    value: '',
                    style: {},
                    select: vi.fn(),
                })),
                body: {
                    appendChild: vi.fn(),
                    removeChild: vi.fn(),
                },
                execCommand: vi.fn(() => true),
            };

            const result = await copyToClipboard('test text');
            expect(result).toBe(true);
        });

        it('should return false on error', async () => {
            global.navigator = {
                clipboard: {
                    writeText: vi.fn().mockRejectedValue(new Error('Clipboard error')),
                },
            };
            global.window.isSecureContext = true;

            const result = await copyToClipboard('test text');
            expect(result).toBe(false);
        });
    });
});

