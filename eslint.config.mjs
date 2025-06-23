// eslint-disable-next-line
import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules, includeIgnoreFile } from '@eslint/compat';
import importPlugin from 'eslint-plugin-import';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import jsxA11YPlugin from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const rootPath = fileURLToPath(import.meta.url);
const rootDirectory = path.dirname(rootPath);
const compat = new FlatCompat({
  baseDirectory: rootDirectory,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
  includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
  globalIgnores(['**/node_modules/', '**/public/']),
  {
    extends: fixupConfigRules(
      compat.extends('airbnb', 'plugin:react-hooks/recommended', 'prettier')
    ),

    plugins: {
      import: fixupPluginRules(importPlugin),
      'simple-import-sort': simpleImportSortPlugin,
      prettier: prettierPlugin,
      reactPlugin,
      jsxA11YPlugin
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },

      ecmaVersion: 2020,
      sourceType: 'module'
    },

    settings: {
      react: {
        version: 'detect'
      },

      'import/resolver': {
        node: {
          'babel-module': {},
          paths: ['src']
        }
      }
    },

    rules: {
      strict: 0,

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true
        }
      ],

      'import/prefer-default-export': 'off',
      'import/order': 'off',
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)'
            ],
            ['^react', '^@?\\w'],
            ['^(@|@company|@ui|components|utils|config|vendored-lib)(/.*|$)'],
            ['^\\u0000'],
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            ['^.+\\.s?css$']
          ]
        }
      ],

      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: false
        }
      ],

      'simple-import-sort/exports': 'error',
      'sort-imports': 'off',
      'no-unused-vars': ['warn'],
      'no-useless-escape': ['warn'],
      camelcase: 'off',
      'no-use-before-define': 'off',
      'global-require': [0],
      'prettier/prettier': ['error'],

      'jsx-a11y/label-has-associated-control': [
        2,
        {
          labelAttributes: ['label'],
          assert: 'htmlFor',
          depth: 3
        }
      ],

      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function'
        }
      ],

      'react/react-in-jsx-scope': 'off',

      'react/jsx-filename-extension': [
        1,
        {
          extensions: ['.js', '.jsx']
        }
      ],

      'react/prefer-stateless-function': [0],
      'react/jsx-indent': [0],
      'react/sort-comp': [0],
      'react/destructuring-assignment': [0],
      'react/forbid-prop-types': [0],
      'react/prop-types': [0],
      'react/jsx-props-no-spreading': [1],

      'react/no-unescaped-entities': [
        'error',
        {
          forbid: ['>', '}']
        }
      ],

      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message:
            'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.'
        },
        {
          selector: 'LabeledStatement',
          message:
            'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.'
        },
        {
          selector: 'WithStatement',
          message:
            '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.'
        }
      ]
    }
  }
]);
