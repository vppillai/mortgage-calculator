import { defineConfig, devices } from '@playwright/test';

/**
 * Fast development configuration for E2E tests
 * Use: npm run test:e2e:dev
 */
export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: false,
    retries: 0,
    workers: 1, // Single worker for faster startup
    reporter: 'list',
    timeout: 15000, // Shorter timeout for dev
    expect: {
        timeout: 3000,
    },
    use: {
        baseURL: 'http://localhost:4173',
        trace: 'off', // No tracing in dev
        screenshot: 'off', // No screenshots in dev
        video: 'off', // No video in dev
        navigationTimeout: 5000,
        actionTimeout: 3000,
    },
    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                hasTouch: true,
            },
        },
    ],
    webServer: {
        command: 'npm run preview', // Skip build in dev mode
        url: 'http://localhost:4173',
        reuseExistingServer: true, // Always reuse in dev
        timeout: 30000,
        stdout: 'pipe',
        stderr: 'pipe',
    },
});