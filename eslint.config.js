import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

const reactRecommended = react.configs.flat.recommended;
const reactJsxRuntime = react.configs.flat['jsx-runtime'];
const hooksRecommended = reactHooks.configs.flat.recommended;
const refreshVite = reactRefresh.configs.vite;

export default [
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['scripts/**/*.mjs', 'vite.config.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.node,
      parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
    },
    rules: { ...js.configs.recommended.rules },
  },
  {
    files: ['src/**/*.{js,jsx}'],
    plugins: {
      ...reactRecommended.plugins,
      ...hooksRecommended.plugins,
      ...refreshVite.plugins,
    },
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.browser,
      parserOptions: { ecmaVersion: 'latest', ecmaFeatures: { jsx: true }, sourceType: 'module' },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...js.configs.recommended.rules,
      ...reactRecommended.rules,
      ...reactJsxRuntime.rules,
      ...hooksRecommended.rules,
      ...refreshVite.rules,
      'react/prop-types': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
