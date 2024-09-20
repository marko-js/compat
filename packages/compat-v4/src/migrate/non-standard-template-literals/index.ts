import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";
import { parseNonStandardTemplateLiteral } from "./parse";

const nullishHelpers = new WeakMap<t.Hub, t.Identifier>();
const stringVisitor = {
  StringLiteral,
} satisfies t.Visitor;

export default {
  MarkoPlaceholder(placeholder) {
    placeholder.traverse(stringVisitor);
  },
  MarkoTag(tag) {
    if (tag.node.arguments) {
      for (const arg of tag.get("arguments") as t.NodePath<
        t.Expression | t.SpreadElement
      >[]) {
        migrateNonStandardTemplateLiterals(arg);
      }
    }

    for (const attr of tag.get("attributes")) {
      migrateNonStandardTemplateLiterals(attr.get("value"));

      if (attr.isMarkoAttribute()) {
        if (attr.node.arguments) {
          for (const arg of attr.get("arguments") as t.NodePath<
            t.Expression | t.SpreadElement
          >[]) {
            migrateNonStandardTemplateLiterals(arg);
          }
        }
      }
    }
  },
} satisfies t.Visitor;

export function migrateNonStandardTemplateLiterals(path: t.NodePath<t.Node>) {
  if (path.isStringLiteral()) {
    StringLiteral(path);
  } else {
    path.traverse(stringVisitor);
  }
}

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
                      : castNullishToString(string, expr as t.Expression);
                  }),
                ),
              );
            }
          },
        },
      });
    }
  }
}

function castNullishToString(string: t.NodePath, expression: t.Expression) {
  let nullishHelper = nullishHelpers.get(string.hub);
  if (!nullishHelper) {
    nullishHelper = string.scope.generateUidIdentifier("toString");
    nullishHelpers.set(string.hub, nullishHelper);
    string.hub.file.path.unshiftContainer(
      "body",
      t.markoScriptlet(
        [
          t.functionDeclaration(
            nullishHelper,
            [t.identifier("value")],
            t.blockStatement([
              t.returnStatement(
                t.conditionalExpression(
                  t.binaryExpression(
                    "==",
                    t.identifier("value"),
                    t.nullLiteral(),
                  ),
                  t.stringLiteral(""),
                  t.identifier("value"),
                ),
              ),
            ]),
          ),
        ],
        true,
      ),
    );
  }
  return t.callExpression(nullishHelper, [expression]);
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
