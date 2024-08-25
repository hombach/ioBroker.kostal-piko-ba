const globals = require("globals");
const js = require("@eslint/js");

const {
    FlatCompat,
} = require("@eslint/eslintrc");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

module.exports = [{
    ignores: ["**/build/", "**/.prettierrc.js", "**/.eslintrc.js"],
}, ...compat.extends("eslint:recommended", "plugin:prettier/recommended"), {
    plugins: {},

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.mocha,
        },

        ecmaVersion: 2022,
        sourceType: "commonjs",
    },

    rules: {
        indent: ["error", 4, {
            SwitchCase: 1,
        }],

        "no-console": "off",

        quotes: ["error", "single", {
            avoidEscape: true,
            allowTemplateLiterals: true,
        }],

        semi: ["error", "always"],

        "prettier/prettier": ["error", {
            endOfLine: "auto",
        }],

        "no-var": "error",
        "prefer-const": "error",
        "no-trailing-spaces": "error",
    },
}];