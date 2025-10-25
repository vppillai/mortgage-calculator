/**
 * CAD currency formatting utilities
 */

const CAD_FORMATTER = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export function formatCAD(value) {
    if (value === null || value === undefined || isNaN(value)) {
        return '$0.00';
    }
    return CAD_FORMATTER.format(value);
}

export function parseCAD(value) {
    if (!value) return 0;
    const cleaned = value.toString().replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
}

export default { formatCAD, parseCAD };

