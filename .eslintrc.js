module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint/eslint-plugin'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
    browser: true,
  },
  rules: {
    // Possible errors
    'no-template-curly-in-string': ['error'],

    // Best Practices
    curly: ['error'],
    'consistent-return': ['error'],
    'default-param-last': ['error'],
    'dot-notation': ['error'],
    eqeqeq: ['error'],
    'no-alert': ['error'],
    'no-empty-function': ['error', { allow: ['constructors'] }],
    'no-floating-decimal': ['error'],
    'no-invalid-this': ['error'],
    'no-labels': ['error'],
    'no-magic-numbers': ['warn'],
    'require-await': ['error'],
    'no-useless-return': ['error'],
    'no-useless-concat': ['error'],
    'no-unused-expressions': ['error'],
    'no-unmodified-loop-condition': ['error'],
    'no-throw-literal': ['error'],
    'no-sequences': ['error'],
    'no-self-compare': ['error'],

    // Variables
    'no-shadow': ['error'],

    // Stylistic
    'block-spacing': ['error'],
    'brace-style': ['error'],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': ['error'],
    'comma-style': ['error'],
    'object-curly-spacing': ['error', 'always'],
    indent: ['error', 2],
    'key-spacing': ['error'],
    'newline-per-chained-call': ['error'],
    'no-multiple-empty-lines': ['error'],
    'no-underscore-dangle': ['error'],
    'no-whitespace-before-property': ['error'],
    'object-property-newline': [
      'error',
      { allowMultiplePropertiesPerLine: true },
    ],
    'prefer-exponentiation-operator': ['warn'],
    quotes: ['error', 'single'],
    semi: ['error'],
    'semi-spacing': ['error'],
    'semi-style': ['error'],
    'space-before-blocks': ['error'],
    'space-before-function-paren': [
      'error',
      { anonymous: 'always', named: 'never', asyncArrow: 'always' },
    ],
    'space-in-parens': ['error'],
    'spaced-comment': ['error'],

    // ES6
    'arrow-body-style': ['error', 'always'],
    'no-confusing-arrow': ['error'],
    'no-duplicate-imports': ['error'],
    'no-var': ['error'],
    'prefer-arrow-callback': ['error'],
    'prefer-const': ['error'],
    'prefer-template': ['warn'],

    // Typescript
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/unbound-method': 'off',
  },
};
