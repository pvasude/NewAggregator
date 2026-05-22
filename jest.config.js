/** @type {import('jest').Config} */
module.exports = {
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  forceExit: true,
  globalSetup: '<rootDir>/jest.global-setup.js',
  setupFiles: ['<rootDir>/jest.setup-env.js'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: [
    '<rootDir>/prisma/__tests__/**/*.test.ts',
    '<rootDir>/lib/__tests__/**/*.test.ts',
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: '<rootDir>/tsconfig.test.json',
      },
    ],
  },
  // Map bare .js relative imports to their actual .ts sources (ESM interop)
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
