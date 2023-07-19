// Register tsconfig aliases so that we always load source files instead of dist files.
const fs = require("fs");
const path = require("path");
const tsconfigPaths = require("tsconfig-paths");

for (const name of fs.readdirSync("packages")) {
  const dir = path.resolve("packages", name);
  const {
    compilerOptions: { baseUrl, paths },
  } = require(path.join(dir, "tsconfig.json"));
  if (paths) {
    tsconfigPaths.register({
      cwd: dir,
      baseUrl,
      paths,
    });
  }
}

// Setup babel to compile typescript on the fly.
require("@babel/register")({
  babelrc: false,
  configFile: false,
  extensions: [".ts"],
  presets: ["@babel/preset-typescript"],
  plugins: ["@babel/plugin-transform-modules-commonjs"],
});
