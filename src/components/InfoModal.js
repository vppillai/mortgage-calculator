/**
 * Info Modal Component
 * Displays calculation methodology and disclaimer
 */

export class InfoModal {
    constructor() {
        this.modalId = 'info-modal';
        this.isOpen = false;
        this.render();
        this.attachEventListeners();
    }

    render() {
        const modal = document.createElement('div');
        modal.id = this.modalId;
        modal.className = 'fixed inset-0 z-50 hidden';
        modal.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" id="modal-backdrop"></div>
            <div class="fixed inset-0 z-10 overflow-y-auto">
                <div class="flex min-h-full items-center justify-center p-4">
                    <div class="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl">
                        <div class="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div class="sm:flex sm:items-start">
                                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                                    <h3 class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white mb-4">
                                        How This Calculator Works
                                    </h3>
                                    
                                    <div class="mt-4 space-y-6 text-sm text-gray-700 dark:text-gray-300">
                                        <section>
                                            <h4 class="font-semibold text-lg mb-2 text-gray-900 dark:text-white">📊 Calculation Method</h4>
                                            <p class="mb-3">This calculator uses the standard mortgage payment formula:</p>
                                            <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                                                PMT = P × [r(1 + r)ⁿ] / [(1 + r)ⁿ - 1]
                                            </div>
                                            <ul class="mt-3 space-y-2 ml-4">
                                                <li>• PMT = Regular payment amount</li>
                                                <li>• P = Principal loan amount</li>
                                                <li>• r = Interest rate per payment period</li>
                                                <li>• n = Total number of payments</li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h4 class="font-semibold text-lg mb-2 text-gray-900 dark:text-white">🏦 Interest Compounding</h4>
                                            <p>By default, this calculator uses <strong>semi-annual compounding</strong>, which is standard in Canada. The interest rate is compounded twice per year and then converted to the payment frequency you select.</p>
                                            <p class="mt-2">For other regions, you may need to adjust calculations based on local standards (e.g., monthly compounding in the US).</p>
                                        </section>

                                        <section>
                                            <h4 class="font-semibold text-lg mb-2 text-gray-900 dark:text-white">💰 Prepayment Calculations</h4>
                                            <p>When you add extra payments:</p>
                                            <ul class="mt-2 space-y-1 ml-4">
                                                <li>• Extra payments go directly to principal reduction</li>
                                                <li>• Interest is recalculated on the reduced balance</li>
                                                <li>• This can significantly reduce total interest and loan duration</li>
                                                <li>• The calculator shows exact savings in time and money</li>
                                            </ul>
                                        </section>

                                        <section>
                                            <h4 class="font-semibold text-lg mb-2 text-gray-900 dark:text-white">🔗 Shareable Links</h4>
                                            <p>You can share your comparison scenarios with others. The share feature:</p>
                                            <ul class="mt-2 space-y-1 ml-4">
                                                <li>• Encodes all scenario data in the URL</li>
                                                <li>• No data is stored on any server</li>
                                                <li>• Links work instantly without any backend</li>
                                                <li>• Data is compressed to keep URLs manageable</li>
                                            </ul>
                                        </section>

                                        <section class="border-t pt-4 dark:border-gray-700">
                                            <h4 class="font-semibold text-lg mb-2 text-red-600 dark:text-red-400">⚠️ Important Disclaimer</h4>
                                            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                                <p class="font-semibold mb-2">This calculator is for educational and informational purposes only.</p>
                                                <ul class="space-y-2 text-sm">
                                                    <li>• Results are estimates based on the inputs provided</li>
                                                    <li>• Actual payments may vary due to fees, insurance, or other factors</li>
                                                    <li>• Does not include property taxes, insurance, or other costs</li>
                                                    <li>• Not financial advice - consult with qualified professionals</li>
                                                    <li>• Verify all calculations with your lender before making decisions</li>
                                                </ul>
                                            </div>
                                        </section>

                                        <section>
                                            <h4 class="font-semibold text-lg mb-2 text-gray-900 dark:text-white">🌍 Regional Differences</h4>
                                            <p>Mortgage calculations can vary by country:</p>
                                            <ul class="mt-2 space-y-1 ml-4 text-sm">
                                                <li>• <strong>Canada:</strong> Semi-annual compounding (default)</li>
                                                <li>• <strong>United States:</strong> Monthly compounding</li>
                                                <li>• <strong>UK/Australia:</strong> Daily/Monthly compounding</li>
                                                <li>• <strong>Fixed vs Variable:</strong> This calculator assumes fixed rates</li>
                                            </ul>
                                        </section>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button type="button" id="close-info-modal" class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 sm:ml-3 sm:w-auto">
                                Got it!
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    attachEventListeners() {
        const closeBtn = document.getElementById('close-info-modal');
        const backdrop = document.getElementById('modal-backdrop');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        if (backdrop) {
            backdrop.addEventListener('click', () => this.close());
        }

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.classList.remove('hidden');
            this.isOpen = true;
            document.body.style.overflow = 'hidden';
        }
    }

    close() {
        const modal = document.getElementById(this.modalId);
        if (modal) {
            modal.classList.add('hidden');
            this.isOpen = false;
            document.body.style.overflow = '';
        }
    }
}

export default InfoModal;
