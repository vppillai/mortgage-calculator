/**
 * Safe mathematical expression evaluator
 * Supports +, -, *, /, () and numbers
 */

export function evaluateExpression(expr) {
    // Remove whitespace
    expr = expr.replace(/\s/g, '');

    // Validate expression contains only allowed characters
    if (!/^[0-9+\-*/().,]+$/.test(expr)) {
        return null;
    }

    // Replace commas with empty string (for thousand separators)
    expr = expr.replace(/,/g, '');

    try {
        // Create a safe evaluation context
        // This is safe because we've validated the input contains only math operators
        const result = Function('"use strict"; return (' + expr + ')')();

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
