import eslint from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginVue from 'eslint-plugin-vue';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import tseslint from 'typescript-eslint';
import vueParser from 'vue-eslint-parser';

const repoRoot = import.meta.dirname;

export default defineConfig([
  {
    ignores: ['eslint.config.mjs', '**/dist/**', '**/cache/**', '**/node_modules/**']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended.map(config => ({
    ...config,
    files: ['packages/api/**/*.{ts,tsx}']
  })),
  eslintPluginPrettierRecommended,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      },
      parserOptions: { tsconfigRootDir: repoRoot }
    }
  },

  {
    files: ['packages/api/**/*.{ts,tsx}'],
    languageOptions: {
      sourceType: 'commonjs',
      parserOptions: {
        project: path.join(repoRoot, 'packages', 'api', 'tsconfig.json'),
        tsconfigRootDir: path.join(repoRoot, 'packages', 'api')
      }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn'
    }
  },

  ...pluginVue.configs['flat/recommended'].map(config => ({
    ...config,
    files: ['packages/{app,docs}/**/*.vue']
  })),

  {
    files: ['packages/{app,docs}/**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        extraFileExtensions: ['.vue'],
        sourceType: 'module'
      }
    }
  },

  {
    files: ['packages/app/**/*.{js,cjs,mjs,jsx,vue}'],
    plugins: {
      vue: pluginVue
    },
    languageOptions: {
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'vue/attribute-hyphenation': 'off',
      'vue/attributes-order': [
        'error',
        {
          order: [
            'DEFINITION',
            'LIST_RENDERING',
            'CONDITIONALS',
            'RENDER_MODIFIERS',
            'GLOBAL',
            'UNIQUE',
            'TWO_WAY_BINDING',
            'OTHER_DIRECTIVES',
            'OTHER_ATTR',
            'EVENTS',
            'CONTENT'
          ],
          alphabetical: true
        }
      ],
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off'
    }
  },

  {
    files: ['packages/docs/**/*.{js,cjs,mjs,jsx,vue}'],
    plugins: {
      vue: pluginVue
    },
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser
      }
    },
    rules: {
      'vue/attribute-hyphenation': 'off',
      'vue/attributes-order': 'off',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off'
    }
  },

  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': ['error', { endOfLine: 'auto' }]
    }
  },
  {
    files: ['packages/{app,docs}/**/*.vue'],
    plugins: {
      vue: pluginVue
    },
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  },
  prettierConfig
]);
