import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";

export default {
  MarkoAttribute(attr) {
    const { node } = attr;
    if (node.name !== "w-body") return;

    diagnosticDeprecate(attr, {
      label:
        'The "w-body" attribute is deprecated. Please use the "<${dynamicTag}/>" tag instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-Widget-body-(w‐body)',
      fix() {
        const tag = attr.parentPath as t.NodePath<t.MarkoTag>;
        let bodyValue = node.value;
        let needsGuard = false;

        attr.remove();

        if (isDefaultAttributeValue(node)) {
          bodyValue = t.identifier("input");
        } else if (
          !(
            bodyValue.type === "MemberExpression" &&
            bodyValue.property.type === "Identifier" &&
            bodyValue.property.name === "renderBody"
          )
        ) {
          needsGuard = true;
        }

        if (needsGuard) {
          tag.set(
            "body",
            t.markoTagBody([
              t.markoTag(
                t.stringLiteral("if"),
                [],
                t.markoTagBody([t.markoPlaceholder(bodyValue)]),
                [
                  t.binaryExpression(
                    "===",
                    t.unaryExpression("typeof", bodyValue),
                    t.stringLiteral("string"),
                  ),
                ],
              ),
              t.markoTag(
                t.stringLiteral("else"),
                [],
                t.markoTagBody([t.markoTag(bodyValue, [], tag.node.body)]),
              ),
            ]),
          );
        } else {
          tag.set(
            "body",
            t.markoTagBody([t.markoTag(bodyValue, [], tag.node.body)]),
          );
        }
      },
    });
  },
} satisfies t.Visitor;

function isDefaultAttributeValue(
  node: t.MarkoAttribute | t.MarkoSpreadAttribute,
) {
  return (
    node.type === "MarkoAttribute" &&
    !node.value.loc &&
    node.value.type === "BooleanLiteral" &&
    node.value.value
  );
}
