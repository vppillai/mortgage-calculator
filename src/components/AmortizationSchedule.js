/**
 * Amortization Schedule Component
 * Displays payment-by-payment breakdown
 */

import { formatCAD } from '../services/currencyFormatter.js';
import { generateAmortizationSchedule } from '../services/mortgageCalculator.js';

export class AmortizationSchedule {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.schedule = [];
        this.pageSize = 50;
        this.currentPage = 0;
    }

    show(mortgageParams) {
        this.schedule = generateAmortizationSchedule(mortgageParams);
        this.currentPage = 0;
        this.render();
    }

    render() {
        if (this.schedule.length === 0) {
            this.container.innerHTML = '';
            return;
        }

        const start = this.currentPage * this.pageSize;
        const end = Math.min(start + this.pageSize, this.schedule.length);
        const pageData = this.schedule.slice(start, end);

        this.container.innerHTML = `
      <div class="card mt-6">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            Amortization Schedule
          </h3>
          <button id="close-schedule" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕ Close
          </button>
        </div>

        <div class="mb-4 flex justify-between items-center">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Showing payments ${start + 1}-${end} of ${this.schedule.length}
          </div>
          <div class="flex gap-2">
            <button id="prev-page" class="btn btn-secondary text-sm" ${this.currentPage === 0 ? 'disabled' : ''}>
              Previous
            </button>
            <button id="next-page" class="btn btn-secondary text-sm" ${end >= this.schedule.length ? 'disabled' : ''}>
              Next
            </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">#</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Date</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Principal</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Interest</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Payment</th>
                <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Balance</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              ${pageData.map((payment) => `
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${payment.paymentNumber}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    ${payment.paymentDate}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    ${formatCAD(payment.principalPayment)}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                    ${formatCAD(payment.interestPayment)}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                    ${formatCAD(payment.totalPayment)}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-right ${payment.remainingBalance === 0 ? 'text-green-600 dark:text-green-400 font-bold' : 'text-gray-900 dark:text-white'}">
                    ${formatCAD(payment.remainingBalance)}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex justify-between items-center">
          <button id="download-schedule" class="btn btn-secondary text-sm">
            Download CSV
          </button>
          <div class="flex items-center gap-4">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              Page ${this.currentPage + 1} of ${Math.ceil(this.schedule.length / this.pageSize)}
            </div>
            <div class="flex gap-2">
              <button id="prev-page-bottom" class="btn btn-secondary text-sm" ${this.currentPage === 0 ? 'disabled' : ''}>
                Previous
              </button>
              <button id="next-page-bottom" class="btn btn-secondary text-sm" ${end >= this.schedule.length ? 'disabled' : ''}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const closeBtn = document.getElementById('close-schedule');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.container.innerHTML = '';
            });
        }

        const prevBtn = document.getElementById('prev-page');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 0) {
                    this.currentPage--;
                    this.render();
                }
            });
        }

        const nextBtn = document.getElementById('next-page');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const maxPage = Math.ceil(this.schedule.length / this.pageSize) - 1;
                if (this.currentPage < maxPage) {
                    this.currentPage++;
                    this.render();
                }
            });
        }

        // Bottom pagination buttons
        const prevBtnBottom = document.getElementById('prev-page-bottom');
        if (prevBtnBottom) {
            prevBtnBottom.addEventListener('click', () => {
                if (this.currentPage > 0) {
                    this.currentPage--;
                    this.render();
                }
            });
        }

        const nextBtnBottom = document.getElementById('next-page-bottom');
        if (nextBtnBottom) {
            nextBtnBottom.addEventListener('click', () => {
                const maxPage = Math.ceil(this.schedule.length / this.pageSize) - 1;
                if (this.currentPage < maxPage) {
                    this.currentPage++;
                    this.render();
                }
            });
        }

        const downloadBtn = document.getElementById('download-schedule');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => {
                this.downloadCSV();
            });
        }
    }

    downloadCSV() {
        const headers = ['Payment #', 'Date', 'Principal', 'Interest', 'Total Payment', 'Remaining Balance'];
        const rows = this.schedule.map((p) => [
            p.paymentNumber,
            p.paymentDate,
            p.principalPayment,
            p.interestPayment,
            p.totalPayment,
            p.remainingBalance,
        ]);

        const csv = [
            headers.join(','),
            ...rows.map((row) => row.join(',')),
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `amortization-schedule-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }
}

export default AmortizationSchedule;

