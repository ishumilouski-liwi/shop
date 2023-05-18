/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "@libs/(.*)": "<rootDir>/src/libs/$1",
    "@services/(.*)": "<rootDir>/src/services/$1",
    "@services": "<rootDir>/src/services",
    "@models/(.*)": "<rootDir>/src/models/$1",
  },
};
