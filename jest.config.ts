import nextJest from "next/jest.js"

const createJestConfig = nextJest({ dir: "./" })

const config = createJestConfig({
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setup-tests.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["<rootDir>/tests/**/*.test.ts", "<rootDir>/tests/**/*.test.tsx"],
})

export default config
