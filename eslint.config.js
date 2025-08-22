import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import perfectionist from 'eslint-plugin-perfectionist'
import { defineConfig, globalIgnores } from 'eslint/config'
import ts from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist']),
  stylistic.configs.customize({
    arrowParens: true,
    blockSpacing: true,
    braceStyle: '1tbs',
    commaDangle: 'always-multiline',
    indent: 2,
    quotes: 'single',
    semi: false,
  }),
  js.configs.recommended,
  ts.configs.eslintRecommended,
  ts.configs.recommended,
  {
    name: 'perfectionist',
    plugins: {
      perfectionist,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-useless-rename': 'error',
      'perfectionist/sort-exports': ['error', {
        order: 'asc',
        type: 'natural',
      }],
      'perfectionist/sort-imports': ['error', {
        order: 'asc',
        type: 'natural',
      }],
      'perfectionist/sort-named-exports': ['error', {
        order: 'asc',
        type: 'natural',
      }],
      'perfectionist/sort-named-imports': ['error', {
        order: 'asc',
        type: 'natural',
      }],
      'perfectionist/sort-objects': ['error', {
        order: 'asc',
        type: 'natural',
      }],
    },
  },
])
