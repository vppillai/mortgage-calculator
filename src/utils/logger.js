/**
 * Logging service for debugging and monitoring
 */

const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
};

class Logger {
    constructor() {
        this.level = process.env.NODE_ENV === 'production' ? LOG_LEVELS.WARN : LOG_LEVELS.DEBUG;
        this.logs = [];
        this.maxLogs = 100;
    }

    /**
     * Set logging level
     * @param {string} level - DEBUG, INFO, WARN, or ERROR
     */
    setLevel(level) {
        this.level = LOG_LEVELS[level] || LOG_LEVELS.INFO;
    }

    /**
     * Log debug message
     * @param {string} message
     * @param {*} data
     */
    debug(message, data) {
        if (this.level <= LOG_LEVELS.DEBUG) {
            console.debug(`[DEBUG] ${message}`, data || '');
            this.addLog('DEBUG', message, data);
        }
    }

    /**
     * Log info message
     * @param {string} message
     * @param {*} data
     */
    info(message, data) {
        if (this.level <= LOG_LEVELS.INFO) {
            console.log(`[INFO] ${message}`, data || '');
            this.addLog('INFO', message, data);
        }
    }

    /**
     * Log warning
     * @param {string} message
     * @param {*} data
     */
    warn(message, data) {
        if (this.level <= LOG_LEVELS.WARN) {
            console.warn(`[WARN] ${message}`, data || '');
            this.addLog('WARN', message, data);
        }
    }

    /**
     * Log error
     * @param {string} message
     * @param {Error|*} error
     */
    error(message, error) {
        if (this.level <= LOG_LEVELS.ERROR) {
            console.error(`[ERROR] ${message}`, error || '');
            this.addLog('ERROR', message, error);
        }
    }

    /**
     * Add log entry to history
     * @private
     */
    addLog(level, message, data) {
        this.logs.push({
            level,
            message,
            data,
            timestamp: new Date().toISOString(),
        });

        // Keep only recent logs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    }

    /**
     * Get all logs
     * @returns {Array}
     */
    getLogs() {
        return [...this.logs];
    }

    /**
     * Clear all logs
     */
    clearLogs() {
        this.logs = [];
    }

    /**
     * Export logs as JSON
     * @returns {string}
     */
    exportLogs() {
        return JSON.stringify(this.logs, null, 2);
    }
}

export default new Logger();

