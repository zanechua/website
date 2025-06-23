// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  endOfLine: 'lf',
  trailingComma: 'none',
  arrowParens: 'avoid',
  singleQuote: true,
  jsxSingleQuote: false,
  printWidth: 100,
  semi: true,
  bracketSameLine: true
};

export default config;
