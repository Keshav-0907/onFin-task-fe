import { defineConfig } from 'eslint-define-config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: globals.node,
    },
    plugins: {
      js,
      react: pluginReact,
    },
    rules: {
      'react/prop-types': 'off', // 🔁 place it before react config is applied
    },
    extends: ['js/recommended'],
  },

  tseslint.configs.recommended,

  {
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      react: pluginReact,
    },
    ...pluginReact.configs.flat.recommended,
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      'react/prop-types': 'off', // ✅ override AFTER spreading react recommended
    },
  },
]);
