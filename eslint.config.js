import globals from 'globals'
import fs from 'node:fs'
import path from 'node:path'
import js from '@eslint/js'
import vueParser from 'vue-eslint-parser'
import eslintVue from 'eslint-plugin-vue'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'screenShoot.js',
      '.eslintrc-auto-import.json',
      'eslint.config.js',
      'auto-imports.d.ts'
    ]
  },
  js.configs.recommended, // ESLint推荐规则
  eslintConfigPrettier, // 关闭与Prettier冲突的规则
  {
    files: ['**/*.{js,mjs,cjs,jsx,ts,tsx,vue}'],
    languageOptions: {
      ecmaVersion: 'latest', // 使用最新ECMAScript标准
      sourceType: 'module', // 强制模块化语法
      globals: (() => {
        const base = { ...globals.browser }
        try {
          const autoPath = path.resolve(process.cwd(), '.eslintrc-auto-import.json')
          if (fs.existsSync(autoPath)) {
            const json = JSON.parse(fs.readFileSync(autoPath, 'utf8'))
            if (json && typeof json.globals === 'object') {
              return { ...base, ...json.globals }
            }
          }
        } catch {}
        return base
      })()
    },
    plugins: { prettier },
    rules: {
      // 关闭引号类型检查
      // quotes: ['off', 'single'],
      'prettier/prettier': 'error'
    }
  },
  {
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      parser: tsParser, // 使用TS解析器
      parserOptions: {
        project: './tsconfig.json',
        extraFileExtensions: ['.vue']
      }
    },
    plugins: { '@typescript-eslint': tseslint },
    rules: tseslint.configs.recommended.rules
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        sourceType: 'module'
      }
    },
    plugins: { vue: eslintVue },
    rules: {
      ...eslintVue.configs['vue3-essential']?.rules,
      'no-debugger': 'off',
      'no-unused-vars': 'warn'
    }
  }
]
