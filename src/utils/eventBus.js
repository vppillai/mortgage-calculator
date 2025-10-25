/**
 * Event Bus for component communication
 * Simple pub/sub pattern for decoupled components
 */

class EventBus {
    constructor() {
        this.events = {};
    }

    /**
     * Subscribe to an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event].push(callback);

        // Return unsubscribe function
        return () => {
            this.events[event] = this.events[event].filter((cb) => cb !== callback);
        };
    }

    /**
     * Subscribe to an event once
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    once(event, callback) {
        const onceCallback = (...args) => {
            callback(...args);
            this.off(event, onceCallback);
        };

        this.on(event, onceCallback);
    }

    /**
     * Unsubscribe from an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event, callback) {
        if (!this.events[event]) return;

        this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
        if (!this.events[event]) return;

        this.events[event].forEach((callback) => {
            try {
                callback(data);
            } catch (error) {
                console.error(`Error in event handler for ${event}:`, error);
            }
        });
    }

    /**
     * Clear all event listeners
     */
    clear() {
        this.events = {};
    }

    /**
     * Get all subscribers for an event
     * @param {string} event
     * @returns {number}
     */
    listenerCount(event) {
        return this.events[event] ? this.events[event].length : 0;
    }
}

// Event names as constants
export const EVENTS = {
    CALCULATION_COMPLETE: 'calculation:complete', // Used by CalculatorModern
    THEME_CHANGED: 'theme:changed',
    ERROR_OCCURRED: 'error:occurred',
    NOTIFICATION: 'notification:show',
};

export default new EventBus();

