import { types as t } from "@marko/compiler";
import { diagnosticDeprecate, parseExpression } from "@marko/babel-utils";
import { migrateNonStandardTemplateLiterals } from "./non-standard-template-literals";

export default {
  MarkoAttribute(attr) {
    const {
      node: { name, value, start, end },
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
          const [replacement] = attr.replaceWith(
            t.markoSpreadAttribute(
              start != null && end != null
                ? parseExpression(
                    attr.hub.file,
                    name.slice(2, -1),
                    start + 2,
                    end - 1,
                  )
                : parseExpression(attr.hub.file, name.slice(2, -1)),
            ),
          );

          migrateNonStandardTemplateLiterals(replacement.get("value"));
        },
      });
    }
  },
} satisfies t.Visitor;
