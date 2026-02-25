import nextTsConfig from "eslint-config-next/typescript";

const eslintConfig = [
  ...nextTsConfig,
  {
    ignores: [".next/**", "out/**", "build/**"],
  },
  {
    rules: {
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
