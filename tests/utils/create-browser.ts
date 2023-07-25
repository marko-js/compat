import resolveExports from "resolve.exports";
import { sync as resolveSync } from "resolve";
import { type ConstructorOptions, JSDOM } from "jsdom";
import createContextRequire from "context-require";

const exportsMainFile = `__package_exports__`;
const resolveExportsOptions: resolveExports.Options = {
  browser: true,
  conditions: ["default", "require", "browser"],
};

export default function createBrowser({
  dir,
  html,
  extensions,
  ...domOptions
}: {
  dir: string;
  html?: string;
  extensions?: import("context-require").Types.Hooks;
} & Omit<ConstructorOptions, "dir" | "extensions">) {
  const context = new JSDOM(
    html || "<!DOCTYPE html><html><head></head><body></body></html>",
    {
      runScripts: "dangerously",
      pretendToBeVisual: true,
      ...domOptions,
    },
  );
  const resolveExtensions = extensions
    ? [
        ...new Set([
          ...Object.keys(require.extensions),
          ...Object.keys(extensions),
        ]),
      ]
    : Object.keys(require.extensions);
  const window = context.window as unknown as Window & typeof globalThis;
  (window as any).__coverage__ = (globalThis as any).__coverage__;

  return {
    ...context,
    window,
    yield: (() => {
      const id = `${Math.random()}`;
      let queue: (() => void)[] = [];
      window.addEventListener("message", ({ data }) => {
        if (data === id) {
          const callbacks = queue;
          queue = [];
          for (const cb of callbacks) {
            cb();
          }
        }
      });

      return () => {
        return new Promise<void>((resolve) => {
          if (queue.push(resolve) === 1) {
            window.postMessage(id, "*");
          }
        });
      };
    })(),
    require: createContextRequire({
      dir,
      context,
      extensions,
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
