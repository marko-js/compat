import path from "path";
import { types as t } from "@marko/compiler";
import {
  diagnosticDeprecate,
  diagnosticError,
  getTemplateId,
} from "@marko/babel-utils";

export default {
  exit(tag: t.NodePath<t.MarkoTag>) {
    if (!tag.node.attributes.length) {
      diagnosticError(tag, {
        label: "The <widget-types> tag require a attributes.",
        fix() {
          tag.remove();
        },
      });
      return;
    }

    const { file } = tag.hub;
    const { markoOpts } = file;
    const meta = file.metadata.marko;
    const isCJS = markoOpts.modules === "cjs";
    const widgetTypes: Record<string, string> = (meta.widgetBind = {});
    const templateFileName = file.opts.filename as string;
    const registryPath = `marko/${
      file.markoOpts.optimize ? "dist" : "src"
    }/runtime/components/registry.js`;

    for (const attr of tag.get("attributes")) {
      const { node } = attr;
      if (
        node.type !== "MarkoAttribute" ||
        node.value.type !== "StringLiteral"
      ) {
        diagnosticError(attr, {
          label:
            "All attribute values for the <widget-types> tag must be a string literal.",
          fix() {
            tag.remove();
          },
        });
        continue;
      }

      const { name } = node;
      const request = node.value.value;
      const id = (widgetTypes[name] = getTemplateId(
        file.markoOpts.optimize,
        path.resolve(
          templateFileName,
          "..",
          request.replace(/^\.\/?$/, "./index"),
        ),
      ));
      meta.deps.push({
        type: "js",
        virtualPath: `./${path.basename(templateFileName)}.${name.replace(
          /[/\\:]/g,
          "_",
        )}.register.js`,
        code: isCJS
          ? `require("${registryPath}").r("${id}",()=>require("marko-widgets").defineWidget(require("${request}")));`
          : `import widget from "${request}";import {defineWidget} from "marko-widgets";import {r} from "${registryPath}";r("${id}",()=>defineWidget(widget));`,
      });
    }

    diagnosticDeprecate(tag, {
      label:
        "The <widget-types> tag is deprecated. Please remove it. See: https://github.com/marko-js/marko/issues/514",
      fix() {
        tag.remove();
      },
    });
  },
};
