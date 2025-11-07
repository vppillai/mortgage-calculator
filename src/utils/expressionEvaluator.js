/**
 * Safe mathematical expression evaluator
 * Supports +, -, *, /, () and numbers
 * Uses mathjs for secure evaluation
 */

import { evaluate } from 'mathjs';
import { UI_CONSTANTS } from './constants.js';

/**
 * Evaluate a mathematical expression safely
 * @param {string} expr - Mathematical expression to evaluate
 * @returns {number|null} - Evaluated result or null if invalid
 */
export function evaluateExpression(expr) {
    // Remove whitespace
    expr = expr.replace(/\s/g, '');

    // More strict validation - only allow numbers, operators, and parentheses
    if (!/^[0-9+\-*/().,]+$/.test(expr) || expr.length > UI_CONSTANTS.MAX_EXPRESSION_LENGTH) {
        return null;
    }

    // Replace commas with empty string (for thousand separators)
    expr = expr.replace(/,/g, '');

    try {
        // Use mathjs which is safer than Function() constructor
        const result = evaluate(expr);

        // Check if result is a valid number
        if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
            return Math.round(result * 100) / 100; // Round to 2 decimal places
        }

        return null;
    } catch (e) {
        return null;
    }
}

export function isExpression(str) {
    // Check if string contains any math operators
    return /[+\-*/()]/.test(str);
}
