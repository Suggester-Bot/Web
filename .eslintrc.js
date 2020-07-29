module.exports = {
	parser: "babel-eslint",
	env: {
		"browser": true,
		"es2020": true,
		"node": true
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
	settings: { react: { version: "detect" } },
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:jsx-a11y/recommended"
	],
	rules: {
		"indent": ["error", "tab", { SwitchCase: 1 }],
		"quotes": ["error", "double"],
		"semi": ["error", "always"]
	}
};
