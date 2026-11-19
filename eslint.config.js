const js = require("@eslint/js");

module.exports = [
  {
    ignores: ["node_modules/**", "package-lock.json"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "readonly",
        process: "readonly",
        console: "readonly",
        __dirname: "readonly",
      },
    },
  },
];
