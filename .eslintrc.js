const prettierCfg = require('./.prettierrc.js');

module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  overrides: [
    {
      env: {
        node: true,
      },
      extends: ['eslint:recommended'],
      files: ['.eslintrc.{js,cjs}', 'babel.config.js'],
      parserOptions: {
        sourceType: 'script',
      },
    },
    {
      files: ['./src/**/*.{tsx,ts}', 'docusaurus.config.ts', 'sidebars.ts'],
      plugins: ['@typescript-eslint', 'react', 'react-hooks', 'jsx-a11y'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:react/recommended',
      ],
      rules: {
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'error',
        'react/prop-types': [
          0,
          {
            ignore: [],
            customValidators: [],
            skipUndeclared: false,
          },
        ],
      },
    },
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', prettierCfg],
    'no-console': 'error',
  },
};
