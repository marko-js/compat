import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";
import { isMemberProperty } from "@marko/compat-utils";

export default {
  Identifier(id) {
    if (
      id.node.name === "widget" &&
      !id.scope.hasBinding("widget", true) &&
      id.isReferencedIdentifier()
    ) {
      if (
        id.parentPath.isMemberExpression() &&
        isMemberProperty(id.parentPath.node, "elId") &&
        id.parentPath.parentPath.isCallExpression() &&
        id.parentPath.parentPath.node.arguments.length <= 1 &&
        id.parentPath.parentPath.parentPath.isMarkoAttribute()
      ) {
        diagnosticDeprecate(id, {
          label:
            "The widget.elId() method is deprecated. In this case it can be refactored to used the :scoped modifier.",
          fix() {
            const call = id.parentPath
              .parentPath as t.NodePath<t.CallExpression>;
            const attr = call.parentPath as t.NodePath<t.MarkoAttribute>;
            attr.replaceWith(
              t.markoAttribute(
                attr.node.name,
                (call.node.arguments[0] as t.Expression | undefined) ||
                  t.booleanLiteral(true),
                "scoped",
              ),
            );
          },
        });
      } else {
        diagnosticDeprecate(id, {
          label: `The "widget" variable is deprecated. Please use "component" instead.`,
          fix() {
            const newId = t.identifier("component");
            newId.start = id.node.start;
            newId.end = id.node.end;
            newId.loc = id.node.loc;
            id.replaceWith(newId);
          },
        });
      }
    }
  },
} satisfies t.Visitor;
