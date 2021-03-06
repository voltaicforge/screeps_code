module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: "eslint:recommended",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    "no-undef": "error"
  },
  env: {
    "screeps/screeps": true
  },
  plugins: ["screeps", "lodash"],
  extends: ["plugin:lodash/canonical"]
};
