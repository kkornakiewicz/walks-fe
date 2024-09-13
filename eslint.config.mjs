// Import necessary parsers and plugins
import typescriptParser from "@typescript-eslint/parser"
import eslintPlugin from "@typescript-eslint/eslint-plugin"
import importPlugin from "eslint-plugin-import"
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort"
import prettierConfig from "eslint-config-prettier"
import prettierPlugin from "eslint-plugin-prettier"

export default [
	{
		files: ["**/*.ts", "**/*.tsx"],

		languageOptions: {
			parser: typescriptParser, // Full TypeScript parser module
			ecmaVersion: "latest",
			sourceType: "module",
		},

		plugins: {
			"@typescript-eslint": eslintPlugin,
			import: importPlugin,
			"simple-import-sort": simpleImportSortPlugin,
			prettier: prettierPlugin,
		},

		// Extends Prettier config to disable ESLint formatting rules that conflict
		// with Prettier and enforces Prettier formatting rules
		settings: {
			"import/resolver": {
				typescript: {}, // Make sure TypeScript imports are resolved
			},
		},

		rules: {
			// TypeScript-related rules
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/explicit-function-return-type": "off",

			// Enable prettier rules
			"prettier/prettier": "warn",

			// Sort imports
			"simple-import-sort/imports": "error",
			"simple-import-sort/exports": "error",

			// Other ESLint rules
			"import/order": [
				"error",
				{
					groups: ["builtin", "external", "internal"],
					pathGroups: [
						{
							pattern: "@/**",
							group: "internal",
							position: "after",
						},
					],
					pathGroupsExcludedImportTypes: ["builtin"],
					"newlines-between": "always",
					alphabetize: {
						order: "asc",
						caseInsensitive: true,
					},
				},
			],
		},
	},
]
