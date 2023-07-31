import path from "path";
import { types as t } from "@marko/compiler";
import { diagnosticDeprecate, diagnosticError } from "@marko/babel-utils";

declare module "@marko/compiler" {
  interface MarkoMeta {
    widgetBind?: string;
  }
}

export default {
  MarkoAttribute(attr) {
    const { node } = attr;
    if (node.name !== "w-bind") return;

    const { file } = attr.hub;
    const meta = file.metadata.marko;

    if (node.value.type === "BooleanLiteral" && node.value.value === true) {
      meta.widgetBind = existsRelative(file, "widget.js")
        ? "./widget.js"
        : "./index.js";
    } else if (node.value.type === "StringLiteral") {
      meta.widgetBind = node.value.value;
    }

    if (!meta.widgetBind) {
      diagnosticError(attr, {
        label: "Invalid value for w-bind, expected a string literal or 'true'",
      });

      attr.remove();
      return;
    }

    const base = path.basename(file.opts.filename as string);
    const registryPath = `marko/${
      file.markoOpts.optimize ? "dist" : "src"
    }/runtime/components/registry`;
    meta.deps.push({
      type: "js",
      path: `./${base}`,
      virtualPath: `./${base}.register.js`,
      code:
        file.markoOpts.modules === "cjs"
          ? `require("${registryPath}").r("${meta.id}",()=>require("marko-widgets").defineWidget(require("${meta.widgetBind}")));`
          : `import {defineWidget} from "marko-widgets";import widget from "${meta.widgetBind}";import {r} from "${registryPath}";r("${meta.id}",()=>widget);`,
    });

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
