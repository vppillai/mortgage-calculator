/**
 * Modern Calculator Component
 * Single-page, real-time mortgage calculator with all features visible
 */

import { calculateMortgage } from '../services/mortgageCalculator.js';
import { calculateWithPrepayment } from '../services/prepaymentCalculator.js';
import { validateMortgageInputs } from '../services/validation.js';
import { formatCAD } from '../services/currencyFormatter.js';
import eventBus, { EVENTS } from '../utils/eventBus.js';
import logger from '../utils/logger.js';
import { MORTGAGE_CONSTANTS } from '../utils/constants.js';
import { evaluateExpression, isExpression } from '../utils/expressionEvaluator.js';
import {
    generateShareableUrl,
    parseScenariosFromUrl,
    cleanUrl,
    copyToClipboard
} from '../services/urlShareService.js';

export class CalculatorModern {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with id '${containerId}' not found`);
            return;
        }

        this.state = {
            principal: 298000,
            interestRate: 4.05,
            amortizationMonths: 360,
            paymentFrequency: 'weekly',
            targetPayment: null,
            extraPaymentAmount: 0,
            extraPaymentFrequency: 'per-payment',
        };

        this.result = null;
        this.prepaymentResult = null;
        this.scenarios = [];

        // Check for shared scenarios in URL
        this.loadSharedScenarios();

        this.render();
        this.attachEventListeners();
        this.calculateAll(); // Calculate on load
    }

    render() {
        this.container.innerHTML = `
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          
          <!-- Main Calculator Panel -->
          <div class="lg:col-span-5">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
              <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Prepayment Calculator
              </h2>
              
              <div class="space-y-4">
                <!-- Loan Amount -->
                <div>
                  <label for="principal" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Loan Amount
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" aria-hidden="true">$</span>
                    <input
                      type="number"
                      id="principal"
                      name="principal"
                      value="${this.state.principal}"
                      min="1000"
                      max="${MORTGAGE_CONSTANTS.MAX_PRINCIPAL}"
                      step="1000"
                      aria-describedby="principal-help principal-error"
                      aria-invalid="false"
                      aria-label="Loan amount in dollars"
                      class="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <p id="principal-help" class="sr-only">Enter the total loan amount between $1,000 and ${formatCAD(MORTGAGE_CONSTANTS.MAX_PRINCIPAL)}</p>
                  <p id="principal-error" class="text-xs text-red-600 dark:text-red-400 mt-1 hidden" role="alert" aria-live="polite"></p>
                </div>

                <!-- Interest Rate & Amortization -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label for="interestRate" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Interest Rate
                    </label>
                    <div class="relative">
                      <input
                        type="number"
                        id="interestRate"
                        name="interestRate"
                        value="${this.state.interestRate}"
                        min="0.01"
                        max="30"
                        step="0.01"
                        aria-describedby="interest-help interest-error"
                        aria-invalid="false"
                        aria-label="Annual interest rate percentage"
                        class="w-full pr-8 pl-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                      <span class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" aria-hidden="true">%</span>
                    </div>
                    <p id="interest-help" class="sr-only">Enter annual interest rate between 0.01% and 30%</p>
                    <p id="interest-error" class="text-xs text-red-600 dark:text-red-400 mt-1 hidden" role="alert" aria-live="polite"></p>
                  </div>
                  
                  <div>
                    <label for="amortizationYears" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Amortization <span class="text-xs font-normal text-gray-500">(years)</span>
                    </label>
                    <input
                      type="number"
                      id="amortizationYears"
                      name="amortizationYears"
                      value="${this.state.amortizationMonths / 12}"
                      min="1"
                      max="30"
                      step="1"
                      placeholder="Years"
                      aria-describedby="amortization-help amortization-error"
                      aria-invalid="false"
                      aria-label="Amortization period in years"
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                    <p id="amortization-help" class="sr-only">Enter amortization period between 1 and 30 years</p>
                    <p id="amortization-error" class="text-xs text-red-600 dark:text-red-400 mt-1 hidden" role="alert" aria-live="polite"></p>
                  </div>
                </div>

                <!-- Payment Frequency -->
                <div>
                  <label for="paymentFrequency" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Payment Frequency
                  </label>
                  <select 
                    id="paymentFrequency"
                    name="paymentFrequency"
                    aria-describedby="frequency-help"
                    aria-label="Payment frequency"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="weekly" ${this.state.paymentFrequency === 'weekly' ? 'selected' : ''}>Weekly (52/year)</option>
                    <option value="bi-weekly" ${this.state.paymentFrequency === 'bi-weekly' ? 'selected' : ''}>Bi-weekly (26/year)</option>
                    <option value="monthly" ${this.state.paymentFrequency === 'monthly' ? 'selected' : ''}>Monthly (12/year)</option>
                  </select>
                  <p id="frequency-help" class="sr-only">Select how often you will make payments</p>
                </div>

                <!-- Divider -->
                <div class="border-t border-gray-200 dark:border-gray-700 my-4" role="separator" aria-label="Prepayment options section"></div>
                
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white" id="prepayment-heading">Prepayment Options</h3>

