import { describe, it, expect, beforeEach, vi } from 'vitest';
import storageService from '../../src/services/storage.js';

describe('Storage Service', () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        // Reset storage service cache
        storageService.resetCache();
    });

    describe('isAvailable()', () => {
        it('should return true when localStorage is available', () => {
            expect(storageService.isAvailable()).toBe(true);
        });

        it('should handle localStorage unavailability gracefully', () => {
            // Mock localStorage to throw error
            const originalSetItem = Storage.prototype.setItem;
            Storage.prototype.setItem = vi.fn(() => {
                throw new Error('QuotaExceededError');
            });

            expect(storageService.isAvailable()).toBe(false);

            // Restore
            Storage.prototype.setItem = originalSetItem;
        });
    });

    describe('get() and set()', () => {
        it('should store and retrieve simple values', () => {
            const testData = { key: 'value', number: 42 };
            storageService.set('test-key', testData);

            const retrieved = storageService.get('test-key');
            expect(retrieved).toEqual(testData);
        });

        it('should store and retrieve arrays', () => {
            const testArray = [1, 2, 3, { nested: 'value' }];
            storageService.set('test-array', testArray);

            const retrieved = storageService.get('test-array');
            expect(retrieved).toEqual(testArray);
        });

        it('should return null for non-existent keys', () => {
            expect(storageService.get('nonexistent-key')).toBeNull();
        });

        it('should handle JSON parsing errors gracefully', () => {
            // Manually set invalid JSON
            localStorage.setItem('invalid-json', '{invalid json}');
            expect(storageService.get('invalid-json')).toBeNull();
        });

        it('should return false when localStorage is unavailable', () => {
            const originalSetItem = Storage.prototype.setItem;
            Storage.prototype.setItem = vi.fn(() => {
                throw new Error('QuotaExceededError');
            });

            expect(storageService.set('test-key', {})).toBe(false);

            Storage.prototype.setItem = originalSetItem;
        });
    });

    describe('remove()', () => {
        it('should remove items from localStorage', () => {
            storageService.set('test-key', { data: 'value' });
            expect(storageService.get('test-key')).not.toBeNull();

            storageService.remove('test-key');
            expect(storageService.get('test-key')).toBeNull();
        });

        it('should return false when localStorage is unavailable', () => {
            const originalRemoveItem = Storage.prototype.removeItem;
            Storage.prototype.removeItem = vi.fn(() => {
                throw new Error('Storage unavailable');
            });

            expect(storageService.remove('test-key')).toBe(false);

            Storage.prototype.removeItem = originalRemoveItem;
        });
    });

    describe('clear()', () => {
        it('should clear all mortgage calculator data', () => {
            storageService.saveScenarios([{ principal: 500000 }]);
            storageService.savePreferences({ theme: 'dark' });
            storageService.saveCurrent({ principal: 300000 });

            storageService.clear();

            expect(storageService.getScenarios()).toEqual([]);
            expect(storageService.getPreferences().theme).toBe('system');
            expect(storageService.getCurrent()).toBeNull();
        });
    });

    describe('Domain-specific methods', () => {
        describe('saveScenarios() and getScenarios()', () => {
            it('should save and retrieve scenarios', () => {
                const scenarios = [
                    { principal: 500000, interestRate: 5.25 },
                    { principal: 300000, interestRate: 4.5 },
                ];

                storageService.saveScenarios(scenarios);
                expect(storageService.getScenarios()).toEqual(scenarios);
            });

            it('should return empty array when no scenarios exist', () => {
                expect(storageService.getScenarios()).toEqual([]);
            });
        });

        describe('saveComparisons() and getComparisons()', () => {
            it('should save and retrieve comparisons', () => {
                const comparisons = [{ id: 1, name: 'Scenario 1' }];
                storageService.saveComparisons(comparisons);

                expect(storageService.getComparisons()).toEqual(comparisons);
            });

            it('should return empty array when no comparisons exist', () => {
                expect(storageService.getComparisons()).toEqual([]);
            });
        });

        describe('savePreferences() and getPreferences()', () => {
            it('should save and retrieve preferences', () => {
                const preferences = {
                    theme: 'dark',
                    locale: 'en-CA',
                    defaultPaymentFrequency: 'weekly',
                    showAdvancedOptions: true,
                };

                storageService.savePreferences(preferences);
                const retrieved = storageService.getPreferences();

                expect(retrieved.theme).toBe('dark');
                expect(retrieved.locale).toBe('en-CA');
                expect(retrieved.defaultPaymentFrequency).toBe('weekly');
                expect(retrieved.showAdvancedOptions).toBe(true);
            });

            it('should return default preferences when none exist', () => {
                const defaults = storageService.getPreferences();

                expect(defaults).toEqual({
                    theme: 'system',
                    locale: 'en-CA',
                    defaultPaymentFrequency: 'monthly',
                    showAdvancedOptions: false,
                });
            });

            it('should return stored preferences when partial preferences exist', () => {
                storageService.set(storageService.keys.PREFERENCES, { theme: 'dark' });
                const retrieved = storageService.getPreferences();

                expect(retrieved.theme).toBe('dark');
                // getPreferences returns stored object directly if it exists, not merged
                // So if only theme is stored, that's what we get back
                expect(typeof retrieved).toBe('object');
            });
        });

        describe('saveCurrent() and getCurrent()', () => {
            it('should save and retrieve current scenario', () => {
                const scenario = {
                    principal: 500000,
                    interestRate: 5.25,
                    amortizationMonths: 300,
                };

                storageService.saveCurrent(scenario);
                expect(storageService.getCurrent()).toEqual(scenario);
            });

            it('should return null when no current scenario exists', () => {
                expect(storageService.getCurrent()).toBeNull();
            });
        });
    });
});
