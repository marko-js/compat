import fs from "fs";
import path from "path";
import type { Writable } from "stream";
import glob from "fast-glob";
import snap from "mocha-snap";
import * as compiler from "@marko/compiler";
import register from "@marko/compiler/register";
import createBrowser from "jsdom-context-require";
import {
  type BoundFunctions,
  type queries,
  within,
} from "@testing-library/dom";
import createMutationTracker from "./utils/track-mutations";

export type FixtureConfig = {
  input?: Record<string, unknown>;
  steps?: (
    | Record<string, unknown>
    | ((helpers: BoundFunctions<typeof queries>) => void | Promise<void>)
  )[];
  skipCompileDOM?: boolean;
  skipCompileHTML?: boolean;
  skipRenderDOM?: boolean;
  skipRenderHTML?: boolean;
  skipHydrate?: boolean;
  hasCompileErrors?: boolean;
  hasRuntimeErrors?: boolean;
};

type Result = {
  browser: ReturnType<typeof createBrowser>;
  tracker: ReturnType<typeof createMutationTracker>;
};

const baseConfig: compiler.Config = {
  babelConfig: {
    babelrc: false,
    configFile: false,
  },
  writeVersionComment: false,
};

const htmlConfig: compiler.Config = { ...baseConfig, output: "html" };
const domConfig: compiler.Config = { ...baseConfig, output: "dom" };
const hydrateConfig: compiler.Config = {
  ...baseConfig,
  output: "hydrate",
  modules: "cjs",
  resolveVirtualDependency(_from, { virtualPath }) {
    return virtualPath;
  },
};

register(htmlConfig);

before(async () => {
  // Ensure we never load the dist Marko tags during tests.
  await fs.promises.mkdir(path.join(__dirname, "../../dist")).catch(() => {});
  await fs.promises.writeFile(
    path.join(__dirname, "../../dist/marko.json"),
    "{}"
  );
});

