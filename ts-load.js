require("@babel/register")({
  extensions: [".ts", ".cts", ".mts"],
  presets: ["@babel/preset-typescript"],
  plugins: ["@babel/plugin-transform-modules-commonjs"],
});
