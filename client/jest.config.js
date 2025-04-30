module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: { '^.+\\.(ts|tsx)$': 'ts-jest',        
        '^.+\\.(js|jsx)$': 'babel-jest',},     
    moduleNameMapper: {
      // CSS & static assets
      '\\.(css|scss|sass)$': 'identity-obj-proxy',
      '\\.(jpg|jpeg|png|svg|gif|eot|otf|webp|ttf|woff|woff2)$': '<rootDir>/__mocks__/fileMock.js',
  
      // If you mock Next.js internals
      '^next/(.*)$': '<rootDir>/__mocks__/next-$1.js',
  
      // 🔑 Map @/ to the src folder
      '^@/(.*)$': '<rootDir>/src/$1',
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
    collectCoverage: true,
    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      'component/**/*.{ts,tsx}',
      '!**/*.d.ts',
      '!src/**/layout.tsx',
    ],
    testMatch: [
      '<rootDir>/__tests__/**/*.(test|spec).{ts,tsx}',
      '<rootDir>/**/*.(test|spec).{ts,tsx}',
    ],
  };
  