describe("translator", () => {
  const fixturesDir = path.join(__dirname, "fixtures");
  for (const entry of fs.readdirSync(fixturesDir)) {
    if (entry.endsWith(".skip")) continue;

    describe(entry, () => {
      const fixtureDir = path.join(fixturesDir, entry);
      const resolve = (file: string) => path.join(fixtureDir, file);
      const fixtureTemplateFile = resolve("./template.marko");
      const {
        input = {},
        steps = [],
        hasRuntimeErrors,
        hasCompileErrors,
        skipCompileHTML,
        skipCompileDOM,
        skipRenderHTML = hasCompileErrors ?? skipCompileHTML,
        skipRenderDOM = hasCompileErrors ?? skipCompileDOM,
        skipHydrate = hasCompileErrors ?? skipRenderHTML ?? skipRenderDOM,
      }: FixtureConfig = (() => {
        try {
          return require(resolve("test.ts")).default;
        } catch {
          return {};
        }
      })();

      const snapMD = (fn: () => unknown) =>
        (hasRuntimeErrors ? snap.catch : snap)(fn, {
          ext: `.md`,
          dir: fixtureDir,
        });
      const snapAllTemplates = async (compilerConfig: compiler.Config) => {
        const additionalMarkoFiles = await glob(resolve("**/*.marko"));
        const finalConfig: compiler.Config = {
          ...compilerConfig,
          resolveVirtualDependency(_filename, { code, virtualPath }) {
            return `virtual:${virtualPath} ${code}`;
          },
        };
        const errors: Error[] = [];
        const targetSnap = hasCompileErrors ? snap.catch : snap;

        for (const file of additionalMarkoFiles) {
          try {
            await targetSnap(() => compileCode(file, finalConfig), {
              file: path.relative(fixtureDir, file).replace(".marko", ".js"),
              dir: fixtureDir,
            });
          } catch (err) {
            errors.push(err as Error);
          }
        }

        switch (errors.length) {
          case 0:
            break;
          case 1:
            throw errors[0];
          default:
            throw new AggregateError(
              errors,
              `\n${errors.join("\n").replace(/^(?!\s*$)/gm, "\t")}`
            );
        }
      };

      let htmlResult: Result;
      const renderHTML = async () => {
        if (htmlResult) return htmlResult;

        const browser = createBrowser({
          dir: fixtureDir,
          extensions: register({
            ...domConfig,
            extensions: {},
          }),
        });
        const document = browser.window.document;
        const tracker = createMutationTracker(browser.window, document.body);

        try {
          let buffer = "";
          await (require(fixtureTemplateFile).default as Marko.Template).render(
            input,
            {
              write(chunk: string) {
                buffer += chunk;
                tracker.log(`# Write\n${indent(chunk)}`);
              },
              end(chunk?: string) {
                const parser = document.createElement("template");
                if (chunk) {
                  buffer += chunk;
                  tracker.log(`# End\n${indent(chunk)}`);
                }

                parser.innerHTML = buffer;
                document.body.appendChild(parser.content);
                tracker.logUpdate(input);
              },
              emit(type: string, ...args: unknown[]) {
                tracker.log(
                  `# Emit ${type}${args.map((arg) => `\n${indent(arg)}`)}`
                );
              },
            } as Writable & { flush(): void }
          );

          return (htmlResult = { browser, tracker });
        } finally {
          tracker.cleanup();
        }
      };

      describe("compile", () => {
        (skipCompileHTML ? it.skip : it)("html", () =>
          snapAllTemplates(htmlConfig)
        );
        (skipCompileDOM ? it.skip : it)("dom", () =>
          snapAllTemplates(domConfig)
        );
      });

      describe("render", () => {
        (skipRenderHTML ? it.skip : it)("html", async () => {
          await snapMD(async () => (await renderHTML()).tracker.getLogs());
        });

        (skipRenderDOM ? it.skip : it)("dom", async () => {
          await snapMD(async () => {
            const browser = createBrowser({
              dir: fixtureDir,
              extensions: register({
                ...domConfig,
                extensions: {},
              }),
            });

            const { window } = browser;
            const { document } = window;
            const template = browser.require(fixtureTemplateFile).default;
            const container = Object.assign(document.createElement("div"), {
              TEST_ROOT: true,
            });
            const helpers = within(container);
            const tracker = createMutationTracker(browser.window, container);
            document.body.appendChild(container);

            try {
              const instance = template
                .renderSync(input)
                .appendTo(container)
                .getComponent();
              tracker.logUpdate(input);

              for (const update of steps) {
                if (typeof update === "function") {
                  await update(helpers);
                } else {
                  instance.input = update;
                }

                await waitForBatch();
                tracker.logUpdate(update);
              }

              return tracker.getLogs();
            } finally {
              tracker.cleanup();
              container.remove();
            }
          });
        });

        (skipHydrate ? it.skip : it)("hydrate", async () => {
          await snapMD(async () => {
            const { browser } = await renderHTML();
            const { window } = browser;
            const { document } = window;
            const helpers = within(document.body);
            const tracker = createMutationTracker(window, document.body);

            try {
              (
                (0, window.eval)(
                  `require=>{${await compileCode(
                    fixtureTemplateFile,
                    hydrateConfig
                  )}}`
                ) as any
              )(browser.require);

              tracker.logUpdate(input);

              for (const update of steps) {
                // if new input is detected, stop testing
                // this will be covered by the client tests
                if (typeof update !== "function") break;

                await update(helpers);
                await waitForBatch();
                tracker.logUpdate(update);
              }

              return tracker.getLogs();
            } finally {
              tracker.cleanup();
            }
          });
        });
      });
    });
  }
});

async function compileCode(templateFile: string, config: compiler.Config) {
  return (await compiler.compileFile(templateFile, config)).code;
}

function indent(data: unknown) {
  return String(data).replace(/^(?!\s*$)/gm, "  ");
}

function waitForBatch() {
  return new Promise((resolve) => setImmediate(resolve));
}
