import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : 2, // Limit workers for better resource usage
    reporter: process.env.CI ? 'github' : 'list', // Faster reporters
    timeout: 30000, // Reduce overall test timeout
    expect: {
        timeout: 15000, // Increased timeout to account for debounce + calculation
    },
    use: {
        baseURL: 'http://localhost:4173',
        trace: 'retain-on-failure', // Only trace on failure
        screenshot: 'only-on-failure', // Only screenshot on failure
        video: 'retain-on-failure', // Only video on failure
        // Performance optimizations
        navigationTimeout: 10000, // Faster navigation timeout
        actionTimeout: 15000, // Increased to match expect timeout
    },
    projects: [
        {
            name: 'chromium-desktop',
            use: {
                ...devices['Desktop Chrome'],
                hasTouch: true, // Support both desktop and mobile interactions
            },
        },
        // Only run mobile tests in CI or when specifically needed
        ...(process.env.CI || process.env.MOBILE_TESTS ? [{
            name: 'mobile-chrome',
            use: { ...devices['Pixel 5'] },
        }] : []),
    ],
    webServer: {
        command: 'npm run build && npm run preview',
        url: 'http://localhost:4173',
        reuseExistingServer: !process.env.CI,
        timeout: 60000, // Reduced timeout
        stdout: 'pipe', // Suppress server output
        stderr: 'pipe',
    },
});
