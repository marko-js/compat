import { diagnosticDeprecate } from "@marko/babel-utils";
import { types as t } from "@marko/compiler";

export default {
  MarkoScriptlet(scriptlet) {
    const replacedBody: t.MarkoTagBody["body"] = [];
    let replaced = false;
    for (const node of scriptlet.node.body) {
      if (replaceRenderCallStatements(node, replacedBody)) {
        replaced = true;
      } else {
        replacedBody.push(t.markoScriptlet([node]));
      }
    }
    if (replaced) {
      diagnosticDeprecate(scriptlet, {
        label:
          "Directly rendering by passing `out` to a function is deprecated. Please use the dynamic tag instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-imperative-render-calls",
        loc: scriptlet.node.loc || scriptlet.node.body[0].loc || false,
        fix() {
          scriptlet.replaceWithMultiple(replacedBody);
        },
      });
    }
  },
} satisfies t.Visitor;

function renderCallToDynamicTag(
  callExpression: t.CallExpression
): false | t.MarkoTag {
  const { callee, arguments: args } = callExpression;
  const outIndex = args.findIndex(
    (arg) => arg.type === "Identifier" && arg.name === "out"
  );

  if (outIndex === -1) return false;
  if (t.isV8IntrinsicIdentifier(callee)) return false;

  const argsLen = args.length;
  let tagArgs: t.MarkoTag["arguments"] = null;
  let tagName: t.Expression;

  if (outIndex === 0) {
    // Handles cases for the following:
    // 1. input.renderBody(out) --> <${input}/>
    // 2. input.renderThing(out) --> <${input.renderThing}/>
    // 3. input.renderBody(out, attrs) --> <${input}(attrs)/>
    // 4. renderBody(out) --> <${renderBody}/>
    if (argsLen > 1) {
      tagArgs = args.slice(1) as t.MarkoTag["arguments"];
    }

    // Removes `.renderBody` which is optional.
    tagName =
      callee.type === "MemberExpression" &&
      isIdentifierOrStringNamed(callee.property, "renderBody")
        ? callee.object
        : callee;
  } else if (outIndex === 1 && args.length <= 2) {
    // Handles cases for the following:
    // 1. input.template.render({}, out) --> <${input.template}({})/>
    // 2. input.template.renderer({}, out) --> <${input.template}({})/>
    // 3. input.barRenderer({}, out) --> <${{ render:input.barRenderer }}({})/>

    const [arg] = args;
    if (
      !(
        t.isNullLiteral(arg) ||
        (t.isObjectExpression(arg) && arg.properties.length === 0)
      )
    ) {
      tagArgs = [arg] as t.MarkoTag["arguments"];
    }

    tagName =
      callee.type === "MemberExpression" &&
      (isIdentifierOrStringNamed(callee.property, "render") ||
        isIdentifierOrStringNamed(callee.property, "renderer"))
        ? callee.object
        : t.objectExpression([
            t.objectProperty(t.identifier("render"), callee),
          ]);
  } else {
    // Handles worst case scenario:
    // 1. input.barRenderer({}, true, out) --> <${(out) => input.barRenderer({}, true, out)}/>
    tagName = t.arrowFunctionExpression([t.identifier("out")], callExpression);
  }

  return t.markoTag(tagName, [], t.markoTagBody([]), tagArgs);
}

function replaceRenderCallExpression(
  node: t.Expression,
  body: t.MarkoTagBody["body"]
): boolean {
  switch (node.type) {
    case "CallExpression": {
      const dynamicTag = renderCallToDynamicTag(node);
      if (dynamicTag) {
        body.push(dynamicTag);
        return true;
      }
      return false;
    }
    case "LogicalExpression": {
      const consequentBody: t.MarkoTagBody["body"] = [];
      if (replaceRenderCallExpression(node.right, consequentBody)) {
        body.push(
          t.markoTag(
            t.stringLiteral("if"),
            [],
            t.markoTagBody(consequentBody),
            [
              node.operator === "||"
                ? t.unaryExpression("!", node.left)
                : node.operator === "??"
                ? t.binaryExpression(
                    "===",
                    node.left,
                    t.unaryExpression("void", t.numericLiteral(0))
                  )
                : node.left,
            ]
          )
        );

        return true;
      }

      return false;
    }
    case "ConditionalExpression": {
      const consequentBody: t.MarkoTagBody["body"] = [];
      const alternateBody: t.MarkoTagBody["body"] = [];
      if (
        replaceRenderCallExpression(node.consequent, consequentBody) ||
        replaceRenderCallExpression(node.alternate, alternateBody)
      ) {
        body.push(
          t.markoTag(
            t.stringLiteral("if"),
            [],
            t.markoTagBody(
              consequentBody.length
                ? consequentBody
                : [t.markoScriptlet([t.expressionStatement(node.consequent)])]
            ),
            [node.test]
          ),
          t.markoTag(
            t.stringLiteral("else"),
            [],
            t.markoTagBody(
              alternateBody.length
                ? alternateBody
                : [t.markoScriptlet([t.expressionStatement(node.alternate)])]
            )
          )
        );

        return true;
      }
      return false;
    }

    default:
      return false;
  }
}