                <!-- Extra Payment -->
                <div>
                  <label for="extraPayment" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Extra Payment Amount
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" aria-hidden="true">$</span>
                    <input
                      type="text"
                      id="extraPayment"
                      name="extraPayment"
                      value="${this.state.extraPaymentAmount || ''}"
                      placeholder="e.g., 100 or (1200/12)+50"
                      aria-describedby="extra-help extra-error extra-warning"
                      aria-invalid="false"
                      aria-label="Extra payment amount or mathematical expression"
                      class="w-full pl-8 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <p id="extra-help" class="text-xs text-gray-500 mt-1">Enter amount or expression (e.g., 1200/12 or 50+25). Press Enter to calculate.</p>
                  <p id="extra-error" class="text-xs text-red-600 dark:text-red-400 mt-1 hidden" role="alert" aria-live="polite"></p>
                  <p id="extra-warning" class="text-xs text-yellow-600 dark:text-yellow-400 mt-1 hidden" role="alert" aria-live="polite"></p>
                  ${this.state.extraPaymentAmount < 0 ?
                '<p class="text-xs text-red-600 dark:text-red-400 mt-1" id="extra-error-display" role="alert">Amount must be positive</p>' :
                this.state.extraPaymentAmount > this.result?.regularPayment * 2 ?
                    '<p class="text-xs text-yellow-600 dark:text-yellow-400 mt-1" id="extra-warning-display" role="alert">Warning: Extra payment is very high</p>' :
                    ''}
                </div>

                <!-- Extra Payment Type -->
                <div>
                  <label for="extraPaymentFrequency" class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                    Extra Payment Type
                  </label>
                  <select 
                    id="extraPaymentFrequency"
                    name="extraPaymentFrequency"
                    aria-describedby="extra-type-help"
                    aria-label="How often to apply extra payment"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="per-payment">Each Payment</option>
                    <option value="annual">Annual Lump Sum</option>
                    <option value="one-time">One-time Payment</option>
                  </select>
                  <p id="extra-type-help" class="sr-only">Select when to apply the extra payment</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Results Panel -->
          <div class="lg:col-span-7">
            <div class="space-y-6">
              <!-- Base Mortgage -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
                <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white">Base Mortgage</h3>
                <div id="base-mortgage-results" role="region" aria-live="polite" aria-atomic="true">
                  ${this.renderMainResults()}
                </div>
                <div id="calculation-loading" class="hidden text-center py-4">
                  <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" role="status" aria-label="Calculating">
                    <span class="sr-only">Calculating...</span>
                  </div>
                  <p class="text-sm text-gray-500 mt-2">Calculating...</p>
                </div>
              </div>

              <!-- Prepayment Impact Section -->
              <div id="prepayment-section">
                ${this.prepaymentResult && this.state.extraPaymentAmount > 0 ? `
                  <div class="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-lg p-4 sm:p-6">
                    <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-green-900 dark:text-green-100">
                      Prepayment Impact
                    </h3>
                    ${this.renderPrepaymentImpact()}
                  </div>
                ` : ''}
              </div>

