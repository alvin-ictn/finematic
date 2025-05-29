export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    // "^.+\\.tsx?$": "ts-jest",
    "^.+\\.[t|j]sx?$": [
      "ts-jest",
      {
        babelConfig: true,
        useESM: true,
      },
      {
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: "node_modules/ts-jest-mock-import-meta",
              options: {
                metaObjectReplacement: {
                  env: {
                    VITE_API_PATH: "http://localhost:3001",
                  },
                },
              },
            },
          ],
        },
      },
    ],
  },

  moduleNameMapper: {
    "src/constants": "<rootDir>/src/__mocks__/constant.ts",
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^.+\\.svg$": "jest-transformer-svg",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
