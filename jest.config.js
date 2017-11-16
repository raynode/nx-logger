module.exports = {
  testEnvironment: 'node',
  transform: {
    '.(ts|tsx)': '<rootDir>/node_modules/ts-jest/preprocessor.js'
  },
  clearMocks: true,
  bail: true,
  mapCoverage: true,
  modulePaths: [
    "src",
    "node_modules"
  ],
  moduleDirectories: [
    "node_modules",
    "<rootDir>/src"
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx'
  ],
  // setupFiles: [ "<rootDir>/mocks/index.ts" ],
  testRegex: '/lib/.*\.spec\.[tj]sx?$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}'
  ],
}
