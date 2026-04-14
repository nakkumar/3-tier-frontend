// src/setupTests.ts
import '@testing-library/jest-dom';

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Suppress console errors during tests (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});