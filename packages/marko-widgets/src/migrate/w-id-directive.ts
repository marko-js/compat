import { types as t } from "@marko/compiler";
import {
  diagnosticDeprecate,
  isDynamicTag,
  isNativeTag,
} from "@marko/babel-utils";
import { hasAttribute } from "@marko/compat-utils";

export default {
  MarkoAttribute(attr) {
    const { node } = attr;
    if (node.name !== "w-id") return;

    attr.hub.file.metadata.marko.widgetBind ||= true;

    diagnosticDeprecate(attr, {
      label: `The "w-id" attribute is deprecated. Please use "key" attribute instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-w‐*-Attributes`,
      fix() {
        const tag = attr.parentPath as t.NodePath<t.MarkoTag>;
        const value = attr.node.value;

        if (
          !hasAttribute(tag, "id") &&
          !(value.type === "StringLiteral" && value.value.endsWith("[]")) &&
          (isNativeTag(tag) || isDynamicTag(tag))
        ) {
          tag.unshiftContainer(
            "attributes",
            t.markoAttribute("id", value, "scoped"),
          );
        }

        attr.replaceWith(t.markoAttribute("key", value));
      },
    });
  },
} satisfies t.Visitor;
