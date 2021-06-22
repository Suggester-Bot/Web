module.exports = {
	env: {
		browser: true,
		es2020: true,
		node: true
	},
	plugins: [
		"react",
		"react-hooks",
		"import",
		"jsx-a11y"
	],
	parserOptions: {
		ecmaFeatures: { jsx: true },
		project: "./tsconfig.json",
		ecmaVersion: 11,
		sourceType: "module"
	},
	settings: {
		"react": { version: "detect" },
		"import/resolver": "webpack"
	},
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:jsx-a11y/recommended"
	],
	overrides: [
		{
			files: ["*.ts", "*.tsx"],
			parser: "@typescript-eslint/parser",
			extends: [
				"plugin:@typescript-eslint/recommended",
				"plugin:@typescript-eslint/recommended-requiring-type-checking",
				"plugin:import/typescript"
			],
			rules: {
				"@typescript-eslint/explicit-module-boundary-types": "off"
			}
		}
	],
	rules: {
		"indent": ["error", "tab", { SwitchCase: 1 }],
		"quotes": ["error", "double"],
		"semi": ["error", "always"],

		"react/prop-types": "off",
		"react/react-in-jsx-scope": "off"
	}
};
