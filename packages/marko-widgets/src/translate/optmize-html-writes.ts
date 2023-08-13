import type { types as t } from "@marko/compiler";
import { normalizeTemplateString } from "@marko/babel-utils";

const mergeWriteCallsVisitor = {
  // Merges any two or more consecutive out.write calls.
  ExpressionStatement(expr) {
    const firstContent = getOutContent(expr);
    if (!firstContent) return;

    let curExpr: t.NodePath<any> = expr.getNextSibling();
    if (!curExpr) return;

    const secondContent = getOutContent(curExpr);
    if (!secondContent) return;

    const quasis = ["", "", ""];
    const expressions: t.Expression[] = [firstContent, secondContent];
    let nextExpr = curExpr;

    while ((nextExpr = curExpr.getNextSibling())) {
      const nextContent = getOutContent(nextExpr);
      if (!nextContent) break;
      curExpr.remove();
      quasis.push("");
      expressions.push(nextContent);
      curExpr = nextExpr;
    }

    (expr.get("expression") as t.NodePath<t.CallExpression>)
      .get("arguments")[0]
      .replaceWith(normalizeTemplateString(quasis, ...expressions));
  },
} satisfies t.Visitor;

export function optimizeHTMLWrites(program: t.NodePath<t.Program>) {
  const {
    hub: {
      file: { markoOpts },
    },
  } = program;

  if (markoOpts.optimize && markoOpts.output === "html") {
    program.traverse(mergeWriteCallsVisitor);
  }
}

function getOutContent(path: t.NodePath<t.Node>) {
  let { node } = path;
  if (!node) return;

  if (node.type === "ExpressionStatement") {
    node = node.expression;
  }

  if (
    node.type === "CallExpression" &&
    node.callee.type === "MemberExpression" &&
    node.callee.object.type === "Identifier" &&
    node.callee.object.name === "out"
  ) {
    return node.arguments[0] as t.Expression | undefined;
  }
}
