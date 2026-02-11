const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  env: {
    browser: true,
    node: true,
  },

  parser: "@typescript-eslint/parser",

  parserOptions: {
    project,
  },

  plugins: ["@typescript-eslint", "only-warn"],

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    require.resolve("@vercel/style-guide/eslint/next"),
    "turbo",
  ],

  globals: {
    React: true,
    JSX: true,
  },

  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },

  ignorePatterns: ["*.js", "node_modules/"],

  rules: {
    // Disable JS rules
    "no-unused-vars": "off",
    "no-undef": "off",
    "no-redeclare": "off",

    // Enable TS rules
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

    "@typescript-eslint/no-redeclare": [
      "warn",
      { ignoreDeclarationMerge: true },
    ],
  },

  overrides: [{ files: ["*.js?(x)", "*.ts?(x)"] }],
};
