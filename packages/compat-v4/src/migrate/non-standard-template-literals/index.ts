import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";
import { parseNonStandardTemplateLiteral } from "./parse";

const stringVisitor = {
  StringLiteral,
} satisfies t.Visitor;

export default {
  MarkoPlaceholder(placeholder) {
    placeholder.traverse(stringVisitor);
  },
  MarkoAttribute(attr) {
    const value = attr.get("value");

    if (value.isStringLiteral()) {
      StringLiteral(value);
    } else {
      value.traverse(stringVisitor);
    }
  },
} satisfies t.Visitor;

function StringLiteral(string: t.NodePath<t.StringLiteral>) {
  const templateLiteral = parseNonStandardTemplateLiteral(string);
  if (templateLiteral) {
    if (
      templateLiteral.expressions.length === 1 &&
      templateLiteral.quasis.length === 2 &&
      templateLiteral.quasis[0].value.raw === "" &&
      templateLiteral.quasis[1].value.raw === ""
    ) {
      diagnosticDeprecate(string, {
        label: "Non-standard template literals are deprecated.",
        fix() {
          string.replaceWith(templateLiteral.expressions[0]);
        },
      });
    } else if (templateLiteral.expressions.every(isNotNullish)) {
      diagnosticDeprecate(string, {
        label: "Non-standard template literals are deprecated.",
        fix() {
          string.replaceWith(templateLiteral);
        },
      });
    } else {
      diagnosticDeprecate(string, {
        label: "Non-standard template literals are deprecated.",
        fix: {
          type: "confirm",
          message:
            "Are the interpolated values guaranteed to not be null or undefined?",
          apply(confirm) {
            if (confirm) {
              string.replaceWith(templateLiteral);
            } else {
              string.replaceWith(
                t.templateLiteral(
                  templateLiteral.quasis,
                  templateLiteral.expressions.map((expr) => {
                    return isNotNullish(expr)
                      ? expr
                      : t.logicalExpression(
                          "??",
                          expr as t.Expression,
                          t.stringLiteral("")
                        );
                  })
                )
              );
            }
          },
        },
      });
    }
  }
}

function isNotNullish(node: t.Node): boolean {
  switch (node.type) {
    case "ArrayExpression":
    case "ArrowFunctionExpression":
    case "BigIntLiteral":
    case "BinaryExpression":
    case "BooleanLiteral":
    case "ClassExpression":
    case "DecimalLiteral":
    case "FunctionExpression":
    case "NewExpression":
    case "NumericLiteral":
    case "ObjectExpression":
    case "RegExpLiteral":
    case "StringLiteral":
    case "TemplateLiteral":
    case "UpdateExpression":
      return true;
    case "AwaitExpression":
    case "YieldExpression":
      return node.argument != null && isNotNullish(node.argument);
    case "ConditionalExpression":
      return isNotNullish(node.consequent) && isNotNullish(node.alternate);
    case "LogicalExpression":
      return node.operator !== "&&" && isNotNullish(node.right);
    case "SequenceExpression":
      return isNotNullish(node.expressions[node.expressions.length - 1]);
    case "UnaryExpression":
      return node.operator !== "void";
    default:
      return false;
  }
}
