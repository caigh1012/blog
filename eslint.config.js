const jsEsint = require('@eslint/js');
const globals = require('globals');
const tseslint = require('typescript-eslint');
const importPlugin = require('eslint-plugin-import');

module.exports = [
  {
    ignores: ['node_modules', 'dist', 'docs/.vitepress/cache'], // 忽略目录
  },
  {
    files: ['*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
    plugins: {
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      ...jsEsint.configs.recommended.rules,
      'prettier/prettier': 'error',
      'no-console': 'error',
    },
  },
  {
    files: ['docs/**/*.{ts,mts}'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      sourceType: 'module',
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    linterOptions: {
      noInlineConfig: false,
    },
    plugins: {
      prettier: require('eslint-plugin-prettier'),
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      import: importPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'prettier/prettier': 'error',
      'no-console': 'error',
    },
  },
];
