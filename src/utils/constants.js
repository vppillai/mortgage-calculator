/**
 * Canadian Mortgage Calculator Constants
 * These constants define Canadian mortgage rules and regulations
 */

export const MORTGAGE_CONSTANTS = {
    // Amortization limits
    MAX_AMORTIZATION_HIGH_RATIO: 300, // 25 years in months (LTV > 80%)
    MAX_AMORTIZATION_CONVENTIONAL: 360, // 30 years in months (LTV <= 80%)
    MIN_AMORTIZATION: 12, // 1 year minimum

    // Interest rate limits
    MIN_INTEREST_RATE: 0.01, // 0.01%
    MAX_INTEREST_RATE: 30.0, // 30%

    // Principal limits
    MIN_PRINCIPAL: 1000, // $1,000 CAD minimum
    MAX_PRINCIPAL: 10000000, // $10M CAD

    // Down payment requirements (by property value)
    MIN_DOWN_PAYMENT_UNDER_500K: 0.05, // 5% for first $500k
    MIN_DOWN_PAYMENT_500K_TO_1M: 0.10, // 10% for $500k-$1M
    MIN_DOWN_PAYMENT_OVER_1M: 0.20, // 20% for over $1M

    // Payment frequencies
    PAYMENT_FREQUENCIES: {
        MONTHLY: 'monthly',
        BI_WEEKLY: 'bi-weekly',
        WEEKLY: 'weekly',
    },

    // Payments per year by frequency
    PAYMENTS_PER_YEAR: {
        monthly: 12,
        'bi-weekly': 26,
        weekly: 52,
    },

    // Canadian compounding
    COMPOUNDING_PERIODS_PER_YEAR: 2, // Semi-annual compounding

    // Prepayment frequencies
    PREPAYMENT_FREQUENCIES: {
        PER_PAYMENT: 'per-payment',
        ANNUAL: 'annual',
        ONE_TIME: 'one-time',
    },

    // UI Constants
    MAX_COMPARISON_SCENARIOS: 5,
    DEFAULT_PAYMENT_FREQUENCY: 'monthly',

    // Storage keys
    STORAGE_KEYS: {
        SCENARIOS: 'mortgage-calc-scenarios',
        COMPARISONS: 'mortgage-calc-comparisons',
        PREFERENCES: 'mortgage-calc-preferences',
        CURRENT: 'mortgage-calc-current',
    },

    // Error codes
    ERROR_CODES: {
        INVALID_PRINCIPAL: 'INVALID_PRINCIPAL',
        INVALID_RATE: 'INVALID_RATE',
        INVALID_TERM: 'INVALID_TERM',
        CALCULATION_ERROR: 'CALCULATION_ERROR',
        COMPARISON_FULL: 'COMPARISON_FULL',
        STORAGE_ERROR: 'STORAGE_ERROR',
    },
};

// UI-specific constants
export const UI_CONSTANTS = {
    // Debounce and timing
    DEBOUNCE_DELAY: 500, // Increased from 300ms for better UX
    NOTIFICATION_SPACING: 76,
    NOTIFICATION_DURATION: 2700,

    // Limits
    MAX_SCENARIOS: 50,
    MAX_EXPRESSION_LENGTH: 100,

    // Virtual scrolling (for amortization schedule)
    ROW_HEIGHT: 40,
    VISIBLE_ROWS: 15,

    // Screenshot options
    SCREENSHOT_SCALE_MOBILE: 1,
    SCREENSHOT_SCALE_DESKTOP: 2,
    SCREENSHOT_TIMEOUT: 15000,
};

export default MORTGAGE_CONSTANTS;
