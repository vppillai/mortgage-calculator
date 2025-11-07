/**
 * Amortization Schedule Component
 * Displays payment-by-payment breakdown with table and graph views
 */

import { formatCAD } from '../services/currencyFormatter.js';
import { generateAmortizationSchedule } from '../services/mortgageCalculator.js';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

export class AmortizationSchedule {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.schedule = [];
        this.pageSize = 50;
        this.currentPage = 0;
        this.viewMode = 'table'; // 'table' or 'graph'
        this.chart = null;
        this.hoveredIndex = null;
    }

    show(mortgageParams) {
        this.schedule = generateAmortizationSchedule(mortgageParams);
        this.currentPage = 0;
        this.viewMode = 'table';
        this.render();
    }

    render() {
        if (this.schedule.length === 0) {
            this.container.innerHTML = '';
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }
            return;
        }

        if (this.viewMode === 'graph') {
            this.renderGraph();
        } else {
            this.renderTable();
        }
    }

    renderTable() {
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

        <!-- View Toggle -->
        <div class="mb-4 flex justify-between items-center flex-wrap gap-3">
          <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button id="view-table" class="px-4 py-2 text-sm font-medium rounded-md transition-all ${
              this.viewMode === 'table'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }">
              Table
            </button>
            <button id="view-graph" class="px-4 py-2 text-sm font-medium rounded-md transition-all ${
              this.viewMode === 'graph'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }">
              Graph
            </button>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Showing payments ${start + 1}-${end} of ${this.schedule.length}
          </div>
        </div>

        <div class="mb-4 flex justify-end gap-2">
          <button id="prev-page" class="btn btn-secondary text-sm" ${this.currentPage === 0 ? 'disabled' : ''}>
            Previous
          </button>
          <button id="next-page" class="btn btn-secondary text-sm" ${end >= this.schedule.length ? 'disabled' : ''}>
            Next
          </button>
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

        <div class="mt-4 flex justify-between items-center flex-wrap gap-3">
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

    renderGraph() {
        // Destroy existing chart if present
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }

        // Prepare data for graph
        const labels = this.schedule.map((p, index) => index + 1);
        const principalData = this.schedule.map(p => p.principalPayment);
        const interestData = this.schedule.map(p => p.interestPayment);

        // Determine if dark mode is active
        const isDark = document.documentElement.classList.contains('dark');
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';

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

        <!-- View Toggle -->
        <div class="mb-4 flex justify-between items-center flex-wrap gap-3">
          <div class="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button id="view-table" class="px-4 py-2 text-sm font-medium rounded-md transition-all ${
              this.viewMode === 'table'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }">
              Table
            </button>
            <button id="view-graph" class="px-4 py-2 text-sm font-medium rounded-md transition-all ${
              this.viewMode === 'graph'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }">
              Graph
            </button>
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-400">
            ${this.schedule.length} payments total
          </div>
        </div>

        <!-- Graph Container -->
        <div class="relative mb-4" style="height: 400px;">
          <canvas id="amortization-chart"></canvas>
          <div id="chart-tooltip" class="absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3 pointer-events-none opacity-0 transition-opacity duration-200 z-10" style="min-width: 200px;">
            <div class="text-xs font-semibold text-gray-900 dark:text-white mb-2" id="tooltip-payment"></div>
            <div class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <div>Principal: <span class="font-medium text-blue-600 dark:text-blue-400" id="tooltip-principal"></span></div>
              <div>Interest: <span class="font-medium text-green-600 dark:text-green-400" id="tooltip-interest"></span></div>
              <div>Total: <span class="font-medium text-gray-900 dark:text-white" id="tooltip-total"></span></div>
              <div>Balance: <span class="font-medium text-gray-900 dark:text-white" id="tooltip-balance"></span></div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex justify-center items-center gap-6 mb-4 flex-wrap">
          <div class="flex items-center gap-2">
            <div class="w-4 h-0.5 bg-blue-500"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Principal</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-4 h-0.5 bg-green-500"></div>
            <span class="text-sm text-gray-600 dark:text-gray-400">Interest</span>
          </div>
        </div>

        <div class="mt-4 flex justify-center">
          <button id="download-schedule" class="btn btn-secondary text-sm">
            Download CSV
          </button>
        </div>
      </div>
    `;

        // Wait for DOM to be ready, then create chart
        setTimeout(() => {
            this.createChart(labels, principalData, interestData, gridColor, textColor);
            this.attachEventListeners();
        }, 100);
    }

    createChart(labels, principalData, interestData, gridColor, textColor) {
        const canvas = document.getElementById('amortization-chart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const tooltip = document.getElementById('chart-tooltip');

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Principal',
                        data: principalData,
                        borderColor: 'rgb(59, 130, 246)', // blue-500
                        backgroundColor: 'rgba(59, 130, 246, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4, // Smooth curves
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBorderWidth: 2,
                        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
                        pointHoverBorderColor: '#fff',
                    },
                    {
                        label: 'Interest',
                        data: interestData,
                        borderColor: 'rgb(34, 197, 94)', // green-500
                        backgroundColor: 'rgba(34, 197, 94, 0.1)',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.4, // Smooth curves
                        pointRadius: 0,
                        pointHoverRadius: 6,
                        pointHoverBorderWidth: 2,
                        pointHoverBackgroundColor: 'rgb(34, 197, 94)',
                        pointHoverBorderColor: '#fff',
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart',
                },
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins: {
                    legend: {
                        display: false, // We have custom legend
                    },
                    tooltip: {
                        enabled: false, // We use custom tooltip
                    },
                },
                scales: {
                    x: {
                        grid: {
                            color: gridColor,
                            drawBorder: false,
                        },
                        ticks: {
                            color: textColor,
                            maxTicksLimit: 12,
                            callback: function(value) {
                                // Show every Nth payment number
                                const step = Math.ceil(labels.length / 12);
                                return value % step === 0 || value === labels.length - 1 ? value + 1 : '';
                            },
                        },
                        title: {
                            display: true,
                            text: 'Payment Number',
                            color: textColor,
                        },
                    },
                    y: {
                        grid: {
                            color: gridColor,
                            drawBorder: false,
                        },
                        ticks: {
                            color: textColor,
                            callback: function(value) {
                                return formatCAD(value);
                            },
                        },
                        title: {
                            display: true,
                            text: 'Amount (CAD)',
                            color: textColor,
                        },
                        beginAtZero: true,
                    },
                },
                onHover: (event, activeElements) => {
                    canvas.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
                },
            },
        });

        // Custom hover handler for smooth marker movement
        const handleHover = (event) => {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const chartArea = this.chart.chartArea;
            if (x < chartArea.left || x > chartArea.right || y < chartArea.top || y > chartArea.bottom) {
                tooltip.style.opacity = '0';
                this.hoveredIndex = null;
                return;
            }

            // Find the closest data point
            const xScale = this.chart.scales.x;
            const value = xScale.getValueForPixel(x);
            const index = Math.round(value);

            if (index >= 0 && index < labels.length && index !== this.hoveredIndex) {
                this.hoveredIndex = index;
                const payment = this.schedule[index];

                // Update tooltip content
                document.getElementById('tooltip-payment').textContent = `Payment #${payment.paymentNumber}`;
                document.getElementById('tooltip-principal').textContent = formatCAD(payment.principalPayment);
                document.getElementById('tooltip-interest').textContent = formatCAD(payment.interestPayment);
                document.getElementById('tooltip-total').textContent = formatCAD(payment.totalPayment);
                document.getElementById('tooltip-balance').textContent = formatCAD(payment.remainingBalance);

                // Position tooltip
                const tooltipWidth = tooltip.offsetWidth;
                const tooltipHeight = tooltip.offsetHeight;
                let tooltipX = x + rect.left + 10;
                let tooltipY = y + rect.top - tooltipHeight / 2;

                // Keep tooltip within viewport
                if (tooltipX + tooltipWidth > window.innerWidth) {
                    tooltipX = x + rect.left - tooltipWidth - 10;
                }
                if (tooltipY + tooltipHeight > window.innerHeight) {
                    tooltipY = window.innerHeight - tooltipHeight - 10;
                }
                if (tooltipY < 0) {
                    tooltipY = 10;
                }

                tooltip.style.left = `${tooltipX}px`;
                tooltip.style.top = `${tooltipY}px`;
                tooltip.style.opacity = '1';
            }
        };

        // Mouse events
        canvas.addEventListener('mousemove', handleHover);
        canvas.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            this.hoveredIndex = null;
        });

        // Touch events for mobile
        let touchTimeout;
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleHover(e.touches[0]);
        });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            clearTimeout(touchTimeout);
            handleHover(e.touches[0]);
        });
        canvas.addEventListener('touchend', () => {
            touchTimeout = setTimeout(() => {
                tooltip.style.opacity = '0';
                this.hoveredIndex = null;
            }, 2000); // Hide after 2 seconds
        });
    }

    attachEventListeners() {
        const closeBtn = document.getElementById('close-schedule');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                if (this.chart) {
                    this.chart.destroy();
                    this.chart = null;
                }
                this.container.innerHTML = '';
            });
        }

        // View toggle buttons
        const viewTableBtn = document.getElementById('view-table');
        if (viewTableBtn) {
            viewTableBtn.addEventListener('click', () => {
                if (this.viewMode !== 'table') {
                    this.viewMode = 'table';
                    this.render();
                }
            });
        }

        const viewGraphBtn = document.getElementById('view-graph');
        if (viewGraphBtn) {
            viewGraphBtn.addEventListener('click', () => {
                if (this.viewMode !== 'graph') {
                    this.viewMode = 'graph';
                    this.render();
                }
            });
        }

        // Table pagination (only in table view)
        if (this.viewMode === 'table') {
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
