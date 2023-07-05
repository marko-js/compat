import fs from "fs";
import path from "path";
import glob from "fast-glob";
import { type BuildOptions, build } from "esbuild";

const packagesDir = path.join(__dirname, "packages");

Promise.all(
  ["marko-widgets", "compat-v4"].map(async (pkgName) => {
    const packageDir = path.resolve(packagesDir, pkgName);
    const entryPoints = [];
    const srcdir = path.resolve(packageDir, "src");
    const outdir = path.resolve(packageDir, "dist");
    const pkg = JSON.parse(
      await fs.promises.readFile(path.join(packageDir, "package.json"), "utf8")
    );
    const external = new Set([
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ]);

    const files = glob.stream(["**", "!*.d.ts"], {
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
  })
).catch((err) => {
  console.error(err);
  process.exit(1);
});
