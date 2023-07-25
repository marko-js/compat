import {
  importDefault,
  importNamed,
  parseExpression,
} from "@marko/babel-utils";
import { types as t } from "@marko/compiler";
import { version } from "marko/package.json";
import { optimizeHTMLWrites } from "./optmize-html-writes";

export default {
  Program: {
    exit(program) {
      const {
        hub: { file },
      } = program;
      const meta = file.metadata.marko;
      const { widgetBind } = meta;
      if (!widgetBind) return;
      program.skip();

      const isSplit = !/^\.(?:\/(?:index(?:\.js)?)?)?$/.test(widgetBind);
      const { markoOpts } = file;
      const includeMetaInSource = markoOpts.meta !== false;
      const isHTML = markoOpts.output === "html";
      const renderBlock = (file as any)
        ._renderBlock as t.NodePath<t.BlockStatement>;
      const componentTypeIdentifier = program.scope.generateUidIdentifier(
        "marko_componentType",
      );
      const templateIdentifier =
        program.scope.generateUidIdentifier("marko_template");
      const rendererIdentifier = importDefault(
        file,
        "marko/src/runtime/components/legacy/renderer-legacy.js",
        "marko_renderer",
      );
      const widgetIdentifier = importDefault(file, widgetBind, "marko_widget");
      const templateRendererMember = t.memberExpression(
        templateIdentifier,
        t.identifier("_"),
      );
      const templateMetaMember = t.memberExpression(
        templateIdentifier,
        t.identifier("meta"),
      );

      if (markoOpts.writeVersionComment) {
        program.addComment(
          "leading",
          ` Compiled using marko@${version} - DO NOT EDIT`,
          true,
        );
      }

      const runtimeTemplateIdentifier =
        program.scope.generateUidIdentifier("t");

      const prependNodes: t.Statement[] = [
        t.importDeclaration(
          [t.importSpecifier(runtimeTemplateIdentifier, t.identifier("t"))],
          t.stringLiteral(
            `marko/${markoOpts.optimize ? "dist" : "src"}/runtime/${
              isHTML ? "html" : "vdom"
            }/${markoOpts.hot ? "hot-reload.js" : "index.js"}`,
          ),
        ),
        t.variableDeclaration("const", [
          t.variableDeclarator(
            componentTypeIdentifier,
            t.stringLiteral(meta.id),
          ),
          t.variableDeclarator(
            templateIdentifier,
            t.callExpression(runtimeTemplateIdentifier, [
              componentTypeIdentifier,
            ]),
          ),
        ]),
      ];

      if (includeMetaInSource) {
        prependNodes.push(
          t.expressionStatement(
            t.assignmentExpression(
              "=",
              t.memberExpression(templateIdentifier, t.identifier("path")),
              t.identifier("__filename"),
            ),
          ),
        );
      }

      prependNodes.push(t.exportDefaultDeclaration(templateIdentifier));
      program.unshiftContainer("body", prependNodes);

      if (!isHTML) {
        program.pushContainer(
          "body",
          t.expressionStatement(
            t.callExpression(
              importNamed(
                file,
                "marko/src/runtime/components/registry",
                "r",
                "marko_registerComponent",
              ),
              [
                componentTypeIdentifier,
                t.arrowFunctionExpression(
                  [],
                  isSplit ? widgetIdentifier : templateIdentifier,
                ),
              ],
            ),
          ),
        );
      }

      const templateRenderOptionsProps = [
        t.objectProperty(t.identifier("t"), componentTypeIdentifier),
      ];

      if (isSplit) {
        templateRenderOptionsProps.push(
          t.objectProperty(t.identifier("s"), t.booleanLiteral(true)),
        );
      }

      if (!markoOpts.optimize) {
        templateRenderOptionsProps.push(
          t.objectProperty(t.identifier("d"), t.booleanLiteral(true)),
        );
      }

      program.pushContainer(
        "body",
        t.expressionStatement(
          t.assignmentExpression(
            "=",
            templateRendererMember,
            t.callExpression(rendererIdentifier, [
              t.functionExpression(
                null,
                [
                  t.identifier("input"),
                  t.identifier("out"),
                  (file as any)._componentDefIdentifier,
                  (file as any)._componentInstanceIdentifier,
                  t.identifier("state"),
                  t.identifier("$global"),
                ],
                renderBlock.node,
              ),
              t.objectExpression(templateRenderOptionsProps),
              t.callExpression(
                importDefault(
                  file,
                  "marko/src/runtime/components/legacy/defineWidget-legacy.js",
                  "marko_defineWidget",
                ),
                [widgetIdentifier],
              ),
            ]),
          ),
        ),
      );
      renderBlock.remove();

      if (includeMetaInSource) {
        const metaObject = t.objectExpression([
          t.objectProperty(t.identifier("id"), componentTypeIdentifier),
          t.objectProperty(
            t.identifier("component"),
            t.stringLiteral(widgetBind),
          ),
        ]);

        if (meta.deps.length) {
          metaObject.properties.push(
            t.objectProperty(
              t.identifier("deps"),
              parseExpression(file, JSON.stringify(meta.deps)),
            ),
          );
        }

        if (meta.tags?.length) {
          metaObject.properties.push(
            t.objectProperty(
              t.identifier("tags"),
              t.arrayExpression(meta.tags.map((tag) => t.stringLiteral(tag))),
            ),
          );
        }

        program.pushContainer(
          "body",
          t.expressionStatement(
            t.assignmentExpression("=", templateMetaMember, metaObject),
          ),
        );
      }

      if (markoOpts.modules === "cjs") {
        program.pushContainer(
          "body",
          t.expressionStatement(
            t.assignmentExpression(
              "=",
              t.memberExpression(
                t.identifier("module"),
                t.identifier("exports"),
              ),
              t.callExpression(
                t.memberExpression(
                  t.identifier("Object"),
                  t.identifier("assign"),
                ),
                [
                  t.memberExpression(
                    t.identifier("exports"),
                    t.identifier("default"),
                  ),
                  t.identifier("exports"),
                ],
              ),
            ),
          ),
        );
      }

      optimizeHTMLWrites(program);
    },
  },
} satisfies t.Visitor;
