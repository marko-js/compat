import path from "path";
import { importDefault, parseExpression } from "@marko/babel-utils";
import { types as t } from "@marko/compiler";
import { version } from "marko/package.json";
import { getAttribute, hasAttribute } from "@marko/compat-utils";
import { optimizeHTMLWrites } from "./optmize-html-writes";

export default {
  MarkoTag(tag) {
    const {
      hub: { file },
    } = tag;
    const meta = file.metadata.marko;
    const { widgetBind } = meta;
    if (!widgetBind) return;
    const wBindAttr = getAttribute(tag, "w-bind");
    if (!wBindAttr) return;

    if (typeof widgetBind === "object") {
      const componentDefIdentifier = (file as any)
        ._componentDefIdentifier as t.Identifier;
      const componentInstanceIdentifier = (file as any)
        ._componentInstanceIdentifier as t.Identifier;
      const widgetTypesIdentifier = (file as any)
        ._widgetTypesIdentifier as t.Identifier;
      const wTypeIdentifier = tag.scope.generateUidIdentifier("wtype");
      const wBindIdentifier = tag.scope.generateUidIdentifier("wbind");
      tag.insertBefore(
        t.markoScriptlet([
          t.variableDeclaration("const", [
            t.variableDeclarator(
              wTypeIdentifier,
              t.memberExpression(
                widgetTypesIdentifier,
                wBindAttr.node.value,
                true,
              ),
            ),
            t.variableDeclarator(
              wBindIdentifier,
              t.logicalExpression(
                "&&",
                wTypeIdentifier,
                t.stringLiteral("_wbind"),
              ),
            ),
          ]),
          t.expressionStatement(
            t.assignmentExpression(
              "=",
              componentInstanceIdentifier,
              t.callExpression(
                t.memberExpression(componentDefIdentifier, t.identifier("t")),
                [wTypeIdentifier],
              ),
            ),
          ),
        ]),
      );

      if (hasAttribute(tag, "id")) {
        wBindAttr.replaceWith(t.markoAttribute("key", wBindIdentifier));
      } else {
        wBindAttr.replaceWithMultiple([
          t.markoAttribute("key", wBindIdentifier),
          t.markoAttribute(
            "id",
            t.logicalExpression(
              "&&",
              wBindIdentifier,
              t.callExpression(
                t.memberExpression(
                  componentInstanceIdentifier,
                  t.identifier("elId"),
                ),
                [wBindIdentifier],
              ),
            ),
          ),
        ]);
      }
    } else if (hasAttribute(tag, "id")) {
      wBindAttr.replaceWith(t.markoAttribute("key", t.stringLiteral("_wbind")));
    } else {
      wBindAttr.replaceWithMultiple([
        t.markoAttribute("key", t.stringLiteral("_wbind")),
        t.markoAttribute("id", t.stringLiteral("_wbind"), "scoped"),
      ]);
    }
  },
  Program: {
    enter(program) {
      const {
        hub: { file },
      } = program;
      const meta = file.metadata.marko;
      const { widgetBind } = meta;
      if (!widgetBind) return;

      if (typeof widgetBind === "object") {
        program.unshiftContainer(
          "body",
          t.variableDeclaration("const", [
            t.variableDeclarator(
              ((file as any)._widgetTypesIdentifier =
                program.scope.generateUidIdentifier("widget_types")),
              t.objectExpression(
                Object.entries(widgetBind).map(([name, id]) => {
                  return t.objectProperty(
                    t.stringLiteral(name),
                    t.stringLiteral(id),
                  );
                }),
              ),
            ),
          ]),
        );
      }
    },
    exit(program) {
      const {
        hub: { file },
      } = program;
      const meta = file.metadata.marko;
      const { widgetBind } = meta;
      if (!widgetBind) return;
      program.skip();

      const { deps } = meta;
      const isImplicit = widgetBind === true;
      const isDynamic = typeof widgetBind === "object";
      const isSplit =
        isImplicit || isDynamic
          ? true
          : !/^\.(?:\/(?:index(?:\.js)?)?)?$/.test(widgetBind);
      const { markoOpts } = file;
      const isCJS = markoOpts.modules === "cjs";
      const templateFileName = file.opts.filename as string;
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

      const templateRenderOptionsProps: t.ObjectProperty[] = [];

      if (!isDynamic) {
        templateRenderOptionsProps.push(
          t.objectProperty(t.identifier("t"), componentTypeIdentifier),
        );
      }

      if (isImplicit || isDynamic) {
        templateRenderOptionsProps.push(
          t.objectProperty(t.identifier("i"), t.booleanLiteral(true)),
        );
      }

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

      const componentDefIdentifier = (file as any)
        ._componentDefIdentifier as t.Identifier;
      const componentInstanceIdentifier = (file as any)
        ._componentInstanceIdentifier as t.Identifier;
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
                  componentDefIdentifier,
                  componentInstanceIdentifier,
                  t.identifier("state"),
                  t.identifier("$global"),
                ],
                renderBlock.node,
              ),
              t.objectExpression(templateRenderOptionsProps),
            ]),
          ),
        ),
      );
      renderBlock.remove();

      if (includeMetaInSource) {
        const metaObject = t.objectExpression([
          t.objectProperty(t.identifier("legacy"), t.booleanLiteral(true)),
          t.objectProperty(t.identifier("id"), componentTypeIdentifier),
        ]);

        if (isImplicit) {
          metaObject.properties.push(
            t.objectProperty(
              t.identifier("component"),
              t.stringLiteral(path.basename(templateFileName)),
            ),
          );
        } else if (!isDynamic) {
          metaObject.properties.push(
            t.objectProperty(
              t.identifier("component"),
              t.stringLiteral(widgetBind),
            ),
          );
        }

        if (deps.length) {
          metaObject.properties.push(
            t.objectProperty(
              t.identifier("deps"),
              parseExpression(file, JSON.stringify(deps)),
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

      if (isCJS) {
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
