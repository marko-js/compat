import { types as t } from "@marko/compiler";
import { diagnosticError, getLocRange } from "@marko/babel-utils";

export default {
  exit(tag: t.NodePath<t.MarkoTag>) {
    if (!tag.node.attributes.length) {
      diagnosticError(tag, {
        label: "The <invoke> tag requires a value.",
        fix() {
          tag.remove();
        },
      });
      return;
    }

    const attrs = tag.get("attributes");
    const functionAttr = attrs[0] as t.NodePath<t.MarkoAttribute>;
    if (
      !(
        isDefaultAttributeValue(functionAttr.node) &&
        functionAttr.node.arguments
      )
    ) {
      diagnosticError(functionAttr, {
        label: "The <invoke> tag requires a function call.",
        fix() {
          tag.remove();
        },
      });
      return;
    }

    for (const attr of attrs) {
      if (t.isMarkoSpreadAttribute(attr.node)) {
        diagnosticError(attr, {
          label: "Spread attributes are not supported in <invoke> tags.",
          fix() {
            attr.remove();
          },
        });
        break;
      }
    }

    const { file } = tag.hub;
    const start = functionAttr.node.start;
    const callIdentifier = t.identifier(functionAttr.node.name);
    const callExpression = t.callExpression(
      callIdentifier,
      functionAttr.node.arguments,
    );
    if (start != null) {
      withLoc(
        file,
        callIdentifier,
        start,
        start + functionAttr.node.name.length,
      );

      withLoc(file, callExpression, start, functionAttr.node.end!);
    }

    tag.replaceWith(
      t.markoScriptlet([t.expressionStatement(callExpression)], false),
    );
  },
};

function withLoc<T extends t.Node>(
  file: t.BabelFile,
  node: T,
  start: number,
  end: number,
): T {
  node.loc = getLocRange(file, start, end);
  node.start = start;
  node.end = end;
  return node;
}

function isDefaultAttributeValue(
  node: t.MarkoAttribute | t.MarkoSpreadAttribute,
): node is t.MarkoAttribute {
  return (
    node.type === "MarkoAttribute" &&
    !node.value.loc &&
    node.value.type === "BooleanLiteral" &&
    node.value.value
  );
}
