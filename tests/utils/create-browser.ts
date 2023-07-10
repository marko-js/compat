import resolveExports from "resolve.exports";
import { sync as resolveSync } from "resolve";
import { Window as HappyDOM } from "happy-dom";
import createContextRequire from "context-require";

const exportsMainFile = `__package_exports__`;
const resolveExportsOptions: resolveExports.Options = {
  browser: true,
  conditions: ["default", "require", "browser"],
};

export default function createBrowser({
  dir,
  extensions,
  ...domOptions
}: {
  dir: string;
  extensions?: import("context-require").Types.Hooks;
} & Omit<ConstructorParameters<typeof HappyDOM>[0], "dir" | "extensions">) {
  const window = new HappyDOM(domOptions);
  const resolveExtensions = extensions
    ? [
        ...new Set([
          ...Object.keys(require.extensions),
          ...Object.keys(extensions),
        ]),
      ]
    : Object.keys(require.extensions);

  return {
    ...window.happyDOM,
    window: window as unknown as Window & typeof globalThis,
    require: createContextRequire({
      dir,
      extensions,
      context: window,
      resolve(basedir, req) {
        return resolveSync(req, {
          basedir,
          pathFilter,
          packageFilter,
          extensions: resolveExtensions,
        });
      },
    }),
  };
}

function pathFilter(
  pkg: Record<string, unknown>,
  _file: string,
  relativePath: string,
) {
  if (pkg.exports) {
    return resolveExports.resolve(
      pkg,
      relativePath === exportsMainFile ? "." : relativePath,
      resolveExportsOptions,
    )?.[0] as string;
  }

  return relativePath;
}

function packageFilter<T extends { main?: unknown; exports?: unknown }>(
  pkg: T,
) {
  if (pkg.exports) {
    // defers to the "exports" field.
    pkg.main = exportsMainFile;
  }

  return pkg;
}
