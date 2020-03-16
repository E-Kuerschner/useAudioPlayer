module.exports = {
    extends: [
        "react-app",
        "prettier/@typescript-eslint",
        "plugin:prettier/recommended",
        "plugin:cypress/recommended"
    ],
    env: {
        "cypress/globals": true
    },
    settings: {
        react: {
            version: "detect",
        },
    },
}
