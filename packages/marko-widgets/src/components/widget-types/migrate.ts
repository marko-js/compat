import { types as t } from "@marko/compiler";
import { diagnosticDeprecate, diagnosticError } from "@marko/babel-utils";

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
    const meta = file.metadata.marko;
    const widgetTypes: Record<string, string> = (meta.widgetBind = {});

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

      widgetTypes[node.name] = node.value.value;
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
