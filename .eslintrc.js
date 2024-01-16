/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
      'prettier',
      'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  rules: {
      'prettier/prettier': 'error',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error'],
  },
  plugins: ['prettier', '@typescript-eslint'],
};
