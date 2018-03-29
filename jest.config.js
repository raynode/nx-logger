module.exports = {
  testEnvironment: 'node',
  transform: {
    '.(ts|tsx)': '<rootDir>/node_modules/ts-jest/preprocessor.js'
  },
  clearMocks: true,
  bail: true,
  modulePaths: [
    'src',
    'node_modules'
  ],
  moduleDirectories: [
    'node_modules',
    '<rootDir>/src'
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx'
  ],
  testRegex: '/lib/.*\.spec\.[tj]sx?$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx,js,jsx}'
  ],
}
