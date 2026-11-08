module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  rules: {
    // Public ComponentRegistry/types intentionally use any for heterogeneous component props; tightening is an API-reviewed change.
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
