import { types as t } from "@marko/compiler";
import { diagnosticDeprecate, isNativeTag } from "@marko/babel-utils";

export default {
  MarkoAttribute(attr) {
    const {
      node: { modifier },
    } = attr;

    switch (modifier) {
      case null:
      case undefined:
      case "scoped":
      case "no-update":
        return;
    }

    if (!isNativeTag(attr.parentPath as t.NodePath<t.MarkoTag>)) return;

    diagnosticDeprecate(attr, {
      label: "Namespaced attributes are deprecated.",
    });
    attr.node.name += `:${modifier}`;
    attr.node.modifier = null;
  },
} satisfies t.Visitor;
