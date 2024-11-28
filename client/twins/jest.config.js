module.exports = {
  testEnvironment: "jsdom",

  setupFilesAfterEnv : ["<rootDir>/setupTest.js"],

  verbose: true,

  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },

  moduleNameMapper: {

    "^@/(.*)$": "<rootDir>/src/$1",
    "^@components/(.*)$": "<rootDir>/src/components/$1",
    "^@context/(.*)$": "<rootDir>/src/context/$1",
    "^@app/(.*)$": "<rootDir>/src/app/$1",
    "^@api/(.*)$": "<rootDir>/src/api/$1",
  },

  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
};
