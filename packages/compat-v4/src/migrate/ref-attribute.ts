import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";

export default {
  MarkoAttribute(attr) {
    const {
      node: { name },
    } = attr;

    if (name !== "ref") return;

    diagnosticDeprecate(attr, {
      label:
        'The "ref" attribute is deprecated. Please use the "key" attribute instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-ref-attribute',
      fix() {
        attr.replaceWith(
          t.markoAttribute(
            "key",
            attr.node.value,
            attr.node.modifier,
            attr.node.arguments,
            attr.node.default,
          ),
        );
      },
    });
  },
} satisfies t.Visitor;
