module.exports = {
  parser: '@babel/eslint-parser',
  plugins: ['react', 'import', 'unused-imports'],
  root: true,
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    allowImportExportEverywhere: true,
    babelOptions: {
      plugins: [],
      presets: ['@babel/preset-react'],
    },
    requireConfigFile: false,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      'babel-module': {},
    },
  },
  overrides: [
    {
      files: ['src/**/*.js'],
    },
  ],
  rules: {
    'no-empty': ['error', {allowEmptyCatch: true}],
    'no-unused-vars': 1,
    'react/no-deprecated': 2,
    'react/no-did-update-set-state': 2,
    'react/no-did-mount-set-state': 2,
    'react/no-will-update-set-state': 2,
    'react/no-direct-mutation-state': 2,
    'react/no-unused-class-component-methods': 1,
    'react/no-unused-state': 2,
    'react/jsx-key': 2,
    'react/prop-types': 0,
    'require-await': 0,
    'array-callback-return': 2,
    'no-await-in-loop': 2,
    'no-constructor-return': 2,
    'no-duplicate-imports': 2,
    'no-unreachable-loop': 2,
    'require-atomic-updates': 2,
    'no-useless-escape': 0,
    'unused-imports/no-unused-imports': 1,
    'react/display-name': 0,
  },
};
