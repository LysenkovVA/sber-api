import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
});

/** @type {import("eslint").Linter.FlatConfig[]} */
const eslintConfig = [
    {
        ignores: ["**/node_modules/**", ".next/**", "out/**"],
    },
    ...compat.extends("next/core-web-vitals", "next/typescript", "next"),
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        ignores: [".idea/*.{ts, tsx}"],
        rules: {
            "react/display-name": "off",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "react-hooks/exhaustive-deps": "warn",
            "@typescript-eslint/no-empty-object-type": "warn",
        },
    },
];

export default eslintConfig;
