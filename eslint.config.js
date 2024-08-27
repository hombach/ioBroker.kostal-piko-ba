const globals = require("globals");
const js = require("@eslint/js");
const typescript = require("@typescript-eslint/eslint-plugin");

const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

module.exports = [
	{
		files: ["**/*.ts", "**/*.tsx"],
	},
	{
		ignores: ["**/build/", "**/.prettierrc.js"],
	},
	...compat.extends("eslint:recommended", "plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"),

	{
		parser: "@typescript-eslint/parser",
	},

	{
		plugins: {},
		languageOptions: {
			globals: {
				...globals.node,
				...globals.mocha,
			},
			ecmaVersion: 2022,
			sourceType: "module",
		},

		rules: {
			indent: [
				"error",
				"tab",
				{
					SwitchCase: 1,
				},
			],
			"no-console": "off",
			quotes: [
				"error",
				"double",
				{
					avoidEscape: true,
					allowTemplateLiterals: true,
				},
			],
			semi: ["error", "always"],
			"prettier/prettier": [
				"error",
				{
					endOfLine: "auto",
				},
			],
			"no-var": "error",
			"prefer-const": "error",
			"no-trailing-spaces": "error",
		},
	},
];
