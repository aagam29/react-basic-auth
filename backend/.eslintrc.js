module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/extensions': ['never'],
    'no-console': 'off',
    'object-curly-newline': ['error',
    { ObjectExpression: { multiline: true, minProperties: 3 } },
    { ObjectPattern: { multiline: true, minProperties: 3 } },
    ],
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
  },
};