function replaceRenderCallStatements(
  node: t.Statement,
  body: t.MarkoTagBody["body"]
): boolean {
  switch (node.type) {
    case "ExpressionStatement":
      return replaceRenderCallExpression(node.expression, body);
    case "BlockStatement": {
      let replaced = false;
      for (const child of node.body) {
        if (replaceRenderCallStatements(child, body)) {
          replaced = true;
        } else {
          body.push(t.markoScriptlet([child]));
        }
      }

      return replaced;
    }
    case "IfStatement": {
      const consequentBody: t.MarkoTagBody["body"] = [];
      const alternateBody: t.MarkoTagBody["body"] = [];
      if (
        replaceRenderCallStatements(node.consequent, consequentBody) ||
        (node.alternate &&
          replaceRenderCallStatements(node.alternate, alternateBody))
      ) {
        body.push(
          t.markoTag(
            t.stringLiteral("if"),
            [],
            t.markoTagBody(
              consequentBody.length
                ? consequentBody
                : [t.markoScriptlet([node.consequent])]
            ),
            [node.test]
          )
        );

        if (node.alternate) {
          body.push(
            t.markoTag(
              t.stringLiteral("else"),
              [],
              t.markoTagBody(
                alternateBody.length
                  ? alternateBody
                  : [t.markoScriptlet([node.alternate])]
              )
            )
          );
        }

        return true;
      }

      return false;
    }
    case "ForOfStatement": {
      if (node.left.type === "VariableDeclaration") {
        const forBody: t.MarkoTagBody["body"] = [];
        if (replaceRenderCallStatements(node.body, forBody)) {
          body.push(
            t.markoTag(
              t.stringLiteral("for"),
              [t.markoAttribute("of", node.right)],
              t.markoTagBody(forBody, [
                node.left.declarations[0].id as t.Identifier,
              ])
            )
          );
          return true;
        }
      }

      return false;
    }
    case "ForInStatement": {
      if (node.left.type === "VariableDeclaration") {
        const forBody: t.MarkoTagBody["body"] = [];
        if (replaceRenderCallStatements(node.body, forBody)) {
          body.push(
            t.markoTag(
              t.stringLiteral("for"),
              [t.markoAttribute("in", node.right)],
              t.markoTagBody(forBody, [
                node.left.declarations[0].id as t.Identifier,
              ])
            )
          );
          return true;
        }
      }

      return false;
    }
    case "ForStatement": {
      const forBody: t.MarkoTagBody["body"] = [];
      if (replaceRenderCallStatements(node.body, forBody)) {
        forBody.push(
          t.markoScriptlet([
            t.isStatement(node.update)
              ? node.update
              : t.expressionStatement(node.update as t.Expression),
          ])
        );
        body.push(
          t.markoScriptlet([
            t.isStatement(node.init)
              ? node.init
              : t.expressionStatement(node.init as t.Expression),
          ]),
          t.markoTag(t.stringLiteral("while"), [], t.markoTagBody(forBody), [
            node.test || t.booleanLiteral(true),
          ])
        );
        return true;
      }

      return false;
    }
    case "WhileStatement": {
      const whileBody: t.MarkoTagBody["body"] = [];
      if (replaceRenderCallStatements(node.body, whileBody)) {
        body.push(
          t.markoTag(t.stringLiteral("while"), [], t.markoTagBody(whileBody), [
            node.test,
          ])
        );
        return true;
      }

      return false;
    }
    default:
      return false;
  }
}

function isIdentifierOrStringNamed(
  expr: t.MemberExpression["property"],
  name: string
) {
  return (
    (expr.type === "Identifier" && expr.name === name) ||
    (expr.type === "StringLiteral" && expr.value === name)
  );
}
