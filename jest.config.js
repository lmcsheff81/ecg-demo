export default {
  testEnvironment: "jsdom",
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transform: {
    "^.+\\.(ts|tsx|js)$": "babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
