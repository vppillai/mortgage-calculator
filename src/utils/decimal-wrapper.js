/**
 * Decimal.js wrapper for precise financial calculations
 * Prevents floating-point arithmetic errors
 */

import Decimal from 'decimal.js';

// Configure Decimal.js for financial calculations
Decimal.set({
    precision: 20,
    rounding: Decimal.ROUND_HALF_UP,
    toExpNeg: -7,
    toExpPos: 21,
    minE: -9e15,
    maxE: 9e15,
});

/**
 * Creates a Decimal instance from a number or string
 * @param {number|string} value - The value to convert
 * @returns {Decimal} Decimal instance
 */
export function decimal(value) {
    return new Decimal(value);
}

/**
 * Adds two numbers with precision
 * @param {number|string|Decimal} a
 * @param {number|string|Decimal} b
 * @returns {Decimal}
 */
export function add(a, b) {
    return decimal(a).plus(decimal(b));
}

/**
 * Subtracts b from a with precision
 * @param {number|string|Decimal} a
 * @param {number|string|Decimal} b
 * @returns {Decimal}
 */
export function subtract(a, b) {
    return decimal(a).minus(decimal(b));
}

/**
 * Multiplies two numbers with precision
 * @param {number|string|Decimal} a
 * @param {number|string|Decimal} b
 * @returns {Decimal}
 */
export function multiply(a, b) {
    return decimal(a).times(decimal(b));
}

/**
 * Divides a by b with precision
 * @param {number|string|Decimal} a
 * @param {number|string|Decimal} b
 * @returns {Decimal}
 */
export function divide(a, b) {
    return decimal(a).dividedBy(decimal(b));
}

/**
 * Raises a to the power of b with precision
 * @param {number|string|Decimal} a - Base
 * @param {number|string|Decimal} b - Exponent
 * @returns {Decimal}
 */
export function power(a, b) {
    return decimal(a).pow(decimal(b));
}

/**
 * Rounds a number to specified decimal places
 * @param {number|string|Decimal} value
 * @param {number} decimalPlaces
 * @returns {number}
 */
export function round(value, decimalPlaces = 2) {
    return decimal(value).toDecimalPlaces(decimalPlaces).toNumber();
}

/**
 * Converts Decimal to number
 * @param {Decimal} value
 * @returns {number}
 */
export function toNumber(value) {
    return value.toNumber();
}

/**
 * Formats a number as currency (CAD)
 * @param {number|string|Decimal} value
 * @returns {string}
 */
export function toCurrency(value) {
    const num = decimal(value).toNumber();
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num);
}

export default {
    decimal,
    add,
    subtract,
    multiply,
    divide,
    power,
    round,
    toNumber,
    toCurrency,
    Decimal,
};

