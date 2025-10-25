/**
 * URL Share Service
 * Handles encoding/decoding of mortgage scenarios for URL sharing
 */

/**
 * Compress and encode scenarios data for URL
 * @param {Array} scenarios - Array of scenario objects
 * @returns {string} - Encoded string for URL parameter
 */
export function encodeScenarios(scenarios) {
    if (!scenarios || scenarios.length === 0) {
        return '';
    }

    try {
        // Compact encoding to minimize URL length
        // Format: principal|rate|months|freq|extra|extrafreq;...
        const compactData = scenarios.map(s => {
            const parts = [
                s.principal, // principal (keep full accuracy)
                Math.round(s.interestRate * 100), // rate as integer (4.05 -> 405)
                s.amortizationMonths, // months
                s.paymentFrequency.charAt(0), // w/b/m
                s.extraPaymentAmount || 0, // extra payment
            ];

            // Only add extra frequency if not default
            if (s.extraPaymentFrequency !== 'per-payment') {
                parts.push(s.extraPaymentFrequency === 'annual' ? 'a' : 'o');
            }

            return parts.join('|');
        }).join(';');

        // Simple base64 encoding without JSON overhead
        const encoded = btoa(compactData)
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        return encoded;
    } catch (error) {
        console.error('Error encoding scenarios:', error);
        return '';
    }
}

/**
 * Decode scenarios data from URL
 * @param {string} encoded - Encoded string from URL parameter
 * @returns {Array} - Array of scenario objects
 */
export function decodeScenarios(encoded) {
    if (!encoded) {
        return [];
    }

    try {
        // Restore base64 padding and convert from URL-safe format
        const base64 = encoded
            .replace(/-/g, '+')
            .replace(/_/g, '/')
            + '=='.substring(0, (4 - encoded.length % 4) % 4);

        // Decode the compact format
        const compactData = atob(base64);
        const scenarios = compactData.split(';');

        // Reconstruct full scenario objects from compact data
        return scenarios.map(scenarioStr => {
            const parts = scenarioStr.split('|');
            return {
                principal: parseFloat(parts[0]), // direct value
                interestRate: parseFloat(parts[1]) / 100, // convert back from integer
                amortizationMonths: parseInt(parts[2]),
                paymentFrequency: parts[3] === 'w' ? 'weekly' :
                    parts[3] === 'b' ? 'bi-weekly' : 'monthly',
                extraPaymentAmount: parseFloat(parts[4]) || 0,
                extraPaymentFrequency: parts[5] === 'a' ? 'annual' :
                    parts[5] === 'o' ? 'one-time' : 'per-payment'
            };
        });
    } catch (error) {
        console.error('Error decoding scenarios:', error);
        return [];
    }
}

/**
 * Generate a shareable URL with encoded scenarios
 * @param {Array} scenarios - Array of scenario objects
 * @returns {string} - Full shareable URL
 */
export function generateShareableUrl(scenarios) {
    const encoded = encodeScenarios(scenarios);
    if (!encoded) {
        return window.location.href.split('?')[0];
    }

    // Use the current URL without query parameters as base
    const baseUrl = window.location.href.split('?')[0];
    return `${baseUrl}?s=${encoded}`;
}

/**
 * Parse scenarios from current URL
 * @returns {Array} - Array of scenario objects or empty array
 */
export function parseScenariosFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const encoded = urlParams.get('s');
    return decodeScenarios(encoded);
}

/**
 * Clean the URL by removing the encoded data parameter
 */
export function cleanUrl() {
    const url = new URL(window.location);
    url.searchParams.delete('s');
    window.history.replaceState({}, document.title, url.pathname);
}

/**
 * Copy text to clipboard with fallback
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} - Success status
 */
export async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}
