import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";
import { getAttribute } from "@marko/compat-utils";

export default {
  MarkoAttribute(attr) {
    const { node } = attr;
    switch (node.name) {
      case "w-for":
      case "for-key":
      case "for-ref":
        break;
      default:
        return;
    }
    const tag = attr.parentPath as t.NodePath<t.MarkoTag>;
    const forAttr = getAttribute(tag, "for");
    if (forAttr) {
      diagnosticDeprecate(attr, {
        label: `The "${node.name}" attribute cannot be used in conjunction with the "for" attribute.`,
      });
      attr.remove();
      return;
    }

    diagnosticDeprecate(attr, {
      label: `The "${node.name}" attribute is deprecated. Please use "for:scoped" instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-w‐*-Attributes`,
      fix() {
        attr.replaceWith(t.markoAttribute("for", node.value, "scoped"));
      },
    });
  },
} satisfies t.Visitor;
