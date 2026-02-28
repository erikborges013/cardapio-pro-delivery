import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";

export default [
  // 1. Configurações globais de arquivos (aplica a js, ts e vue)
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // Suas globais personalizadas
        auth: "readonly",
        db: "readonly",
        storage: "readonly",
      },
    },
  },

  // 2. Configurações Base (JS, TS e Vue Recomendados)
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/essential"], // ou 'flat/recommended' para ser mais rigoroso

  // 3. Configuração Específica para Vue (para entender TS dentro do Vue)
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  // 4. Suas Regras Personalizadas
  {
    rules: {
      semi: ["error", "always"],
      quotes: "off",
      "no-unused-vars": "off", // Desligue a regra padrão do JS para usar a do TS
      "@typescript-eslint/no-unused-vars": "warn", // Regra correta para TS
      "no-console": "off",
      eqeqeq: "warn",
      "no-undef": "off", // TypeScript já cuida disso, pode desligar no ESLint para evitar falsos positivos
      curly: "warn",
      "default-case": "warn",
      "no-fallthrough": "error",
      "consistent-return": "warn",
      "no-unreachable": "error",
      "no-constant-condition": "warn",
      "no-implicit-coercion": "warn",

      // Regra específica do Vue (exemplo: nomes de componentes com múltiplas palavras)
      "vue/multi-word-component-names": "off",
    },
  },
];
