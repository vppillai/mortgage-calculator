/**
 * Prepayment Calculator Service
 * Calculates mortgage with extra payments
 */

import { decimal, add, subtract, multiply, divide, power, round } from '../utils/decimal-wrapper.js';
import { MORTGAGE_CONSTANTS } from '../utils/constants.js';
import { calculateMortgage } from './mortgageCalculator.js';

export function calculateWithPrepayment(params) {
    const { principal, interestRate, amortizationMonths, paymentFrequency, extraPayment, extraPaymentFrequency } = params;

    // Get base calculation
    const baseCalc = calculateMortgage({ principal, interestRate, amortizationMonths, paymentFrequency });

    // Setup for amortization with prepayment
    const annualRate = divide(interestRate, 100);
    const semiAnnualRate = divide(annualRate, 2);
    const onePlusSemi = add(1, semiAnnualRate);
    const effectiveAnnual = subtract(power(onePlusSemi, 2), 1);

    const paymentsPerYear = MORTGAGE_CONSTANTS.PAYMENTS_PER_YEAR[paymentFrequency];
    const onePlusAnnual = add(1, effectiveAnnual);
    const periodRate = subtract(power(onePlusAnnual, divide(1, paymentsPerYear)), 1);

    let balance = decimal(principal);
    const regularPayment = decimal(baseCalc.regularPayment);
    let paymentCount = 0;
    let totalInterestPaid = decimal(0);
    const maxPayments = 10000; // Safety limit

    while (balance.greaterThan(0) && paymentCount < maxPayments) {
        paymentCount++;

        // Calculate interest for this period
        const interestPayment = multiply(balance, periodRate);
        totalInterestPaid = add(totalInterestPaid, interestPayment);

        // Principal portion
        let principalPayment = subtract(regularPayment, interestPayment);

        // Add extra payment
        let extra = decimal(0);
        if (extraPaymentFrequency === 'per-payment') {
            extra = decimal(extraPayment);
        } else if (extraPaymentFrequency === 'annual' && paymentCount % paymentsPerYear === 0) {
            extra = decimal(extraPayment);
        } else if (extraPaymentFrequency === 'one-time' && paymentCount === 1) {
            extra = decimal(extraPayment);
        }

        principalPayment = add(principalPayment, extra);

        // Don't overpay
        if (principalPayment.greaterThan(balance)) {
            principalPayment = balance;
        }

        balance = subtract(balance, principalPayment);
    }

    const actualPayoffMonths = Math.ceil((paymentCount / paymentsPerYear) * 12);
    const totalInterestSaved = subtract(baseCalc.totalInterest, totalInterestPaid);
    const monthsSaved = amortizationMonths - actualPayoffMonths;

    return {
        actualPayoffMonths,
        totalInterestSaved: round(totalInterestSaved, 2),
        monthsSaved,
        totalCostWithPrepayment: round(add(principal, totalInterestPaid), 2),
        originalTotalCost: baseCalc.totalCost,
        savingsPercentage: round(divide(totalInterestSaved, baseCalc.totalInterest).times(100), 2),
    };
}