              <!-- Comparison Table -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 overflow-hidden">
                <div class="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    Scenario Comparison
                  </h3>
                  <div class="flex gap-2">
                    ${this.scenarios.length > 0 ? `
                      <button id="share-scenarios" class="btn btn-secondary btn-sm text-xs sm:text-sm" aria-label="Share comparison scenarios via link" title="Share scenarios (Ctrl+S)">
                        <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Share
                      </button>
                    ` : ''}
                    <button id="add-to-comparison" class="btn btn-primary btn-sm text-xs sm:text-sm" aria-label="Add current scenario to comparison">
                      + Add Current
                    </button>
                  </div>
                </div>
                <div id="inline-comparison-table" class="overflow-x-auto -mx-4 sm:mx-0">
                  <div class="px-4 sm:px-0 min-w-full">
                    ${this.renderComparisonTable()}
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button id="view-schedule" class="btn btn-secondary flex-1 text-sm sm:text-base" aria-label="View detailed amortization schedule">
                  View Amortization Schedule
                </button>
                <button id="reset" class="btn btn-secondary text-sm sm:text-base" aria-label="Reset calculator to default values (Ctrl+R)" title="Reset (Ctrl+R)">
                  Reset Calculator
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    }

    renderMainResults() {
        if (!this.result) {
            return `
        <div class="text-center py-8 text-gray-500">
          <p>Enter your mortgage details to see payment information</p>
        </div>
      `;
        }

        return `
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 capitalize">${this.state.paymentFrequency} Payment</div>
          <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            ${formatCAD(this.result.regularPayment)}
          </div>
          <div class="text-xs text-gray-500">${MORTGAGE_CONSTANTS.PAYMENTS_PER_YEAR[this.state.paymentFrequency]} payments/year</div>
        </div>
        
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Interest</div>
          <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            ${formatCAD(this.result.totalInterest)}
          </div>
          <div class="text-xs text-gray-500">${(this.result.totalInterest / this.state.principal * 100).toFixed(1)}% of principal</div>
        </div>
        
        <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 sm:p-4">
          <div class="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Total Cost</div>
          <div class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
            ${formatCAD(this.result.totalCost)}
          </div>
          <div class="text-xs text-gray-500">${this.state.amortizationMonths / 12} year term</div>
        </div>
      </div>
    `;
    }

    renderTargetPaymentAnalysis() {
        const targetPayment = parseFloat(this.state.targetPayment);
        if (!targetPayment || !this.result) return '';

        const difference = targetPayment - this.result.regularPayment;
        const percentDiff = (difference / this.result.regularPayment * 100).toFixed(1);

        if (Math.abs(difference) < 1) {
            return `
        <div class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p class="text-sm text-green-800 dark:text-green-200">
            ✓ Your target payment matches the calculated payment!
          </p>
        </div>
      `;
        }

        const canAfford = difference >= 0;

        return `
      <div class="mt-4 p-3 ${canAfford ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} rounded-lg">
        <p class="text-sm ${canAfford ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}">
          ${canAfford
                ? `✓ You can afford this mortgage! Your target is ${formatCAD(Math.abs(difference))} (${Math.abs(percentDiff)}%) higher.`
                : `✗ Target payment is ${formatCAD(Math.abs(difference))} (${Math.abs(percentDiff)}%) below required.`
            }
        </p>
        ${canAfford && difference > 10 ? `
          <p class="text-xs mt-1 ${canAfford ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}">
            Consider adding ${formatCAD(difference)} as extra payment to pay off faster!
          </p>
        ` : ''}
      </div>
    `;
    }

    renderPrepaymentImpact() {
        if (!this.result) {
            return `
          <div class="text-center py-8 text-gray-500">
            <p>Calculate your mortgage to see prepayment options</p>
          </div>
        `;
        }

        if (!this.prepaymentResult || this.state.extraPaymentAmount <= 0) {
            return `
          <div class="text-center py-8">
            <p class="text-gray-600 dark:text-gray-400 mb-4">
              Add extra payments to see how much you can save
            </p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto text-sm">
              <div class="bg-white dark:bg-gray-700 rounded-lg p-3">
                <div class="font-semibold text-gray-700 dark:text-gray-300">Weekly +$50</div>
                <div class="text-gray-500 dark:text-gray-400">Save ~22% interest</div>
              </div>
              <div class="bg-white dark:bg-gray-700 rounded-lg p-3">
                <div class="font-semibold text-gray-700 dark:text-gray-300">Weekly +$100</div>
                <div class="text-gray-500 dark:text-gray-400">Save ~36% interest</div>
              </div>
              <div class="bg-white dark:bg-gray-700 rounded-lg p-3">
                <div class="font-semibold text-gray-700 dark:text-gray-300">Annual $5,000</div>
                <div class="text-gray-500 dark:text-gray-400">Save ~30% interest</div>
              </div>
            </div>
          </div>
        `;
        }

        const savings = this.prepaymentResult;
        const yearsSaved = Math.floor(savings.monthsSaved / 12);
        const monthsSaved = savings.monthsSaved % 12;

        // Calculate new total payment
        const totalPaymentWithExtra = this.state.extraPaymentFrequency === 'per-payment'
            ? this.result.regularPayment + this.state.extraPaymentAmount
            : this.result.regularPayment;

        // Calculate exact payoff time
        const newPayoffYears = Math.floor(savings.actualPayoffMonths / 12);
        const newPayoffMonths = savings.actualPayoffMonths % 12;
        const originalYears = Math.floor(this.state.amortizationMonths / 12);
        const originalMonths = this.state.amortizationMonths % 12;

        return `
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div class="bg-green-100 dark:bg-green-900/40 rounded-lg p-2 sm:p-3">
            <div class="text-xs text-green-700 dark:text-green-300">New Payment</div>
            <div class="text-sm sm:text-base lg:text-lg font-bold text-green-900 dark:text-green-100">
              ${formatCAD(totalPaymentWithExtra)}
            </div>
            <div class="text-xs text-green-600 dark:text-green-400">
              ${this.state.paymentFrequency === 'weekly' ? 'Weekly' :
                this.state.paymentFrequency === 'bi-weekly' ? 'Bi-weekly' : 'Monthly'}
            </div>
          </div>
          
          <div class="bg-green-100 dark:bg-green-900/40 rounded-lg p-2 sm:p-3">
            <div class="text-xs text-green-700 dark:text-green-300">Interest Saved</div>
            <div class="text-sm sm:text-base lg:text-lg font-bold text-green-900 dark:text-green-100">
              ${formatCAD(savings.totalInterestSaved)}
            </div>
            <div class="text-xs text-green-600 dark:text-green-400">${savings.savingsPercentage}% saved</div>
          </div>
          
          <div class="bg-green-100 dark:bg-green-900/40 rounded-lg p-2 sm:p-3">
            <div class="text-xs text-green-700 dark:text-green-300">Time Saved</div>
            <div class="text-sm sm:text-base lg:text-lg font-bold text-green-900 dark:text-green-100">
              ${yearsSaved}y ${monthsSaved}m
            </div>
            <div class="text-xs text-green-600 dark:text-green-400">
              ${Math.round(savings.monthsSaved / this.state.amortizationMonths * 100)}% faster
            </div>
          </div>
          
          <div class="bg-green-100 dark:bg-green-900/40 rounded-lg p-2 sm:p-3">
            <div class="text-xs text-green-700 dark:text-green-300">Payoff Time</div>
            <div class="text-sm sm:text-base lg:text-lg font-bold text-green-900 dark:text-green-100">
              ${newPayoffYears}y ${newPayoffMonths}m
            </div>
            <div class="text-xs text-green-600 dark:text-green-400">
              vs ${originalYears}y ${originalMonths}m
            </div>
          </div>
        </div>
        
        <div class="mt-4 p-3 bg-green-200/50 dark:bg-green-900/50 rounded-lg">
          <p class="text-sm text-green-800 dark:text-green-200 text-center">
            💡 Adding ${formatCAD(this.state.extraPaymentAmount)} ${this.state.extraPaymentFrequency === 'per-payment' ? 'to each payment' : this.state.extraPaymentFrequency === 'annual' ? 'annually' : 'once'} 
            saves ${formatCAD(savings.totalInterestSaved)} and ${yearsSaved} years ${monthsSaved} months!
          </p>
        </div>
    `;
    }

    renderComparisonTable() {
        if (this.scenarios.length === 0) {
            return `
                <div class="text-center py-8 text-gray-500" role="status" aria-live="polite">
                    <p class="mb-2">No scenarios added yet.</p>
                    <p class="text-sm">Click "+ Add Current" to compare different prepayment strategies.</p>
                </div>
            `;
        }

        return `
            <div class="overflow-x-auto max-h-96 overflow-y-auto" role="region" aria-label="Comparison table of mortgage scenarios">
                <table class="w-full text-sm min-w-[600px]" role="table" aria-label="Mortgage scenario comparison">
                    <thead class="sticky top-0 bg-white dark:bg-gray-800 z-10">
                        <tr class="border-b border-gray-200 dark:border-gray-700">
                            <th scope="col" class="text-left py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400">Scenario</th>
                            <th scope="col" class="text-right py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400" title="Payment amount per period">Payment</th>
                            <th scope="col" class="text-right py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400 hidden sm:table-cell" title="Total interest paid over loan term">Interest</th>
                            <th scope="col" class="text-right py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400" title="Total amount paid including principal and interest">Total Cost</th>
                            <th scope="col" class="text-right py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400" title="Time to pay off the mortgage">Time</th>
                            <th scope="col" class="text-right py-2 px-2 sm:px-3 text-xs font-medium text-gray-600 dark:text-gray-400" title="Savings compared to base scenario">Savings</th>
                            <th scope="col" class="text-center py-2 px-2 sm:px-3" aria-label="Remove scenario"><span class="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.scenarios.map((scenario, index) => `
                            <tr class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td class="py-2 px-2 sm:px-3">
                                    <div class="font-medium text-gray-900 dark:text-white text-xs sm:text-sm">
                                        ${scenario.name}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        ${formatCAD(scenario.principal)} @ ${scenario.interestRate}%
                                        ${scenario.extraPaymentAmount > 0
                ? ` • +${formatCAD(scenario.extraPaymentAmount)}`
                : ''}
                                    </div>
                                </td>
                                <td class="text-right py-2 px-2 sm:px-3 text-gray-900 dark:text-white whitespace-nowrap">
                                    <div class="text-xs sm:text-sm">${formatCAD(scenario.totalPayment)}</div>
                                    <div class="text-xs text-gray-500" aria-label="Payment frequency">
                                        ${scenario.paymentFrequency === 'weekly' ? 'W' :
                scenario.paymentFrequency === 'bi-weekly' ? 'B' : 'M'}
                                    </div>
                                </td>
                                <td class="text-right py-2 px-2 sm:px-3 text-gray-900 dark:text-white whitespace-nowrap hidden sm:table-cell">
                                    <span class="text-xs sm:text-sm">${formatCAD(scenario.totalInterest)}</span>
                                </td>
                                <td class="text-right py-2 px-2 sm:px-3 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    <span class="text-xs sm:text-sm">${formatCAD(scenario.totalCost)}</span>
                                </td>
                                <td class="text-right py-2 px-2 sm:px-3 text-gray-900 dark:text-white whitespace-nowrap">
                                    <span class="text-xs sm:text-sm" aria-label="${Math.floor(scenario.payoffMonths / 12)} years and ${scenario.payoffMonths % 12} months">
                                        ${Math.floor(scenario.payoffMonths / 12)}y ${scenario.payoffMonths % 12}m
                                    </span>
                                </td>
                                <td class="text-right py-2 px-2 sm:px-3">
                                    ${(() => {
                if (scenario.savings > 0) {
                    const baseScenario = this.scenarios[0];
                    const basePayoffMonths = baseScenario ? baseScenario.payoffMonths : scenario.amortizationMonths;
                    const monthsSaved = basePayoffMonths - scenario.payoffMonths;
                    const yearsSaved = Math.floor(monthsSaved / 12);
                    const remainingMonths = monthsSaved % 12;

                    return `
                                                <div>
                                                    <div class="text-green-600 dark:text-green-400 font-medium text-xs sm:text-sm">
                                                        ${formatCAD(scenario.savings)}
                                                    </div>
                                                    ${monthsSaved > 0 ? `
                                                        <div class="text-xs text-gray-500 dark:text-gray-400">
                                                            ${yearsSaved}y ${remainingMonths}m saved
                                                        </div>
                                                    ` : ''}
                                                </div>
                                            `;
                }
                return '<span class="text-gray-500 text-xs sm:text-sm">-</span>';
            })()}
                                </td>
                                <td class="text-center py-2 px-2 sm:px-3">
                                    <button 
                                        class="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 rounded" 
                                        onclick="window.removeScenario(${index})"
                                        aria-label="Remove ${scenario.name} from comparison">
                                        <span aria-hidden="true">✕</span>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="sm:hidden mt-2 px-2 text-xs text-gray-500 dark:text-gray-400">
                    <p>💡 Swipe horizontally to see all columns</p>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Real-time calculation on all inputs
        const inputs = ['principal', 'interestRate', 'amortizationYears', 'paymentFrequency',
            'extraPayment', 'extraPaymentFrequency'];

        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('input', (e) => {
                    this.handleInputChange(e);
                    this.validateInput(id, e.target.value);
                    this.calculateAll();
                });

                if (element.tagName === 'SELECT') {
                    element.addEventListener('change', (e) => {
                        this.handleInputChange(e);
                        this.calculateAll();
                    });
                }

                // Special handling for extraPayment field
                if (id === 'extraPayment') {
                    element.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            this.evaluateExtraPayment();
                        }
                    });

                    element.addEventListener('blur', () => {
                        this.evaluateExtraPayment();
                    });
                }
            }
        });


        // Action buttons
        const resetBtn = document.getElementById('reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.handleReset());
        }

        const addToComparisonBtn = document.getElementById('add-to-comparison');
        if (addToComparisonBtn) {
            addToComparisonBtn.addEventListener('click', () => this.addToComparison());
        }

        // Set up remove scenario function
        window.removeScenario = (index) => {
            this.scenarios.splice(index, 1);
            // Update the entire comparison section to show/hide share button
            this.updateComparisonSection();
            // Re-attach share button listener after DOM update
            this.attachShareButtonListener();
        };

        // Share scenarios button
        this.attachShareButtonListener();

        const viewScheduleBtn = document.getElementById('view-schedule');
        if (viewScheduleBtn) {
            viewScheduleBtn.addEventListener('click', () => {
                if (this.result) {
                    eventBus.emit('schedule:show', this.state);
                } else {
                    eventBus.emit(EVENTS.NOTIFICATION, {
                        message: 'Please enter mortgage details first',
                        type: 'info'
                    });
                }
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+R or Cmd+R: Reset
            if ((e.ctrlKey || e.metaKey) && e.key === 'r' && !e.shiftKey && !e.altKey) {
                e.preventDefault();
                this.handleReset();
            }
            // Ctrl+S or Cmd+S: Share (when scenarios exist)
            if ((e.ctrlKey || e.metaKey) && e.key === 's' && !e.shiftKey && !e.altKey && this.scenarios.length > 0) {
                e.preventDefault();
                this.shareScenarios();
            }
        });
    }

    handleInputChange(e) {
        const { id, value } = e.target;

        switch (id) {
            case 'principal':
                this.state.principal = parseFloat(value) || 0;
                break;
            case 'interestRate':
                this.state.interestRate = parseFloat(value) || 0;
                break;
            case 'amortizationYears':
                this.state.amortizationMonths = (parseInt(value) || 0) * 12;
                break;
            case 'paymentFrequency':
                this.state.paymentFrequency = value;
                break;
            case 'targetPayment':
                this.state.targetPayment = value ? parseFloat(value) : null;
                break;
            case 'extraPayment':
                // For extra payment, we'll evaluate on Enter/blur, not on every keystroke
                // Just store the raw value for now
                break;
            case 'extraPaymentFrequency':
                this.state.extraPaymentFrequency = value;
                break;
        }
    }

    validateInput(fieldId, value) {
        const errorEl = document.getElementById(`${fieldId}-error`);
        const inputEl = document.getElementById(fieldId);
        
        if (!errorEl || !inputEl) return;

        let errorMessage = '';
        
        switch (fieldId) {
            case 'principal': {
                const principal = parseFloat(value) || 0;
                if (principal < MORTGAGE_CONSTANTS.MIN_PRINCIPAL) {
                    errorMessage = `Loan amount must be at least ${formatCAD(MORTGAGE_CONSTANTS.MIN_PRINCIPAL)}`;
                    inputEl.setAttribute('aria-invalid', 'true');
                } else if (principal > MORTGAGE_CONSTANTS.MAX_PRINCIPAL) {
                    errorMessage = `Loan amount must not exceed ${formatCAD(MORTGAGE_CONSTANTS.MAX_PRINCIPAL)}`;
                    inputEl.setAttribute('aria-invalid', 'true');
                } else {
                    inputEl.setAttribute('aria-invalid', 'false');
                }
                break;
            }
            case 'interestRate': {
                const rate = parseFloat(value) || 0;
                if (rate < 0.01) {
                    errorMessage = 'Interest rate must be at least 0.01%';
                    inputEl.setAttribute('aria-invalid', 'true');
                } else if (rate > 30) {
                    errorMessage = 'Interest rate must not exceed 30%';
                    inputEl.setAttribute('aria-invalid', 'true');
                } else {
                    inputEl.setAttribute('aria-invalid', 'false');
                }
                break;
            }
            case 'amortizationYears': {
                const years = parseInt(value) || 0;
                if (years < 1) {
                    errorMessage = 'Amortization must be at least 1 year';
                    inputEl.setAttribute('aria-invalid', 'true');
                } else if (years > 30) {
                    errorMessage = 'Amortization must not exceed 30 years';
                    inputEl.setAttribute('aria-invalid', 'true');
                } else {
                    inputEl.setAttribute('aria-invalid', 'false');
                }
                break;
            }
        }

        if (errorMessage) {
            errorEl.textContent = errorMessage;
            errorEl.classList.remove('hidden');
        } else {
            errorEl.classList.add('hidden');
            errorEl.textContent = '';
        }
    }

    updateValidationErrors(validation) {
        // Map validation errors to fields and display them
        validation.errors.forEach(errorCode => {
            let fieldId = '';
            let message = '';
            
            switch (errorCode) {
                case 'PRINCIPAL_TOO_LOW':
                    fieldId = 'principal';
                    message = `Loan amount must be at least ${formatCAD(MORTGAGE_CONSTANTS.MIN_PRINCIPAL)}`;
                    break;
                case 'PRINCIPAL_TOO_HIGH':
                    fieldId = 'principal';
                    message = `Loan amount must not exceed ${formatCAD(MORTGAGE_CONSTANTS.MAX_PRINCIPAL)}`;
                    break;
                case 'RATE_TOO_LOW':
                    fieldId = 'interestRate';
                    message = 'Interest rate must be at least 0.01%';
                    break;
                case 'RATE_TOO_HIGH':
                    fieldId = 'interestRate';
                    message = 'Interest rate must not exceed 30%';
                    break;
                case 'TERM_TOO_SHORT':
                    fieldId = 'amortizationYears';
                    message = 'Amortization must be at least 1 year';
                    break;
                case 'TERM_TOO_LONG_CONVENTIONAL':
                case 'TERM_TOO_LONG_HIGH_RATIO':
                    fieldId = 'amortizationYears';
                    message = 'Amortization must not exceed 30 years for conventional mortgages';
                    break;
            }

            if (fieldId) {
                const errorEl = document.getElementById(`${fieldId}-error`);
                const inputEl = document.getElementById(fieldId);
                
                if (errorEl) {
                    errorEl.textContent = message;
                    errorEl.classList.remove('hidden');
                }
                if (inputEl) {
                    inputEl.setAttribute('aria-invalid', 'true');
                }
            }
        });
    }

    clearValidationErrors() {
        const errorFields = ['principal', 'interestRate', 'amortizationYears'];
        errorFields.forEach(fieldId => {
            const errorEl = document.getElementById(`${fieldId}-error`);
            const inputEl = document.getElementById(fieldId);
            
            if (errorEl) {
                errorEl.classList.add('hidden');
                errorEl.textContent = '';
            }
            if (inputEl) {
                inputEl.setAttribute('aria-invalid', 'false');
            }
        });
    }

    calculateAll() {
        // Debounce calculations
        clearTimeout(this.calculationTimeout);
        this.calculationTimeout = setTimeout(() => {
            this.performCalculations();
        }, 300);
    }

    performCalculations() {
        // Show loading state
        const loadingEl = document.getElementById('calculation-loading');
        const resultsEl = document.getElementById('base-mortgage-results');
        if (loadingEl && resultsEl) {
            loadingEl.classList.remove('hidden');
            resultsEl.setAttribute('aria-busy', 'true');
        }

        // Validate inputs
        const validation = validateMortgageInputs(this.state);
        if (!validation.isValid) {
            this.result = null;
            this.prepaymentResult = null;
            this.updateValidationErrors(validation);
            if (loadingEl) loadingEl.classList.add('hidden');
            if (resultsEl) resultsEl.setAttribute('aria-busy', 'false');
            this.updateResults();
            return;
        }

        // Clear validation errors
        this.clearValidationErrors();

        // Use requestAnimationFrame to allow UI to update before heavy calculation
        requestAnimationFrame(() => {
            try {
                // Main calculation
                this.result = calculateMortgage(this.state);

                // Prepayment calculation
                if (this.state.extraPaymentAmount > 0) {
                    this.prepaymentResult = calculateWithPrepayment({
                        ...this.state,
                        extraPayment: this.state.extraPaymentAmount,
                        extraPaymentFrequency: this.state.extraPaymentFrequency,
                    });
                } else {
                    this.prepaymentResult = null;
                }

                // Update only the results sections
                this.updateResults();

                // Hide loading state
                if (loadingEl) loadingEl.classList.add('hidden');
                if (resultsEl) resultsEl.setAttribute('aria-busy', 'false');

                // Emit events
                eventBus.emit(EVENTS.CALCULATION_COMPLETE, {
                    inputs: this.state,
                    result: this.result,
                    prepaymentResult: this.prepaymentResult,
                });
            } catch (error) {
                logger.error('Calculation failed', error);
                this.result = null;
                this.prepaymentResult = null;
                if (loadingEl) loadingEl.classList.add('hidden');
                if (resultsEl) resultsEl.setAttribute('aria-busy', 'false');
                this.updateResults();
                eventBus.emit(EVENTS.ERROR_OCCURRED, error);
            }
        });
    }

    updateResults() {
        // Update base mortgage results
        const baseResultsDiv = document.querySelector('#base-mortgage-results');
        if (baseResultsDiv) {
            baseResultsDiv.innerHTML = this.renderMainResults();
        }

        // Update prepayment section
        const prepaymentSection = document.querySelector('#prepayment-section');
        if (prepaymentSection) {
            if (this.prepaymentResult && this.state.extraPaymentAmount > 0) {
                prepaymentSection.innerHTML = `
          <div class="bg-green-50 dark:bg-green-900/20 rounded-xl shadow-lg p-4 sm:p-6">
            <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-green-900 dark:text-green-100">
              Prepayment Impact
            </h3>
            ${this.renderPrepaymentImpact()}
          </div>
        `;
            } else {
                prepaymentSection.innerHTML = '';
            }
        }

        // Update comparison table
        const comparisonDiv = document.querySelector('#inline-comparison-table');
        if (comparisonDiv) {
            comparisonDiv.innerHTML = this.renderComparisonTable();
        }
    }

    updateComparisonSection() {
        // Find the comparison section container by looking for the parent of inline-comparison-table
        const comparisonTable = document.querySelector('#inline-comparison-table');
        if (!comparisonTable) {
            return;
        }

        // Get the card container (should be 2 levels up)
        const comparisonContainer = comparisonTable.closest('.bg-white.dark\\:bg-gray-800.rounded-xl.shadow-lg');
        if (comparisonContainer) {
            comparisonContainer.innerHTML = `
                <div class="flex justify-between items-center mb-3 sm:mb-4">
                  <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                    Scenario Comparison
                  </h3>
                  <div class="flex gap-2">
                    ${this.scenarios.length > 0 ? `
                      <button id="share-scenarios" class="btn btn-secondary btn-sm text-xs sm:text-sm" aria-label="Share comparison scenarios via link" title="Share scenarios (Ctrl+S)">
                        <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Share
                      </button>
                    ` : ''}
                    <button id="add-to-comparison" class="btn btn-primary btn-sm text-xs sm:text-sm" aria-label="Add current scenario to comparison">
                      + Add Current
                    </button>
                  </div>
                </div>
                <div id="inline-comparison-table" class="overflow-x-auto -mx-4 sm:mx-0">
                  <div class="px-4 sm:px-0 min-w-full">
                    ${this.renderComparisonTable()}
                  </div>
                </div>
            `;

            // Re-attach add to comparison listener
            const addBtn = document.getElementById('add-to-comparison');
            if (addBtn) {
                addBtn.addEventListener('click', () => this.addToComparison());
            }
        }
    }

    handleReset() {
        this.state = {
            principal: 298000,
            interestRate: 4.05,
            amortizationMonths: 360,
            paymentFrequency: 'weekly',
            targetPayment: null,
            extraPaymentAmount: 0,
            extraPaymentFrequency: 'per-payment',
        };
        this.result = null;
        this.prepaymentResult = null;
        this.render();
        this.attachEventListeners();
        this.calculateAll();
    }

    evaluateExtraPayment() {
        const input = document.getElementById('extraPayment');
        if (!input) return;

        const value = input.value.trim();

        if (!value) {
            this.state.extraPaymentAmount = 0;
            this.calculateAll();
            return;
        }

        // Check if it's an expression
        if (isExpression(value)) {
            const result = evaluateExpression(value);
            if (result !== null) {
                if (result < 0) {
                    // Valid expression but negative result
                    eventBus.emit(EVENTS.NOTIFICATION, {
                        message: `${value} = ${result} (must be positive)`,
                        type: 'error'
                    });
                    this.state.extraPaymentAmount = 0;
                    input.value = 0;
                } else {
                    // Valid positive result
                    this.state.extraPaymentAmount = result;
                    input.value = result;
                    this.calculateAll();

                    // Show brief notification
                    eventBus.emit(EVENTS.NOTIFICATION, {
                        message: `Calculated: ${value} = ${result}`,
                        type: 'info'
                    });
                }
            } else {
                // Invalid expression
                eventBus.emit(EVENTS.NOTIFICATION, {
                    message: 'Invalid expression. Use numbers and +, -, *, /, ()',
                    type: 'error'
                });
            }
        } else {
            // Plain number
            const num = parseFloat(value);
            if (!isNaN(num) && num >= 0) {
                this.state.extraPaymentAmount = num;
                this.calculateAll();
            } else if (num < 0) {
                this.state.extraPaymentAmount = 0;
                input.value = 0;
                eventBus.emit(EVENTS.NOTIFICATION, {
                    message: 'Extra payment must be positive',
                    type: 'error'
                });
            }
        }
    }

    addToComparison() {
        if (!this.result) return;

        // Calculate total payment including extra
        let totalPayment = this.result.regularPayment;
        if (this.state.extraPaymentAmount > 0 && this.state.extraPaymentFrequency === 'per-payment') {
            totalPayment += this.state.extraPaymentAmount;
        }

        // Create a descriptive name based on what's different from base
        let scenarioName = '';
        if (this.scenarios.length === 0) {
            scenarioName = 'Base Scenario';
        } else {
            const baseScenario = this.scenarios[0];
            const differences = [];

            if (this.state.principal !== baseScenario.principal) {
                differences.push(`${formatCAD(this.state.principal)}`);
            }
            if (this.state.interestRate !== baseScenario.interestRate) {
                differences.push(`${this.state.interestRate}%`);
            }
            if (this.state.amortizationMonths !== baseScenario.amortizationMonths) {
                differences.push(`${this.state.amortizationMonths / 12}yr`);
            }
            if (this.state.paymentFrequency !== baseScenario.paymentFrequency) {
                differences.push(this.state.paymentFrequency);
            }
            if (this.state.extraPaymentAmount > 0) {
                differences.push(`+${formatCAD(this.state.extraPaymentAmount)}`);
            }

            scenarioName = differences.length > 0 ? differences.join(', ') : 'Scenario ' + (this.scenarios.length + 1);
        }

        const scenario = {
            name: scenarioName,
            basePayment: this.result.regularPayment,
            totalPayment: totalPayment,
            extraPaymentAmount: this.state.extraPaymentAmount,
            extraPaymentFrequency: this.state.extraPaymentFrequency,
            totalInterest: this.prepaymentResult && this.state.extraPaymentAmount > 0
                ? this.result.totalInterest - this.prepaymentResult.totalInterestSaved
                : this.result.totalInterest,
            totalCost: this.prepaymentResult && this.state.extraPaymentAmount > 0
                ? this.prepaymentResult.totalCostWithPrepayment
                : this.result.totalCost,
            payoffMonths: this.prepaymentResult && this.state.extraPaymentAmount > 0 && this.prepaymentResult.actualPayoffMonths
                ? this.prepaymentResult.actualPayoffMonths
                : this.state.amortizationMonths,
            savings: 0, // Will be calculated after adding to scenarios
            principal: this.state.principal,
            interestRate: this.state.interestRate,
            amortizationMonths: this.state.amortizationMonths,
            paymentFrequency: this.state.paymentFrequency
        };

        // Don't add duplicate scenarios - check all relevant parameters
        const exists = this.scenarios.some(s =>
            s.principal === scenario.principal &&
            s.interestRate === scenario.interestRate &&
            s.amortizationMonths === scenario.amortizationMonths &&
            s.paymentFrequency === scenario.paymentFrequency &&
            s.extraPaymentAmount === scenario.extraPaymentAmount &&
            s.extraPaymentFrequency === scenario.extraPaymentFrequency
        );

        if (!exists) {
            this.scenarios.push(scenario);

            // Calculate savings relative to base scenario
            if (this.scenarios.length > 1) {
                const baseScenario = this.scenarios[0];
                this.scenarios.forEach(s => {
                    s.savings = baseScenario.totalCost - s.totalCost;
                });
            }

            // Update the entire comparison section to show share button
            this.updateComparisonSection();

            eventBus.emit(EVENTS.NOTIFICATION, {
                message: 'Added to comparison!',
                type: 'success'
            });

            // Re-attach share button listener after DOM update
            this.attachShareButtonListener();
        } else {
            eventBus.emit(EVENTS.NOTIFICATION, {
                message: 'This scenario already exists in comparison',
                type: 'info'
            });
        }
    }

    loadSharedScenarios() {
        try {
            const sharedScenarios = parseScenariosFromUrl();
            if (sharedScenarios && sharedScenarios.length > 0) {
                // We need to recalculate all derived values for each scenario
                this.scenarios = [];

                // Process each scenario
                sharedScenarios.forEach((scenarioData, index) => {
                    // Calculate the results for this scenario
                    const result = calculateMortgage({
                        principal: scenarioData.principal,
                        interestRate: scenarioData.interestRate,
                        amortizationMonths: scenarioData.amortizationMonths,
                        paymentFrequency: scenarioData.paymentFrequency
                    });

                    let prepaymentResult = null;
                    if (scenarioData.extraPaymentAmount > 0) {
                        prepaymentResult = calculateWithPrepayment({
                            principal: scenarioData.principal,
                            interestRate: scenarioData.interestRate,
                            amortizationMonths: scenarioData.amortizationMonths,
                            paymentFrequency: scenarioData.paymentFrequency,
                            extraPayment: scenarioData.extraPaymentAmount,
                            extraPaymentFrequency: scenarioData.extraPaymentFrequency
                        });
                    }

                    // Generate scenario name
                    let scenarioName = index === 0 ? 'Base Mortgage' : '';
                    if (index > 0) {
                        const baseScenario = sharedScenarios[0];
                        const differences = [];

                        if (scenarioData.principal !== baseScenario.principal) {
                            differences.push(`${formatCAD(scenarioData.principal)} loan`);
                        }
                        if (scenarioData.interestRate !== baseScenario.interestRate) {
                            differences.push(`${scenarioData.interestRate}% rate`);
                        }
                        if (scenarioData.amortizationMonths !== baseScenario.amortizationMonths) {
                            differences.push(`${scenarioData.amortizationMonths / 12}yr`);
                        }
                        if (scenarioData.paymentFrequency !== baseScenario.paymentFrequency) {
                            differences.push(scenarioData.paymentFrequency);
                        }
                        if (scenarioData.extraPaymentAmount > 0) {
                            differences.push(`+${formatCAD(scenarioData.extraPaymentAmount)}`);
                        }

                        scenarioName = differences.slice(0, 2).join(', ');
                    } else if (scenarioData.extraPaymentAmount > 0) {
                        scenarioName = `Base + ${formatCAD(scenarioData.extraPaymentAmount)}`;
                    }

                    // Create full scenario object
                    const scenario = {
                        name: scenarioName,
                        principal: scenarioData.principal,
                        interestRate: scenarioData.interestRate,
                        amortizationMonths: scenarioData.amortizationMonths,
                        paymentFrequency: scenarioData.paymentFrequency,
                        extraPaymentAmount: scenarioData.extraPaymentAmount,
                        extraPaymentFrequency: scenarioData.extraPaymentFrequency,
                        regularPayment: result.regularPayment,
                        totalPayment: result.regularPayment + (scenarioData.extraPaymentAmount || 0),
                        totalInterest: prepaymentResult?.totalInterest || result.totalInterest,
                        totalCost: prepaymentResult?.totalCost || result.totalCost,
                        payoffMonths: prepaymentResult?.actualPayoffMonths || scenarioData.amortizationMonths,
                        savings: 0
                    };

                    this.scenarios.push(scenario);
                });

                // Calculate savings relative to base scenario
                if (this.scenarios.length > 0) {
                    const baseScenario = this.scenarios[0];
                    this.scenarios.forEach(scenario => {
                        scenario.savings = baseScenario.totalCost - scenario.totalCost;
                    });
                }

                // Load the first scenario into the calculator
                if (sharedScenarios[0]) {
                    const firstScenario = sharedScenarios[0];
                    this.state.principal = firstScenario.principal;
                    this.state.interestRate = firstScenario.interestRate;
                    this.state.amortizationMonths = firstScenario.amortizationMonths;
                    this.state.paymentFrequency = firstScenario.paymentFrequency;
                    this.state.extraPaymentAmount = firstScenario.extraPaymentAmount || 0;
                    this.state.extraPaymentFrequency = firstScenario.extraPaymentFrequency || 'per-payment';
                }

                // Clean the URL after loading
                cleanUrl();

                eventBus.emit(EVENTS.NOTIFICATION, {
                    message: `Loaded ${sharedScenarios.length} shared scenario${sharedScenarios.length > 1 ? 's' : ''}!`,
                    type: 'success'
                });
            }
        } catch (error) {
            logger.error('Failed to load shared scenarios:', error);
        }
    }

    attachShareButtonListener() {
        const shareBtn = document.getElementById('share-scenarios');
        if (shareBtn) {
            shareBtn.addEventListener('click', () => this.shareScenarios());
        }
    }

    async shareScenarios() {
        if (this.scenarios.length === 0) {
            eventBus.emit(EVENTS.NOTIFICATION, {
                message: 'No scenarios to share',
                type: 'info'
            });
            return;
        }

        try {
            const shareableUrl = generateShareableUrl(this.scenarios);
            const copied = await copyToClipboard(shareableUrl);

            if (copied) {
                eventBus.emit(EVENTS.NOTIFICATION, {
                    message: 'Share link copied to clipboard!',
                    type: 'success'
                });
            } else {
                // Fallback: show the URL in a prompt
                prompt('Copy this link to share:', shareableUrl);
            }
        } catch (error) {
            logger.error('Failed to generate share link:', error);
            eventBus.emit(EVENTS.NOTIFICATION, {
                message: 'Failed to generate share link',
                type: 'error'
            });
        }
    }
}

export default CalculatorModern;
