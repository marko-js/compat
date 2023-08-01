import path from "path";
import { types as t } from "@marko/compiler";
import { diagnosticDeprecate, diagnosticError } from "@marko/babel-utils";

declare module "@marko/compiler" {
  interface MarkoMeta {
    widgetBind?: string | true;
  }
}

export default {
  MarkoAttribute(attr) {
    const { node } = attr;
    if (node.name !== "w-bind") return;

    const { file } = attr.hub;
    const meta = file.metadata.marko;
    let widgetBind: string | true | undefined;

    if (node.value.type === "BooleanLiteral" && node.value.value === true) {
      widgetBind = existsRelative(file, "widget.js")
        ? "./widget.js"
        : "./index.js";
    } else if (node.value.type === "StringLiteral") {
      widgetBind = node.value.value;
    }

    if (!widgetBind) {
      diagnosticError(attr, {
        label: "Invalid value for w-bind, expected a string literal or 'true'",
      });

      attr.remove();
      return;
    }

    meta.widgetBind = widgetBind;

    diagnosticDeprecate(attr, {
      label:
        "Legacy components using w-bind and defineRenderer/defineComponent or defineWidget are deprecated. See: https://github.com/marko-js/marko/issues/421",
      fix() {
        attr.replaceWithMultiple([
          t.markoAttribute("key", t.stringLiteral("_wbind")),
          t.markoAttribute("id", t.stringLiteral("_wbind"), "scoped"),
        ]);
      },
    });
  },
  Program: {
    exit(program) {
      const { file } = program.hub;
      const meta = file.metadata.marko;
      const { widgetBind } = meta;
      if (!widgetBind) return;

      const isCJS = file.markoOpts.modules === "cjs";
      const base = path.basename(file.opts.filename as string);
      const registryPath = `marko/${
        file.markoOpts.optimize ? "dist" : "src"
      }/runtime/components/registry.js`;
      meta.deps.push({
        type: "js",
        path: `./${base}`,
        virtualPath: `./${base}.register.js`,
        code:
          widgetBind === true
            ? isCJS
              ? `require("${registryPath}").r("${meta.id}",()=>require("marko-widgets").defineWidget({}));`
              : `import {defineWidget} from "marko-widgets";import {r} from "${registryPath}";r("${meta.id}",()=>defineWidget({}));`
            : isCJS
            ? `require("${registryPath}").r("${meta.id}",()=>require("marko-widgets").defineWidget(require("${widgetBind}")));`
            : `import widget from "${widgetBind}";import {defineWidget} from "marko-widgets";import {r} from "${registryPath}";r("${meta.id}",()=>defineWidget(widget));`,
      });
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
