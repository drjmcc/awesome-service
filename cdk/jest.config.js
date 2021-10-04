module.exports = {
  roots: ["<rootDir>"],
  testMatch: ["**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  setupFiles: ["<rootDir>/.jest/setEnvVars.js"]
};
