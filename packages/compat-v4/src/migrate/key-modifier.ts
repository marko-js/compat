import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";

export default {
  MarkoAttribute(attr) {
    const {
      node: { modifier },
    } = attr;

    if (modifier !== "key") return;

    diagnosticDeprecate(attr, {
      label: 'The ":key" directive is deprecated. Please use ":scoped".',
      fix() {
        attr.node.modifier = "scoped";
      },
    });
  },
} satisfies t.Visitor;
