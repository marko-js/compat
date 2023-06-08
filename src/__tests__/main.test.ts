import fs from "fs";
import path from "path";
import type { Writable } from "stream";
import glob from "fast-glob";
import snap from "mocha-snap";
import * as compiler from "@marko/compiler";
import register from "@marko/compiler/register";
import {
  type BoundFunctions,
  type queries,
  within,
} from "@testing-library/dom";
import createBrowser from "./utils/create-browser";
import createTracker from "./utils/create-tracker";
import initComponents from "./utils/init-components.marko";

export type FixtureConfig = {
  input?: Record<string, unknown>;
  steps?: (
    | Record<string, unknown>
    | ((screen: BoundFunctions<typeof queries>) => void | Promise<void>)
  )[];
  skipCompileDOM?: boolean;
  skipCompileHTML?: boolean;
  skipRenderDOM?: boolean;
  skipRenderHTML?: boolean;
  skipHydrate?: boolean;
  hasCompileErrors?: boolean;
  hasRuntimeErrors?: boolean;
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

      describe("compile", () => {
        (skipCompileHTML ? it.skip : it)("html", () =>
          snapCompiledTemplates(htmlConfig)
        );
        (skipCompileDOM ? it.skip : it)("dom", () =>
          snapCompiledTemplates(domConfig)
        );

        async function snapCompiledTemplates(compilerConfig: compiler.Config) {
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
        }
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
            const instance = browser
              .require(fixtureTemplateFile)
              .default.renderSync(input)
              .appendTo(document.body)
              .getComponent();
            const screen = within(document.body);
            const tracker = createTracker(browser.window, document.body);

            try {
              await browser.whenAsyncComplete();
              tracker.logUpdate(input);

              for (const update of steps) {
                if (typeof update === "function") {
                  await update(screen);
                } else {
                  instance.input = update;
                }

                await browser.whenAsyncComplete();
                tracker.logUpdate(update);
              }

              return tracker.getLogs();
            } finally {
              tracker.cleanup();
              instance.destroy();
            }
          });
        });

        (skipHydrate ? it.skip : it)("hydrate", async () => {
          await snapMD(async () => {
            const { browser } = await renderHTML();
            const { window } = browser;
            const { document } = window;
            (
              (0, (window as any).eval)(
                `require=>{${await compileCode(
                  fixtureTemplateFile,
                  hydrateConfig
                )}}`
              ) as any
            )(browser.require);

            const screen = within(document.body);
            const tracker = createTracker(window, document.body);

            try {
              await browser.whenAsyncComplete();
              tracker.logUpdate(input);

              for (const update of steps) {
                // if new input is detected, stop testing
                // this will be covered by the client tests
                if (typeof update !== "function") break;

                await update(screen);
                await browser.whenAsyncComplete();
                tracker.logUpdate(update);
              }

              return tracker.getLogs();
            } finally {
              tracker.cleanup();
            }
          });
        });

        let htmlResult: {
          browser: ReturnType<typeof createBrowser>;
          tracker: ReturnType<typeof createTracker>;
        };
        async function renderHTML() {
          if (htmlResult) return htmlResult;

          const logs: string[] = [];
          let buffer = "";
          let html = "";
          await initComponents.render(
            {
              template: require(fixtureTemplateFile).default,
              templateInput: input,
            },
            {
              write(chunk: string) {
                buffer += chunk;
                html += chunk;
              },
              flush() {
                if (buffer) {
                  logs.push(`# Write\n${indent(buffer)}`);
                  buffer = "";
                }
              },
              end(chunk?: string) {
                if (chunk) {
                  buffer += chunk;
                  html += chunk;
                }

                this.flush();
              },
              emit(type: string, ...args: unknown[]) {
                logs.push(
                  `# Emit ${type}${args.map((arg) => `\n${indent(arg)}`)}`
                );
              },
            } as Writable & { flush(): void }
          );

          const browser = createBrowser({
            dir: fixtureDir,
            extensions: register({
              ...domConfig,
              extensions: {},
            }),
          });

          const { window } = browser;
          const { document } = window;
          document.write(
            `<!DOCTYPE html><html><head></head><body>${html}</body></html>`
          );
          const tracker = createTracker(window, document.body);

          for (const msg of logs) {
            tracker.log(msg);
          }

          try {
            await browser.whenAsyncComplete();
            tracker.logUpdate(input);
            return (htmlResult = { browser, tracker });
          } finally {
            tracker.cleanup();
          }
        }
      });

      function snapMD(fn: () => unknown) {
        return (hasRuntimeErrors ? snap.catch : snap)(fn, {
          ext: `.md`,
          dir: fixtureDir,
        });
      }
    });
  }
});

async function compileCode(templateFile: string, config: compiler.Config) {
  return (await compiler.compileFile(templateFile, config)).code;
}

function indent(data: unknown) {
  return String(data).replace(/^(?!\s*$)/gm, "  ");
}
