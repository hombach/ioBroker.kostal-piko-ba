module.exports = {
	root: true, // Don't look outside this project for inherited configs
	parserOptions: {
		ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
	},
	extends: [
        "eslint:recommended",
        "plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
	],
	plugins: [],
    env: {
        "es6": true,
        "node": true,
        "mocha": true
    },
	rules: {
        "indent": [
            "error",
            4,
            {
                "SwitchCase": 1
            }
        ],
        "no-console": "off",
        "quotes": [
            "error",
            "single",
            {
                "avoidEscape": true,
                "allowTemplateLiterals": true
            }
        ],
        "semi": [
            "error",
            "always"
        ],
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
}