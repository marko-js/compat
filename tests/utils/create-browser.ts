import { type Options as ExportsOpts, exports } from "resolve.exports";
import { type Opts as ResolveOpts, sync as resolveSync } from "resolve";
import { type ConstructorOptions, JSDOM } from "jsdom";
import createContextRequire from "context-require";

const exportsMainFile = `__package_exports__`;
const resolveExportsOptions: ExportsOpts = {
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
      resolve(basedir, req, { filename }) {
        return resolveSync(req, {
          basedir,
          filename,
          pathFilter,
          packageFilter,
          extensions: resolveExtensions,
        } as ResolveOpts);
      },
    }),
  };
  function pathFilter(
    pkg: Record<string, unknown>,
    _file: string,
    relativePath: string,
  ) {
    let requestedFile = relativePath === exportsMainFile ? "." : relativePath;

    if (pkg.exports) {
      try {
        return exports(pkg, requestedFile, resolveExportsOptions)?.[0];
      } catch {
        // ignore.
        return;
      }
    } else if (pkg.browser) {
      const pkgBrowser = pkg.browser as Record<string, string | false> | string;

      if (typeof pkgBrowser === "string") {
        switch (requestedFile) {
          case ".":
          case "./":
            return pkgBrowser;
          default:
            return requestedFile;
        }
      }

      let replacement = pkgBrowser[requestedFile];
      if (replacement !== undefined) {
        return replacement;
      }

      if (requestedFile === ".") {
        // Check `.` and `./`
        requestedFile = "./";
        replacement = pkgBrowser[requestedFile];
        if (replacement !== undefined) {
          return replacement;
        }
      } else if (requestedFile[0] !== ".") {
        requestedFile = `./${requestedFile}`;
        replacement = pkgBrowser[requestedFile];
        if (replacement !== undefined) {
          return replacement;
        }
      }

      const isFolder = requestedFile[requestedFile.length - 1] === "/";
      if (isFolder) {
        // If we're definitely matching a folder we'll try adding `index` to the
        // end first.
        requestedFile += "index";
        replacement = pkgBrowser[requestedFile];
        if (replacement !== undefined) {
          return replacement;
        }
      }

      for (const ext of resolveExtensions) {
        replacement = pkgBrowser[requestedFile + ext];
        if (replacement !== undefined) {
          return replacement;
        }
      }

      if (!isFolder) {
        // If we're not matching a folder we'll try adding `/index` to the end.
        requestedFile += "/index";
        replacement = pkgBrowser[requestedFile];
        if (replacement !== undefined) {
          return replacement;
        }

        for (const ext of resolveExtensions) {
          replacement = pkgBrowser[requestedFile + ext];
          if (replacement !== undefined) {
            return replacement;
          }
        }
      }
    }

    return relativePath;
  }
}

function packageFilter<
  T extends { main?: unknown; exports?: unknown; browser?: unknown },
>(pkg: T) {
  if (pkg.exports || pkg.browser) {
    // defers to the "exports" field.
    pkg.main = exportsMainFile;
  }

  return pkg;
}
