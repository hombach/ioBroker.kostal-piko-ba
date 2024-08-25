const globals = require("globals");
const js = require("@eslint/js");

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
	...compat.extends("eslint:recommended", "plugin:prettier/recommended"),
	{
		plugins: {},
		languageOptions: {
			globals: {
				...globals.node,
				...globals.mocha,
			},
			// parser: "@typescript-eslint/parser",
			ecmaVersion: 2022,
			sourceType: "commonjs",
			//sourceType: "module",
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
