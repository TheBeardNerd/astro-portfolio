import js from '@eslint/js'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintPluginAstro from 'eslint-plugin-astro'

export default defineConfig([
  globalIgnores([
    'dist/',
    '.astro/',
    'node_modules/',
    '.agents/',
    '.claude/',
    '.worktrees/',
  ]),
  {
    files: ['**/*.{js,mjs,cjs}'],
    ...js.configs.recommended,
  },
  ...eslintPluginAstro.configs.recommended,
])
