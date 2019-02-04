module.exports = {
  extends: ["airbnb-base", "prettier"],
  plugins: ["prettier"],
  env: {
    node: true
  },
  rules: {
    "no-console": "off",
    quotes: ["error", "backtick"]
  }
};
