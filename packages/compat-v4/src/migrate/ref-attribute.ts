import { types as t } from "@marko/compiler";
import { diagnosticDeprecate, getTagDef } from "@marko/babel-utils";

export default {
  MarkoAttribute(attr) {
    const {
      node: { name },
    } = attr;

    if (name !== "ref") return;

    const tag = attr.parentPath as t.NodePath<t.MarkoTag>;

    switch (getTagDef(tag)?.taglibId) {
      case "marko-widgets":
      case "@marko/compat-v4":
        return;
    }

    diagnosticDeprecate(attr, {
      label:
        'The "ref" attribute is deprecated. Please use the "key" attribute instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-ref-attribute',
      fix() {
        attr.node.name = "key";
      },
    });
  },
} satisfies t.Visitor;
