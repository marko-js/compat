import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";
import { isSourceBooleanAttribute } from "@marko/compat-utils";

export default {
  MarkoAttribute(attr) {
    const { node } = attr;
    if (node.name !== "w-config") return;

    diagnosticDeprecate(attr, {
      label:
        'The "w-config" attribute is deprecated. See: https://github.com/marko-js/marko/wiki/Deprecation:-w‐config',
      fix() {
        const tag = attr.parentPath as t.NodePath<t.MarkoTag>;
        attr.remove();

        if (!isSourceBooleanAttribute(node)) {
          tag.insertBefore(
            t.markoScriptlet([
              t.expressionStatement(
                t.assignmentExpression(
                  "=",
                  t.memberExpression(
                    t.identifier("component"),
                    t.identifier("widgetConfig"),
                  ),
                  node.value,
                ),
              ),
            ]),
          );
        }
      },
    });
  },
} satisfies t.Visitor;
