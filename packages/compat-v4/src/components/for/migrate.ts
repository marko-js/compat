import { types as t } from "@marko/compiler";
import {
  diagnosticDeprecate,
  diagnosticError,
  getLocRange,
  parseExpression,
  parseParams,
  parseStatements,
} from "@marko/babel-utils";
import { ForType, parseFor } from "../../util/parse-for";

export default {
  enter(tag: t.NodePath<t.MarkoTag>) {
    const { node } = tag;
    const args = node.arguments;
    const len = args?.length;
    if (!len) return;

    const start = args[0].start;
    const end = args[len - 1].end;
    if (start == null || end == null) return;

    const { file } = tag.hub;
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
          node.arguments = null;
          return;
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
        const statusExpression =
          parsed.statusVar?.value &&
          parseExpression(
            file,
            parsed.statusVar.value,
            parsed.statusVar.start + start,
            parsed.statusVar.end + start,
          );

        if (statusExpression) {
          if (statusExpression.type !== "Identifier") {
            diagnosticError(tag, {
              label: "Invalid <for> status variable.",
              loc: statusExpression.loc || false,
            });
            node.arguments = null;
            return;
          }
        }

        diagnosticDeprecate(tag, {
          label:
            'The "<for(x in y)>" syntax has been deprecated, checkout the modern syntax here: https://github.com/marko-js/marko/wiki/Deprecation:-legacy-for',
          fix() {
            let valueAttr = params.length === 1 ? "of" : "in";

            if (iteratorExpression) {
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
                        t.callExpression(
                          t.memberExpression(
                            t.memberExpression(resultId, t.identifier("push")),
                            t.identifier("bind"),
                          ),
                          [resultId],
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
                        statusExpression,
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
                t.markoTagBody(node.body.body, params),
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
          node.arguments = null;
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
          node.arguments = null;
          return;
        }

        const attrs: t.MarkoAttribute[] = [];

        if (parsed.from?.value) {
          attrs.push(
            t.markoAttribute(
              "from",
              parseExpression(
                file,
                parsed.from.value,
                parsed.from.start + start,
                parsed.from.end + start,
              ),
            ),
          );
        }

        if (parsed.to?.value) {
          attrs.push(
            t.markoAttribute(
              "to",
              parseExpression(
                file,
                parsed.to.value,
                parsed.to.start + start,
                parsed.to.end + start,
              ),
            ),
          );
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
        }

        diagnosticDeprecate(tag, {
          label:
            'The "<for(x from y)>" syntax has been deprecated, checkout the modern syntax here: https://github.com/marko-js/marko/wiki/Deprecation:-legacy-for',
          fix() {
            tag.replaceWith(
              t.markoTag(
                t.stringLiteral("for"),
                attrs,
                t.markoTagBody(node.body.body, params),
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
          node.arguments = null;
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
                    t.markoTagBody(node.body.body, [forRange.varName]),
                  ),
                );
            } else {
              const whileTag = t.markoTag(
                t.stringLiteral("while"),
                [],
                updateNode
                  ? t.markoTagBody(
                      node.body.body.concat(
                        t.markoScriptlet([t.expressionStatement(updateNode)]),
                      ),
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
    varName = init.left;
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
