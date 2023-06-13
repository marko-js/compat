import fs from "fs";
import path from "path";
import assert from "assert/strict";
import type { Writable } from "stream";
import glob from "fast-glob";
import snap from "mocha-snap";
import type { Diagnostic } from "@marko/babel-utils";
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
  migrations?: {
    [label: string]: {
      [index: number]: string | boolean | undefined;
    };
  }[];
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
  resolveVirtualDependency(_filename, { code, virtualPath }) {
    return `virtual:${virtualPath} ${code}`;
  },
};

const cwd = process.cwd();
const migrateConfig: compiler.Config = {
  ...baseConfig,
  output: "migrate",
  errorRecovery: true,
};
const htmlConfig: compiler.Config = { ...baseConfig, output: "html" };
const domConfig: compiler.Config = { ...baseConfig, output: "dom" };
const hydrateConfig: compiler.Config = {
  ...baseConfig,
  output: "hydrate",
  modules: "cjs",
};

register(htmlConfig);

describe("translator", () => {
  const fixturesDir = path.join(__dirname, "fixtures");
  for (const entry of fs.readdirSync(fixturesDir)) {
    if (entry.endsWith(".skip")) continue;

    describe(entry, () => {
      const fixtureDir = path.join(fixturesDir, entry);
      const relativeFixtureDir = path.relative(cwd, fixtureDir);
      const resolve = (file: string) => path.join(fixtureDir, file);
      const fixtureTemplateFile = resolve("./template.marko");
      const {
        input = {},
        steps = [],
        migrations = [],
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
        const testMigrate = hasCompileErrors ? it.skip : it;
        testMigrate("auto-migrate", () => snapCompiledTemplates(migrateConfig));

        if (migrations.length) {
          let diagnostics: Diagnostic[];
          let migrationIndex = 0;
          for (const migration of migrations) {
            testMigrate(`manual-migrate ${migrationIndex++}`, async () => {
              const indexByLabel = new Map<string, number>();
              const applyFixes = new Map<number, unknown>();
              diagnostics ??= (
                await compiler.compileFile(fixtureTemplateFile, migrateConfig)
              ).meta.diagnostics;

              for (
                let diagIndex = 0;
                diagIndex < diagnostics.length;
                diagIndex++
              ) {
                const { label, fix } = diagnostics[diagIndex];
                const answersForLabel = migration[label];
                if (answersForLabel) {
                  const answerIndex = indexByLabel.get(label) ?? 0;
                  const answers = migration[label];
                  indexByLabel.set(label, answerIndex + 1);
                  if (!answers || !(answerIndex in answers)) continue;

                  const answer = answers[answerIndex];
                  assert(
                    fix,
                    "Unexpected answer to a diagnostic without a fix."
                  );

                  if (answer !== undefined) {
                    if (fix === true) {
                      assert(
                        typeof answer === "undefined",
                        "Unexpected non undefined answer to a default applied fix."
                      );
                    } else {
                      switch (fix.type) {
                        case "confirm":
                          assert(
                            typeof answer === "boolean",
                            "Unexpected non boolean answer to a confirm fix."
                          );
                          break;
                        case "select":
                          assert(
                            typeof answer === "string",
                            "Unexpected non string answer to a select fix."
                          );
                          break;
                      }
                    }
                  }

                  applyFixes.set(diagIndex, answer);
                }
              }

              for (const label in migration) {
                const totalAnswersForLabel = indexByLabel.get(label);
                assert(
                  totalAnswersForLabel &&
                    Math.max(
                      ...Object.keys(migration[label]).map((n) =>
                        parseInt(n, 10)
                      )
                    ) < totalAnswersForLabel,
                  `Missing diagnostic with label "${label}"`
                );
              }

              await snapCompiledTemplate(
                fixtureTemplateFile,
                path.relative(fixtureDir, fixtureTemplateFile),
                { ...migrateConfig, applyFixes }
              );
            });
          }
        }

        (skipCompileHTML ? it.skip : it)("html", () =>
          snapCompiledTemplates(htmlConfig)
        );
        (skipCompileDOM ? it.skip : it)("dom", () =>
          snapCompiledTemplates(domConfig)
        );

        async function snapCompiledTemplates(config: compiler.Config) {
          const errors: Error[] = [];

          for (const file of await glob("**/*.marko", {
            absolute: true,
            cwd: fixtureDir,
            ignore: ["**/__snapshots__"],
          })) {
            try {
              await snapCompiledTemplate(
                file,
                path
                  .relative(fixtureDir, file)
                  .replace(
                    ".marko",
                    config.output === "migrate" ? ".marko" : ".js"
                  ),
                config
              );
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

        async function snapCompiledTemplate(
          inputFile: string,
          outputFile: string,
          config: compiler.Config
        ) {
          await (hasCompileErrors ? snap.catch : snap)(
            async () =>
              replaceFilePaths(
                (
                  await compiler.compileFile(inputFile, config)
                ).code
              ),
            {
              file: outputFile,
              dir: fixtureDir,
            }
          );
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
              (0, window.eval)(
                `require=>{${
                  (
                    await compiler.compileFile(
                      fixtureTemplateFile,
                      hydrateConfig
                    )
                  ).code
                }}`
              ) as (require: typeof browser.require) => void
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

        // Hydration render will use the same browser instance as the HTML render.
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
        return (hasRuntimeErrors ? snap.catch : snap)(
          async () => replaceFilePaths(String(await fn())),
          {
            ext: `.md`,
            dir: fixtureDir,
          }
        );
      }

      function replaceFilePaths(str: string) {
        return str
          .replaceAll(cwd, "<cwd>")
          .replaceAll(relativeFixtureDir, "<fixture-dir>");
      }
    });
  }
});

function indent(data: unknown) {
  return String(data).replace(/^(?!\s*$)/gm, "  ");
}
