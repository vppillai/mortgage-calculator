// Vitest setup file
import { beforeAll, afterEach, afterAll } from 'vitest';

beforeAll(() => {
    // Setup before all tests
});

afterEach(() => {
    // Cleanup after each test
    localStorage.clear();
});

afterAll(() => {
    // Cleanup after all tests
});

