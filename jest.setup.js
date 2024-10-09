// jest.setup.js
global.console = {
    ...console,
    error: jest.fn(), // Suppress console.error messages during tests
  };
  