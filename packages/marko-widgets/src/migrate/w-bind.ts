import path from "path";
import { types as t } from "@marko/compiler";
import { diagnosticDeprecate, diagnosticError } from "@marko/babel-utils";

declare module "@marko/compiler" {
  interface MarkoMeta {
    widgetBind?: Record<string, string> | string | true;
  }
}

export default {
  MarkoAttribute(attr) {
    const { node } = attr;
    if (node.name !== "w-bind") return;

    const { file } = attr.hub;
    const meta = file.metadata.marko;
    let widgetBind: string | undefined;

    if (typeof meta.widgetBind === "object") {
      diagnosticDeprecate(attr, {
        label:
          "Legacy components using w-bind with <widget-types> are deprecated. See: https://github.com/marko-js/marko/issues/421",
      });
      return;
    }

    if (node.value.type === "BooleanLiteral" && node.value.value === true) {
      widgetBind = existsRelative(file, "widget.js")
        ? "./widget.js"
        : "./index.js";
    } else if (node.value.type === "StringLiteral") {
      widgetBind = node.value.value;
    }

    if (!widgetBind) {
      diagnosticError(attr, {
        label:
          "Invalid value for w-bind, expected a string literal or 'true'. Alternatively <widget-types> must be defined.",
      });

      attr.remove();
      return;
    }

    meta.widgetBind = widgetBind;

    diagnosticDeprecate(attr, {
      label:
        "Legacy components using w-bind, <widget-types> and defineRenderer/defineComponent or defineWidget are deprecated. See: https://github.com/marko-js/marko/issues/421",
    });
  },
  Program: {
    exit(program) {
      const { file } = program.hub;
      const meta = file.metadata.marko;
      const { widgetBind } = meta;
      if (!widgetBind || typeof widgetBind === "object") return;
      const { markoOpts } = file;
      const isCJS = markoOpts.modules === "cjs";
      const registryPath = `marko/${
        file.markoOpts.optimize ? "dist" : "src"
      }/runtime/components/registry.js`;

      if (
        typeof widgetBind === "string" &&
        /^\.(?:\/(?:index(?:\.js)?)?)?$/.test(widgetBind)
      ) {
        meta.component = widgetBind;
      } else {
        meta.deps.push({
          type: "js",
          virtualPath: `./${path.basename(
            file.opts.filename as string,
          )}.register.js`,
          code:
            widgetBind === true
              ? isCJS
                ? `require("${registryPath}").r("${meta.id}",()=>require("marko-widgets").defineWidget({}));`
                : `import {defineWidget} from "marko-widgets";import {r} from "${registryPath}";r("${meta.id}",()=>defineWidget({}));`
              : isCJS
              ? `require("${registryPath}").r("${meta.id}",()=>require("marko-widgets").defineWidget(require("${meta.widgetBind}")));`
              : `import {defineWidget} from "marko-widgets";import {r} from "${registryPath}";r("${meta.id}",()=>defineWidget(widget));import widget from "${meta.widgetBind}";`,
        });
      }
    },
  },
} satisfies t.Visitor;

function existsRelative(file: t.BabelFile, relativePath: string) {
  try {
    return file.markoOpts.fileSystem
      .statSync(path.resolve(file.opts.filename as string, "..", relativePath))
      .isFile();
  } catch {
    return false;
  }
}
