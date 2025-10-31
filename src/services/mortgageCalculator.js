/**
 * Mortgage Calculator Service
 * Implements Canadian mortgage calculations with semi-annual compounding
 */

import { decimal, add, subtract, multiply, divide, power, round } from '../utils/decimal-wrapper.js';
import { MORTGAGE_CONSTANTS } from '../utils/constants.js';
import { CalculationError } from '../utils/errors.js';

/**
 * Calculate mortgage payment using Canadian PMT formula
 * @param {Object} params - Mortgage parameters
 * @returns {Object} Calculation results
 */
export function calculateMortgage(params) {
    try {
        const { principal, interestRate, amortizationMonths, paymentFrequency } = params;

        // Convert annual rate to decimal
        const annualRate = divide(interestRate, 100);

        // Canadian semi-annual compounding
        const semiAnnualRate = divide(annualRate, 2);

        // Determine payments per year
        const paymentsPerYear = MORTGAGE_CONSTANTS.PAYMENTS_PER_YEAR[paymentFrequency];

        // Convert semi-annual rate to effective annual rate
        // effectiveAnnual = (1 + semiAnnualRate)^2 - 1
        const onePlusSemi = add(1, semiAnnualRate);
        const effectiveAnnual = subtract(power(onePlusSemi, 2), 1);

        // Convert effective annual rate to payment period rate
        // periodRate = (1 + effectiveAnnual)^(1/paymentsPerYear) - 1
        const onePlusAnnual = add(1, effectiveAnnual);
        const periodRate = subtract(power(onePlusAnnual, divide(1, paymentsPerYear)), 1);

        // Total number of payments
        const totalPayments = multiply(amortizationMonths, divide(paymentsPerYear, 12));

        // PMT formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
        const onePlusR = add(1, periodRate);
        const onePlusRPowN = power(onePlusR, totalPayments);

        const numerator = multiply(periodRate, onePlusRPowN);
        const denominator = subtract(onePlusRPowN, 1);

        const payment = multiply(principal, divide(numerator, denominator));

        // Calculate totals
        const totalPaid = multiply(payment, totalPayments);
        const totalInterest = subtract(totalPaid, principal);

        // Calculate payoff date (approximate)
        const today = new Date();
        const payoffDate = new Date(today);
        payoffDate.setMonth(payoffDate.getMonth() + parseInt(amortizationMonths));

        return {
            regularPayment: round(payment, 2),
            totalPayments: round(totalPayments, 0),
            totalInterest: round(totalInterest, 2),
            totalCost: round(totalPaid, 2),
            payoffDate: payoffDate.toISOString().split('T')[0],
            effectiveRate: round(periodRate, 6),
        };
    } catch (error) {
        throw new CalculationError(`Failed to calculate mortgage: ${error.message}`);
    }
}

/**
 * Generate amortization schedule
 * @param {Object} params - Mortgage parameters
 * @returns {Array} Payment schedule
 */
export function generateAmortizationSchedule(params) {
    // eslint-disable-next-line no-unused-vars
    const { principal, interestRate, amortizationMonths, paymentFrequency } = params;

    const result = calculateMortgage(params);
    const payment = decimal(result.regularPayment);

    const schedule = [];
    let balance = decimal(principal);

    const annualRate = divide(interestRate, 100);
    const semiAnnualRate = divide(annualRate, 2);
    const onePlusSemi = add(1, semiAnnualRate);
    const effectiveAnnual = subtract(power(onePlusSemi, 2), 1);

    const paymentsPerYear = MORTGAGE_CONSTANTS.PAYMENTS_PER_YEAR[paymentFrequency];
    const onePlusAnnual = add(1, effectiveAnnual);
    const periodRate = subtract(power(onePlusAnnual, divide(1, paymentsPerYear)), 1);

    const totalPayments = Math.ceil(result.totalPayments);
    const today = new Date();

    for (let i = 1; i <= totalPayments; i++) {
        const interestPayment = multiply(balance, periodRate);
        const principalPayment = subtract(payment, interestPayment);

        balance = subtract(balance, principalPayment);

        // Prevent negative balance on last payment
        if (balance.lessThan(0)) {
            balance = decimal(0);
        }

        const paymentDate = new Date(today);
        const monthsElapsed = Math.floor((i * 12) / paymentsPerYear);
        paymentDate.setMonth(paymentDate.getMonth() + monthsElapsed);

        schedule.push({
            paymentNumber: i,
            paymentDate: paymentDate.toISOString().split('T')[0],
            principalPayment: round(principalPayment, 2),
            interestPayment: round(interestPayment, 2),
            totalPayment: round(payment, 2),
            remainingBalance: round(balance, 2),
        });

        if (balance.equals(0)) break;
    }

    return schedule;
}

export default {
    calculateMortgage,
    generateAmortizationSchedule,
};

