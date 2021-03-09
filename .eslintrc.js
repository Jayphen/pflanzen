module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  overrides: [
    // this stays the same
    {
      files: ["*.svelte"],
      processor: "svelte3/svelte3",
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["svelte3", "@typescript-eslint"],
  rules: {},
  settings: {
    "svelte3/typescript": require("typescript"), // pass the TypeScript package to the Svelte plugin
    // ...
  },
};
