const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,

  env: {
    node: true,
    browser: true,
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

  ignorePatterns: [".*.js", "node_modules/", "dist/"],

  rules: {
    // Kill JS rules (they break TS)
    "no-unused-vars": "off",
    "no-undef": "off",
    "no-redeclare": "off",

    // Use TS-aware ones
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],

    "@typescript-eslint/no-redeclare": [
      "warn",
      { ignoreDeclarationMerge: true },
    ],
  },

  overrides: [
    {
      files: ["*.js?(x)", "*.ts?(x)"],
    },
  ],
};
