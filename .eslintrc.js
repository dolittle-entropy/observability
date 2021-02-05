/* eslint-env node */
module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
    ],
    plugins: [
        'react-hooks',
    ],
    rules: {
        'react-hooks/rules-of-hooks': 'error',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    env: {
        browser: true,
    },
};
