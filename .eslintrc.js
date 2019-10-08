module.exports = {
    parser: "@typescript-eslint/parser",
    extends: ["eslint:recommended"],
    plugins: ["@typescript-eslint"],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
    },
    env: {
        browser: true,
        es6: true,
        jest: true,
        node: true
    },
    rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error",
        "quotes": ["error", "double", "avoid-escape"],
        "no-console": ["error"],
        "eqeqeq": ["error", "always"],
        "semi": ["error", "always"],
        "eol-last": ["error", "always"],
        "indent": ["error", 4],
        "no-var": ["error"],
        "prefer-const": ["error"],
        "comma-dangle": ["error", "always-multiline"],
        "object-curly-newline": ["error", {
            "ObjectExpression": "always",
            "ObjectPattern": { "multiline": true },
            "ImportDeclaration": "never",
            "ExportDeclaration": { "multiline": true, "minProperties": 3 }
        }]
    },
}
