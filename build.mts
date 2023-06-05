import fs from "fs";
import path from "path";
import glob from "fast-glob";
import { build, type BuildOptions } from "esbuild";
import { fileURLToPath } from "url";

const entryPoints = [];
const absWorkingDir = fileURLToPath(new URL(".", import.meta.url));
const srcdir = path.resolve(absWorkingDir, "src");
const outdir = path.resolve(absWorkingDir, "dist");
const pkg = JSON.parse(
  await fs.promises.readFile(path.join(absWorkingDir, "package.json"), "utf8")
);
const external = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
]);

const files = glob.stream(["**", "!*.d.ts", "!**/__tests__"], {
  cwd: srcdir,
}) as AsyncIterable<string>;

for await (const file of files) {
  if (path.extname(file) === ".ts") {
    entryPoints.push(path.resolve(srcdir, file));
  } else {
    const outfile = path.join(outdir, file);
    await fs.promises.mkdir(path.dirname(outfile), { recursive: true });
    await fs.promises.copyFile(path.join(srcdir, file), outfile);
  }
}

const opts: BuildOptions = {
  outdir,
  entryPoints,
  outbase: srcdir,
  platform: "node",
  target: ["es2019"],
  define: {
    "process.env.NODE_ENV": "'production'",
  },
};

await Promise.all([
  build({
    ...opts,
    format: "cjs",
  }),
  build({
    ...opts,
    format: "esm",
    bundle: true,
    splitting: true,
    outExtension: { ".js": ".mjs" },
    external: [...external],
  }),
]);
