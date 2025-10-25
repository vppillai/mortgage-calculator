/**
 * LocalStorage service for persisting mortgage scenarios and preferences
 */

import { MORTGAGE_CONSTANTS } from '../utils/constants.js';

class StorageService {
    constructor() {
        this.keys = MORTGAGE_CONSTANTS.STORAGE_KEYS;
    }

    /**
     * Check if localStorage is available
     * @returns {boolean}
     */
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Get item from localStorage
     * @param {string} key
     * @returns {any|null}
     */
    get(key) {
        if (!this.isAvailable()) return null;

        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading from localStorage: ${key}`, error);
            return null;
        }
    }

    /**
     * Set item in localStorage
     * @param {string} key
     * @param {any} value
     * @returns {boolean} Success status
     */
    set(key, value) {
        if (!this.isAvailable()) return false;

        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error writing to localStorage: ${key}`, error);
            return false;
        }
    }

    /**
     * Remove item from localStorage
     * @param {string} key
     * @returns {boolean}
     */
    remove(key) {
        if (!this.isAvailable()) return false;

        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing from localStorage: ${key}`, error);
            return false;
        }
    }

    /**
     * Clear all mortgage calculator data
     */
    clear() {
        if (!this.isAvailable()) return;

        Object.values(this.keys).forEach((key) => {
            this.remove(key);
        });
    }

    // Domain-specific methods

    /**
     * Save mortgage scenarios
     * @param {Array} scenarios
     */
    saveScenarios(scenarios) {
        return this.set(this.keys.SCENARIOS, scenarios);
    }

    /**
     * Get saved scenarios
     * @returns {Array}
     */
    getScenarios() {
        return this.get(this.keys.SCENARIOS) || [];
    }

    /**
     * Save comparison tables
     * @param {Array} comparisons
     */
    saveComparisons(comparisons) {
        return this.set(this.keys.COMPARISONS, comparisons);
    }

    /**
     * Get saved comparisons
     * @returns {Array}
     */
    getComparisons() {
        return this.get(this.keys.COMPARISONS) || [];
    }

    /**
     * Save user preferences
     * @param {Object} preferences
     */
    savePreferences(preferences) {
        return this.set(this.keys.PREFERENCES, preferences);
    }

    /**
     * Get user preferences
     * @returns {Object}
     */
    getPreferences() {
        return (
            this.get(this.keys.PREFERENCES) || {
                theme: 'system',
                locale: 'en-CA',
                defaultPaymentFrequency: 'monthly',
                showAdvancedOptions: false,
            }
        );
    }

    /**
     * Save current working scenario
     * @param {Object} scenario
     */
    saveCurrent(scenario) {
        return this.set(this.keys.CURRENT, scenario);
    }

    /**
     * Get current working scenario
     * @returns {Object|null}
     */
    getCurrent() {
        return this.get(this.keys.CURRENT);
    }
}

export default new StorageService();

