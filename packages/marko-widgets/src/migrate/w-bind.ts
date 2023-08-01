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

    if (typeof meta.widgetBind === "object") {
      diagnosticDeprecate(attr, {
        label:
          "Legacy components using w-bind with <widget-types> are deprecated. See: https://github.com/marko-js/marko/issues/421",
      });
      return;
    }

    if (node.value.type === "BooleanLiteral" && node.value.value === true) {
      meta.widgetBind = existsRelative(file, "widget.js")
        ? "./widget.js"
        : "./index.js";
    } else if (node.value.type === "StringLiteral") {
      meta.widgetBind = node.value.value;
    }

    if (!meta.widgetBind) {
      diagnosticError(attr, {
        label:
          "Invalid value for w-bind, expected a string literal or 'true'. Alternatively <widget-types> must be defined.",
      });

      attr.remove();
      return;
    }

    diagnosticDeprecate(attr, {
      label:
        "Legacy components using w-bind, <widget-types> and defineRenderer/defineComponent or defineWidget are deprecated. See: https://github.com/marko-js/marko/issues/421",
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
