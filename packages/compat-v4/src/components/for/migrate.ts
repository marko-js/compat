import { types as t } from "@marko/compiler";
import {
  diagnosticDeprecate,
  diagnosticError,
  getEnd,
  getLocRange,
  getStart,
  parseExpression,
  parseParams,
  parseStatements,
  withLoc,
} from "@marko/babel-utils";
import { ForType, parseFor } from "./parse-for";

export default {
  exit(tag: t.NodePath<t.MarkoTag>) {
    const { node } = tag;
    const args = node.arguments;
    const len = args?.length;
    if (!len) return;

    const { file } = tag.hub;
    const start = getStart(file, args[0]);
    const end = getEnd(file, args[len - 1]);
    if (start == null || end == null) return;

    const source = file.code.slice(start, end);
    const parsed = parseFor(source);
    if (!parsed) return;

    switch (parsed.type) {
      case ForType.In: {
        const { scope } = tag.get("body");
        let params = (
          parsed.id.value
            ? parseParams(
                file,
                parsed.id.value,
                parsed.id.start + start,
                parsed.id.end + start,
              )
            : []
        ) as t.MarkoTagBody["params"];
        let inExpression = parsed.in.value
          ? parseExpression(
              file,
              parsed.in.value,
              parsed.in.start + start,
              parsed.in.end + start,
            )
          : null;

        if (inExpression === null || params.length === 0 || params.length > 2) {
          diagnosticError(tag, {
            label: "Invalid <for> arguments.",
            loc: args[0].loc || false,
          });
          tag.replaceWithMultiple(tag.node.body.body);
          return;
        }

        if (
          params.length === 1 &&
          inExpression.type !== "ArrayExpression" &&
          !(
            inExpression.type === "LogicalExpression" &&
            inExpression.operator === "||" &&
            inExpression.right.type === "ArrayExpression"
          )
        ) {
          inExpression = t.logicalExpression(
            "||",
            inExpression,
            t.arrayExpression(),
          );
        }

        const iteratorExpression =
          parsed.iterator?.value &&
          parseExpression(
            file,
            parsed.iterator.value,
            parsed.iterator.start + start,
            parsed.iterator.end + start,
          );

        const sepExpression =
          parsed.separator?.value &&
          parseExpression(
            file,
            parsed.separator.value,
            parsed.separator.start + start,
            parsed.separator.end + start,
          );
        let statusExpression = parsed.statusVar?.value
          ? parseExpression(
              file,
              parsed.statusVar.value,
              parsed.statusVar.start + start,
              parsed.statusVar.end + start,
            )
          : undefined;

        if (statusExpression) {
          if (statusExpression.type === "StringLiteral") {
            if (t.isValidIdentifier(statusExpression.value)) {
              const statusIdentifier = t.identifier(statusExpression.value);
              const statusExprStart = getStart(file, statusExpression);
              if (statusExprStart != null) {
                withLoc(
                  file,
                  statusIdentifier,
                  statusExprStart + 1,
                  getEnd(file, statusExpression)! - 1,
                );
              }

              statusExpression = statusIdentifier;
            }
          }

          if (statusExpression.type !== "Identifier") {
            diagnosticError(tag, {
              label: "Invalid <for> status variable.",
              loc: statusExpression.loc || false,
            });
            tag.replaceWithMultiple(tag.node.body.body);
            return;
          }
        }

        diagnosticDeprecate(tag, {
          label:
            'The "<for(x in y)>" syntax has been deprecated, checkout the modern syntax here: https://github.com/marko-js/marko/wiki/Deprecation:-legacy-for',
          fix() {
            let valueAttr = params.length === 1 ? "of" : "in";

            if (iteratorExpression) {
              const itemParamName =
                params.length === 1 && params[0].type === "Identifier"
                  ? params[0].name
                  : "it";
              const resultId = generateSafeIdentifier(scope, "result");
              inExpression = t.callExpression(
                t.arrowFunctionExpression(
                  [],
                  t.blockStatement([
                    t.variableDeclaration("const", [
                      t.variableDeclarator(resultId, t.arrayExpression([])),
                    ]),
                    t.expressionStatement(
                      t.callExpression(iteratorExpression, [
                        inExpression!,
                        t.arrowFunctionExpression(
                          [t.identifier(itemParamName)],
                          t.callExpression(
                            t.memberExpression(resultId, t.identifier("push")),
                            [t.identifier(itemParamName)],
                          ),
                        ),
                      ]),
                    ),
                    t.returnStatement(resultId),
                  ]),
                ),
                [],
              );
            }

            if (statusExpression || sepExpression) {
              if (valueAttr === "in") {
                params = [t.arrayPattern(params)];
                valueAttr = "of";
                inExpression = t.callExpression(
                  t.memberExpression(
                    t.identifier("Object"),
                    t.identifier("entries"),
                  ),
                  [inExpression!],
                );
              }

              const indexId = generateSafeIdentifier(scope, "index");
              params.push(indexId);

              if (sepExpression) {
                tag.node.body.body.unshift(
                  t.markoPlaceholder(
                    t.conditionalExpression(
                      indexId,
                      sepExpression,
                      t.stringLiteral(""),
                    ),
                    sepExpression.type === "StringLiteral" &&
                      !/[-<&]/g.test(sepExpression.value),
                  ),
                );
              }

              if (statusExpression) {
                const allId = generateSafeIdentifier(scope, "all");
                params.push(allId);

                tag.node.body.body.unshift(
                  t.markoScriptlet([
                    t.variableDeclaration("const", [
                      t.variableDeclarator(
                        statusExpression as t.Identifier,
                        t.objectExpression([
                          t.objectMethod(
                            "method",
                            t.identifier("getIndex"),
                            [],
                            t.blockStatement([t.returnStatement(indexId)]),
                          ),
                          t.objectMethod(
                            "method",
                            t.identifier("getLength"),
                            [],
                            t.blockStatement([
                              t.returnStatement(
                                t.memberExpression(
                                  allId,
                                  t.identifier("length"),
                                ),
                              ),
                            ]),
                          ),
                          t.objectMethod(
                            "method",
                            t.identifier("isFirst"),
                            [],
                            t.blockStatement([
                              t.returnStatement(
                                t.binaryExpression(
                                  "===",
                                  indexId,
                                  t.numericLiteral(0),
                                ),
                              ),
                            ]),
                          ),
                          t.objectMethod(
                            "method",
                            t.identifier("isLast"),
                            [],
                            t.blockStatement([
                              t.returnStatement(
                                t.binaryExpression(
                                  "===",
                                  indexId,
                                  t.binaryExpression(
                                    "-",
                                    t.memberExpression(
                                      allId,
                                      t.identifier("length"),
                                    ),
                                    t.numericLiteral(1),
                                  ),
                                ),
                              ),
                            ]),
                          ),
                        ]),
                      ),
                    ]),
                  ]),
                );
              }
            }

            tag.replaceWith(
              t.markoTag(
                t.stringLiteral("for"),
                [t.markoAttribute(valueAttr, inExpression!)],
                markoTagBody(node.body.body, params, node.body.attributeTags),
              ),
            );
          },
        });
        break;
      }
      case ForType.From: {
        const invalidPart =
          parsed.iterator || parsed.separator || parsed.statusVar;
        if (invalidPart) {
          diagnosticError(tag, {
            label: "This syntax is not supported on a <for(x from y)> tag.",
            loc: getLocRange(
              file,
              start + invalidPart.start,
              start + invalidPart.end,
            ),
          });
          tag.replaceWithMultiple(tag.node.body.body);
          return;
        }

        const params = (
          parsed.id.value
            ? parseParams(
                file,
                parsed.id.value,
                parsed.id.start + start,
                parsed.id.end + start,
              )
            : []
        ) as t.MarkoTagBody["params"];

        if (params.length !== 1) {
          diagnosticError(tag, {
            label: "Invalid <for(x from y)> arguments.",
            loc: args[0].loc || false,
          });
          tag.replaceWithMultiple(tag.node.body.body);
          return;
        }

        const attrs: t.MarkoAttribute[] = [];
        let fromExpression: t.Expression | undefined;
        let toExpression: t.Expression | undefined;

        if (parsed.from?.value) {
          fromExpression = parseExpression(
            file,
            parsed.from.value,
            parsed.from.start + start,
            parsed.from.end + start,
          );

          attrs.push(t.markoAttribute("from", fromExpression));
        }

        if (parsed.to?.value) {
          toExpression = parseExpression(
            file,
            parsed.to.value,
            parsed.to.start + start,
            parsed.to.end + start,
          );

          attrs.push(t.markoAttribute("to", toExpression));
        }

        if (parsed.step?.value) {
          attrs.push(
            t.markoAttribute(
              "step",
              parseExpression(
                file,
                parsed.step.value,
                parsed.step.start + start,
                parsed.step.end + start,
              ),
            ),
          );
        } else if (toExpression && fromExpression) {
          if (
            toExpression.type === "NumericLiteral" &&
            fromExpression.type === "NumericLiteral"
          ) {
            if (fromExpression.value > toExpression.value) {
              attrs.push(t.markoAttribute("step", t.numericLiteral(-1)));
            }
          } else {
            attrs.push(
              t.markoAttribute(
                "step",
                t.conditionalExpression(
                  t.binaryExpression("<=", fromExpression, toExpression),
                  t.numericLiteral(1),
                  t.numericLiteral(-1),
                ),
              ),
            );
          }
        }

        diagnosticDeprecate(tag, {
          label:
            'The "<for(x from y)>" syntax has been deprecated, checkout the modern syntax here: https://github.com/marko-js/marko/wiki/Deprecation:-legacy-for',
          fix() {
            tag.replaceWith(
              t.markoTag(
                t.stringLiteral("for"),
                attrs,
                markoTagBody(node.body.body, params, node.body.attributeTags),
              ),
            );
          },
        });

        break;
      }
      case ForType.Init: {
        const invalidPart =
          parsed.iterator || parsed.separator || parsed.statusVar;
        if (invalidPart) {
          diagnosticError(tag, {
            label:
              "This syntax is not supported on a <for(init; test; update)> tag.",
            loc: getLocRange(
              file,
              start + invalidPart.start,
              start + invalidPart.end,
            ),
          });
          tag.replaceWithMultiple(tag.node.body.body);
          return;
        }

        const initLoop = parsed.init.value
          ? parseStatements(
              file,
              `for(${parsed.init.value};;);`,
              start + parsed.init.start,
              start + parsed.init.end,
              4,
            )[0]
          : null;

        const initNode =
          initLoop?.type === "ForStatement" ? initLoop.init : initLoop;

        const testNode = parsed.test.value
          ? parseExpression(
              file,
              parsed.test.value,
              parsed.test.start + start,
              parsed.test.end + start,
            )
          : null;

        const updateNode =
          parsed.update?.value &&
          parseExpression(
            file,
            parsed.update.value,
            parsed.update.start + start,
            parsed.update.end + start,
          );

        const forRange =
          initNode &&
          testNode &&
          updateNode &&
          forInitToRange(initNode, testNode, updateNode);

        diagnosticDeprecate(tag, {
          label: `The "<for(init; test; update)>" syntax has been deprecated, checkout the modern syntax here: https://github.com/marko-js/marko/wiki/Deprecation:-legacy-for`,
          fix() {
            if (forRange) {
              const attrs: t.MarkoAttribute[] = [
                t.markoAttribute("from", forRange.from),
                t.markoAttribute("to", forRange.to),
              ];

              if (
                forRange.step &&
                !(
                  forRange.step.type === "NumericLiteral" &&
                  forRange.step.value === 1
                )
              ) {
                attrs.push(t.markoAttribute("step", forRange.step));
              }

              t.markoAttribute("from", forRange.from),
                t.markoAttribute("to", forRange.to),
                tag.replaceWith(
                  t.markoTag(
                    t.stringLiteral("for"),
                    attrs,
                    markoTagBody(
                      node.body.body,
                      [forRange.varName],
                      node.body.attributeTags,
                    ),
                  ),
                );
            } else {
              const whileTag = t.markoTag(
                t.stringLiteral("while"),
                [],
                updateNode
                  ? markoTagBody(
                      node.body.body.concat(
                        t.markoScriptlet([t.expressionStatement(updateNode)]),
                      ),
                      undefined,
                      node.body.attributeTags,
                    )
                  : node.body,
                [testNode || t.booleanLiteral(true)],
              );

              if (initNode) {
                tag.replaceWithMultiple([
                  t.markoScriptlet([
                    t.isStatement(initNode)
                      ? initNode
                      : t.expressionStatement(initNode),
                  ]),
                  whileTag,
                ]);
              } else {
                tag.replaceWith(whileTag);
              }
            }
          },
        });

        break;
      }
    }
  },
};

