import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

export default createJestConfig({
  testEnvironment: "node", // tes tests visent surtout du code serveur
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // tes alias @/...
    "^server-only$": "<rootDir>/test/mocks/server-only.ts", // voir plus bas
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
});