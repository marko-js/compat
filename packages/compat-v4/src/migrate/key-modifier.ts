import { types as t } from "@marko/compiler";
import { diagnosticDeprecate, getTagDef } from "@marko/babel-utils";

export default {
  MarkoAttribute(attr) {
    const {
      node: { modifier },
    } = attr;

    if (modifier !== "key") return;

    const tag = attr.parentPath as t.NodePath<t.MarkoTag>;

    switch (getTagDef(tag)?.taglibId) {
      case "marko-widgets":
      case "@marko/compat-v4":
        return;
    }

    diagnosticDeprecate(attr, {
      label: 'The ":key" directive is deprecated. Please use ":scoped".',
      fix() {
        attr.node.modifier = "scoped";
      },
    });
  },
} satisfies t.Visitor;