function forInitToRange(
  init: t.Node,
  test: t.Expression,
  update: t.Expression,
) {
  if (test.type !== "BinaryExpression") {
    return;
  }

  let varName: t.LVal | null = null;
  let from: t.Expression | null = null;

  if (
    init.type === "VariableDeclaration" &&
    (init.kind === "var" || init.kind === "let") &&
    init.declarations.length === 1
  ) {
    const declarator = init.declarations[0];
    varName = declarator.id;
    from = declarator.init;
  } else if (init.type === "AssignmentExpression" && init.operator === "=") {
    varName = init.left as t.LVal;
    from = init.right;
  } else {
    return;
  }

  if (!from) {
    return;
  }

  if (varName.type !== "Identifier") {
    return;
  }

  let step: t.Expression | null = null;
  if (
    update.type === "UpdateExpression" &&
    isIdentifierNamed(update.argument, varName.name)
  ) {
    step = t.numericLiteral(update.operator === "++" ? 1 : -1);
  } else if (
    update.type === "AssignmentExpression" &&
    isIdentifierNamed(update.left, varName.name)
  ) {
    if (update.operator === "-=") {
      step = update.right;

      if (step.type === "NumericLiteral") {
        step = t.numericLiteral(step.value * -1);
      } else {
        step = t.binaryExpression("*", step, t.numericLiteral(-1));
      }
    } else if (update.operator === "+=") {
      step = update.right;
    } else {
      return;
    }
  } else {
    return;
  }

  let to: t.Expression | null = null;
  if (isIdentifierNamed(test.left, varName.name)) {
    to = test.right;
  } else if (isIdentifierNamed(test.right, varName.name)) {
    to = test.left as t.Expression;
  } else {
    return;
  }

  if (test.operator === "<") {
    if (to.type === "NumericLiteral") {
      to = t.numericLiteral(to.value - 1);
    } else {
      to = t.binaryExpression("-", to, t.numericLiteral(1));
    }
  } else if (test.operator !== "<=") {
    return;
  }

  return {
    varName: varName,
    from: from,
    to: to,
    step: step,
  };
}

function markoTagBody(
  body: t.MarkoTagBody["body"],
  params?: t.MarkoTagBody["params"],
  attributeTags?: t.MarkoTagBody["attributeTags"],
) {
  const node = t.markoTagBody(body, params);
  if (attributeTags) {
    node.attributeTags = true;
  }

  return node;
}

function isIdentifierNamed(node: t.Node, name: string) {
  return node.type === "Identifier" && node.name === name;
}

function generateSafeIdentifier(scope: t.Scope, name: string) {
  return scope.generateUidIdentifier(name);
  // TODO: why doesn't this work?
  // return scope.hasBinding(name)
  //   ? scope.generateUidIdentifier(name)
  //   : t.identifier(name);
}
