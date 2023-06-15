import { types as t } from "@marko/compiler";
import { diagnosticDeprecate, parseExpression } from "@marko/babel-utils";

export default {
  MarkoAttribute(attr) {
    const {
      node: { name, value, start },
    } = attr;
    if (
      /^\$\{.*}$/m.test(name) &&
      t.isBooleanLiteral(value) &&
      value.value === true
    ) {
      diagnosticDeprecate(attr, {
        label:
          'The "<tag ${attributes}>" syntax is deprecated. Please use "...attributes" instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-w‐*-Attributes',
        fix() {
          attr.replaceWith(
            t.markoSpreadAttribute(
              parseExpression(
                attr.hub.file,
                name.slice(2, -1),
                start ? start + 2 : undefined
              )
            )
          );
        },
      });
    }
  },
} satisfies t.Visitor;
