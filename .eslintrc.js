module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/typescript",
        "plugin:cypress/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: "latest",
        sourceType: "module",
        tsconfigRootDir: ".",
        project: ["./tsconfig.json"]
    },
    // Configuring third-party plugins
    plugins: [
        "react",
        "react-hooks",
        "prettier",
        "import",
        "@typescript-eslint"
    ],
    env: {
        browser: true,
        "cypress/globals": true
    },
    rules: {
        "@typescript-eslint/ban-ts-comment": "warn"
    },
    settings: {
        "import/resolver": {
            typescript: {
                project: "./tsconfig.json"
            }
        },
        react: {
            version: "detect"
        }
    }
}
