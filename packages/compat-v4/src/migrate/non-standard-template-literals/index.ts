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
  const { file } = string.hub;
  const replacement = parseAllNonStandardTemplateLiterals(file, string.node);
  if (replacement) {
    if (t.isTemplateLiteral(replacement)) {
      if (replacement.expressions.every(isNotNullish)) {
        diagnosticDeprecate(string, {
          label: "Non-standard template literals are deprecated.",
          fix() {
            string.replaceWith(replacement);
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
                string.replaceWith(replacement);
              } else {
                string.replaceWith(
                  t.templateLiteral(
                    replacement.quasis,
                    replacement.expressions.map((expr) => {
                      return isNotNullish(expr)
                        ? expr
                        : castNullishToString(file, expr as t.Expression);
                    }),
                  ),
                );
              }
            },
          },
        });
      }
    } else {
      diagnosticDeprecate(string, {
        label: "Non-standard template literals are deprecated.",
        fix() {
          string.replaceWith(replacement);
        },
      });
    }
  }
}

function parseAllNonStandardTemplateLiterals(
  file: t.BabelFile,
  node: t.StringLiteral,
) {
  const templateLiteral = parseNonStandardTemplateLiteral(file, node);
  if (templateLiteral) {
    for (let i = templateLiteral.expressions.length; i--; ) {
      traverseWithParent(
        file,
        templateLiteral.expressions[i],
        templateLiteral,
        i,
        replaceNestedNonStandardTemplateLiteral,
      );
    }

    return isSingleExpressionTemplateLiteral(templateLiteral)
      ? templateLiteral.expressions[0]
      : templateLiteral;
  }
}

function replaceNestedNonStandardTemplateLiteral(
  file: t.BabelFile,
  node: t.Node,
  parent: t.Node,
  key: string | number,
) {
  if (node.type === "StringLiteral") {
    (parent as any)[key] =
      parseAllNonStandardTemplateLiterals(file, node) || node;
  }
}

function castNullishToString(file: t.BabelFile, expression: t.Expression) {
  let nullishHelper = nullishHelpers.get(file.hub);
  if (!nullishHelper) {
    nullishHelper = file.path.scope.generateUidIdentifier("toString");
    nullishHelpers.set(file.hub, nullishHelper);
    file.path.unshiftContainer(
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

function isSingleExpressionTemplateLiteral(templateLiteral: t.TemplateLiteral) {
  return (
    templateLiteral.expressions.length === 1 &&
    templateLiteral.quasis.length === 2 &&
    templateLiteral.quasis[0].value.raw === "" &&
    templateLiteral.quasis[1].value.raw === ""
  );
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

function traverseWithParent(
  file: t.BabelFile,
  node: t.Node | null | undefined,
  parent: t.Node,
  key: string | number,
  enter: (
    file: t.BabelFile,
    node: t.Node,
    parent: t.Node,
    key: string | number,
  ) => void,
): void {
  if (!node) return;

  const keys = (t as any).VISITOR_KEYS[node.type];
  if (!keys) return;

  enter(file, node, parent, key);

  for (const key of keys) {
    const value: t.Node | undefined | null = (node as any)[key];

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        traverseWithParent(file, value[i], value, i, enter);
      }
    } else {
      traverseWithParent(file, value, parent, key, enter);
    }
  }
}
