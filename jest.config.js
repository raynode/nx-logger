module.exports = {
  testEnvironment: 'node',
  transform: {
    '.tsx?': 'ts-jest'
  },
  clearMocks: true,
  bail: true,
  modulePaths: [
    'src',
    'node_modules',
  ],
  moduleDirectories: [
    'node_modules',
    '<rootDir>/src',
  ],
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
  ],
  testRegex: '/lib/.*\\.spec\\.[tj]sx?$',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'lib/**/*.{ts,tsx}',
    '!lib/types.ts',
  ],
  "coveragePathIgnorePatterns": [".*\\.d\\.ts", "<rootDir>/node_modules/"],
}
