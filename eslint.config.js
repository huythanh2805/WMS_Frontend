// // eslint.config.js
// import js from "@eslint/js";
// import tseslint from "typescript-eslint";   // <-- đây là dòng sửa chính
// import prettier from "eslint-plugin-prettier";
// import unusedImports from "eslint-plugin-unused-imports";

// export default [
//   js.configs.recommended,
//   ...tseslint.configs.recommended,   // hoặc ...tseslint.configs.recommendedTypeChecked nếu muốn type-aware

//   {
//     plugins: {
//       prettier,
//       "unused-imports": unusedImports,
//     },

//     rules: {
//       "no-unused-vars": "off",
//       "@typescript-eslint/no-unused-vars": "off",   // tắt rule cũ để dùng plugin mới

//       "unused-imports/no-unused-imports": "error",
//       "unused-imports/no-unused-vars": "warn",

//       "prettier/prettier": "error",
//     },

//     // Nếu dùng type-aware rules (optional, nhưng tốt cho TS project)
//     languageOptions: {
//       parser: tseslint.parser,
//       parserOptions: {
//         project: true,          // hoặc "./tsconfig.json"
//         tsconfigRootDir: import.meta.dirname,   // hoặc __dirname nếu CommonJS
//       },
//     },
//   },

//   {
//     ignores: ["dist/**", "node_modules/**", "*.min.js", "build/**"],
//   },
// ];