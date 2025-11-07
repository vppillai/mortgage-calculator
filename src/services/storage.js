/**
 * LocalStorage service for persisting mortgage scenarios and preferences
 */

import { MORTGAGE_CONSTANTS } from '../utils/constants.js';

class StorageService {
    constructor() {
        this.keys = MORTGAGE_CONSTANTS.STORAGE_KEYS;
        this._available = null; // Cache availability check
        this._readOnly = false; // Track if we're in read-only mode
        this._quotaExceeded = false; // Track quota exceeded state
    }

    /**
     * Check if localStorage is available
     * @returns {boolean}
     */
    isAvailable() {
        if (this._available !== null) {
            return this._available;
        }

        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            this._available = true;
            this._readOnly = false;
            return true;
        } catch (e) {
            // Check if it's a quota exceeded error (read-only mode)
            if (e.name === 'QuotaExceededError' || e.code === 22) {
                this._quotaExceeded = true;
                this._readOnly = true;
                this._available = true; // Available but full
            } else {
                this._available = false;
                this._readOnly = true;
            }
            return false;
        }
    }

    /**
     * Check if storage is in read-only mode (available but can't write)
     * @returns {boolean}
     */
    isReadOnly() {
        if (this._available === null) {
            this.isAvailable(); // Initialize availability check
        }
        return this._readOnly;
    }

    /**
     * Check if quota is exceeded
     * @returns {boolean}
     */
    isQuotaExceeded() {
        return this._quotaExceeded;
    }

    /**
     * Reset availability cache (useful for testing)
     */
    resetCache() {
        this._available = null;
        this._readOnly = false;
        this._quotaExceeded = false;
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
        if (!this.isAvailable()) {
            // If storage is not available, app should continue in read-only mode
            console.warn('localStorage not available - running in read-only mode');
            return false;
        }

        if (this.isReadOnly()) {
            console.warn('localStorage is read-only - cannot save data');
            return false;
        }

        try {
            localStorage.setItem(key, JSON.stringify(value));
            // Reset quota exceeded flag on successful write
            if (this._quotaExceeded) {
                this._quotaExceeded = false;
                this._readOnly = false;
            }
            return true;
        } catch (error) {
            // Handle quota exceeded
            if (error.name === 'QuotaExceededError' || error.code === 22) {
                this._quotaExceeded = true;
                this._readOnly = true;
                console.warn('localStorage quota exceeded - switching to read-only mode');
            } else {
                console.error(`Error writing to localStorage: ${key}`, error);
            }
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
