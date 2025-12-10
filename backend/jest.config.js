export default {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: ["controllers/**/*.js", "!**/__tests__/**"],
  testMatch: ["**/__tests__/controllers/**/*.test.js"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  testTimeout: 10000,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
};
