module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    moduleNameMapper: {
      '^@/components/(.*)$': '<rootDir>/app/components/$1',
      '^@/utils/(.*)$': '<rootDir>/app/utils/$1'
    },
    collectCoverageFrom: [
      'app/**/*.{js,jsx,ts,tsx}',
      '!app/**/*.d.ts',
      '!app/**/_*.{js,jsx,ts,tsx}'
    ]
  };