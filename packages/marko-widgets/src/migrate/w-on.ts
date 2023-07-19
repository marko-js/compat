import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";

export default {
  MarkoAttribute(attr) {
    const { node } = attr;
    if (!node.name.startsWith("w-on")) return;
    diagnosticDeprecate(attr, {
      label: `The "w-on*" attributes are deprecated. Please use "on*()" instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-w‐*-Attributes`,
      fix() {
        attr.replaceWith(
          t.markoAttribute(
            node.name.slice(2),
            t.booleanLiteral(true),
            node.modifier,
            [node.value],
            node.default,
          ),
        );
      },
    });
  },
} satisfies t.Visitor;
