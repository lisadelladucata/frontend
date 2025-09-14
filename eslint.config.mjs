// import globals from "globals";
// import pluginJs from "@eslint/js";
// import tseslint from "typescript-eslint";
// import pluginReact from "eslint-plugin-react";


// /** @type {import('eslint').Linter.Config[]} */
// export default [
//   {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
//   {languageOptions: { globals: globals.browser }},
//   pluginJs.configs.recommended,
//   ...tseslint.configs.recommended,
//   pluginReact.configs.flat.recommended,
// ];

import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.browser } },
  {
    rules: {
      eqeqeq: "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "no-const-assign": "warn",
      "no-console": "warn",
      "prefer-const": ["error", { ignoreReadBeforeAssign: true }],
    },
  },
  {
    ignores: [".node_modules/*"]
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];


