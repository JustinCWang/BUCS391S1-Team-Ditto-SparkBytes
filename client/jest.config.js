module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
      // Handle CSS and image imports
      '\\.(css|scss|sass)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|svg)$': '<rootDir>/__mocks__/fileMock.js',
      // Match your Next.js `@/` alias
      '^@/(.*)$': '<rootDir>/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
    collectCoverage: true,
    collectCoverageFrom: [
      'app/**/*.{ts,tsx}',
      'component/**/*.{ts,tsx}',
      '!**/*.d.ts',
      '!app/**/layout.tsx',
    ],
  };
  