/**
 * Main entry point for the mortgage calculator application
 */

import './styles/main.css';
import './styles/themes.css';
import './styles/responsive.css';

import storageService from './services/storage.js';
import eventBus, { EVENTS } from './utils/eventBus.js';
import logger from './utils/logger.js';
import CalculatorModern from './components/CalculatorModern.js';
// Comparison and prepayment are now integrated into CalculatorModern
import { AmortizationSchedule } from './components/AmortizationSchedule.js';
import InfoModal from './components/InfoModal.js';
// MortgageScenario is handled internally by components

// Global app state
const app = {
    calculator: null,
    // Comparison table is integrated into CalculatorModern
    amortizationSchedule: null,
    infoModal: null,
};

// Initialize theme
function initializeTheme() {
    const preferences = storageService.getPreferences();
    const theme = preferences.theme || 'system';

    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    }

    // Theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            const newTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
            storageService.savePreferences({ ...preferences, theme: newTheme });
            eventBus.emit(EVENTS.THEME_CHANGED, newTheme);
        });
    }

    // Info button
    const infoButton = document.getElementById('info-button');
    if (infoButton) {
        infoButton.addEventListener('click', () => {
            if (app.infoModal) {
                app.infoModal.open();
            }
        });
    }
}

// Setup event listeners for component interactions
function setupEventListeners() {
    // CalculatorModern handles its own comparison and schedule buttons

    // Error handling
    eventBus.on(EVENTS.ERROR_OCCURRED, (error) => {
        showNotification(error.message || 'An error occurred', 'error');
    });

    // Notification handling
    eventBus.on(EVENTS.NOTIFICATION, (data) => {
        showNotification(data.message, data.type || 'info');
    });

    // Schedule show event
    eventBus.on('schedule:show', (data) => {
        if (app.amortizationSchedule) {
            app.amortizationSchedule.show(data);
            document.getElementById('amortization-container')?.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Show notification toast with stacking
let activeNotifications = [];

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const notificationId = Date.now();

    // More subtle, seamless color scheme
    const typeClasses = {
        success: 'bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border border-gray-700 dark:border-gray-300',
        error: 'bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100 border border-red-200 dark:border-red-800',
        info: 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
    };

    notification.className = `fixed right-4 z-50 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm animate-fade-in ${typeClasses[type] || typeClasses.info}`;
    notification.dataset.notificationId = notificationId;

    // Calculate position based on existing notifications
    const existingCount = activeNotifications.length;
    const topOffset = 16 + (existingCount * 76); // 16px base + 76px per notification
    notification.style.top = `${topOffset}px`;
    notification.style.transition = 'all 0.3s ease-out';

    // Add icon and message
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };

    notification.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="text-lg">${icons[type] || icons.info}</span>
            <span class="text-sm font-medium">${message}</span>
        </div>
    `;

    document.body.appendChild(notification);
    activeNotifications.push(notificationId);

    // Smooth fade out animation
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(-10px)';

        setTimeout(() => {
            notification.remove();
            // Remove from active notifications
            activeNotifications = activeNotifications.filter(id => id !== notificationId);
            // Reposition remaining notifications
            repositionNotifications();
        }, 300);
    }, 2700);
}

function repositionNotifications() {
    const notifications = document.querySelectorAll('[data-notification-id]');
    notifications.forEach((notif, index) => {
        const topOffset = 16 + (index * 76);
        notif.style.top = `${topOffset}px`;
    });
}

// Create amortization container if it doesn't exist
function ensureContainers() {
    const main = document.querySelector('main');
    if (main && !document.getElementById('amortization-container')) {
        const container = document.createElement('div');
        container.id = 'amortization-container';
        main.appendChild(container);
    }
}

// Initialize application
function init() {
    logger.info('Initializing Canadian Mortgage Calculator');

    initializeTheme();
    ensureContainers();

    // Load saved preferences
    const preferences = storageService.getPreferences();
    logger.debug('Loaded preferences', preferences);

    // Initialize components
    app.calculator = new CalculatorModern('calculator-container');
    logger.info('Modern calculator component initialized');

    // Comparison table is now integrated into the modern calculator
    // app.comparisonTable = new ComparisonTableComponent('comparison-container');
    // logger.info('Comparison table initialized');

    app.amortizationSchedule = new AmortizationSchedule('amortization-container');
    logger.info('Amortization schedule initialized');

    // Initialize info modal
    app.infoModal = new InfoModal();
    logger.info('Info modal initialized');

    // Setup event listeners
    setupEventListeners();

    // Load and display version info in footer
    loadVersionInfo();

    logger.info('Application initialized successfully');
}

// Load and display version information in footer
async function loadVersionInfo() {
    try {
        // Use base path for GitHub Pages deployment
        const basePath = import.meta.env.BASE_URL || '/';
        const versionPath = `${basePath}version.json`.replace(/\/\//g, '/');
        const response = await fetch(versionPath);
        if (response.ok) {
            const versionInfo = await response.json();
            updateFooterWithVersion(versionInfo);
        } else {
            throw new Error('Version file not found');
        }
    } catch (error) {
        logger.debug('Could not load version info', error);
        // Try to get basic info from environment or fallback
        updateFooterWithVersion({
            version: 'dev',
            buildTimeLocal: new Date().toLocaleString()
        });
    }
}

function updateFooterWithVersion(info) {
    const footer = document.querySelector('footer');
    if (!footer) return;

    // Find or create version info paragraph
    let versionPara = footer.querySelector('.version-info');
    if (!versionPara) {
        versionPara = document.createElement('p');
        versionPara.className = 'version-info text-center text-xs text-gray-400 dark:text-gray-500 mt-2';
        footer.querySelector('.max-w-7xl').appendChild(versionPara);
    }

    const parts = [];
    if (info.version && info.version !== 'unknown') {
        // Show release version prominently if it's a release
        if (info.isRelease) {
            parts.push(`Release: ${info.version}`);
        } else {
            // For dev builds, show as version
            parts.push(`Version: ${info.version}`);
        }
    }
    if (info.buildTimeLocal) {
        parts.push(`Deployed: ${info.buildTimeLocal}`);
    }

    if (parts.length > 0) {
        versionPara.textContent = parts.join(' • ');
    }
}

// Start the application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for testing
export { init };

