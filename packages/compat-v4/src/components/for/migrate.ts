import { types as t } from "@marko/compiler";
import {
  diagnosticDeprecate,
  diagnosticError,
  getLocRange,
  parseExpression,
  parseParams,
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
        let params = parseParams(
          file,
          parsed.id.value,
          parsed.id.start + start,
          parsed.id.end + start,
        ) as t.MarkoTagBody["params"];
        let inExpression = parseExpression(
          file,
          parsed.in.value,
          parsed.in.start + start,
          parsed.in.end + start,
        );

        if (params.length === 0 || params.length > 2) {
          diagnosticError(tag, {
            label: "Invalid <for> arguments.",
            loc: args[0].loc || false,
          });
          node.arguments = [];
          return;
        }

        const iteratorExpression =
          parsed.iterator &&
          parseExpression(
            file,
            parsed.iterator.value,
            parsed.iterator.start + start,
            parsed.iterator.end + start,
          );

        const sepExpression =
          parsed.separator &&
          parseExpression(
            file,
            parsed.separator.value,
            parsed.separator.start + start,
            parsed.separator.end + start,
          );
        const statusExpression =
          parsed.statusVar &&
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
            node.arguments = [];
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
                        inExpression,
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
                  [inExpression],
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
                [t.markoAttribute(valueAttr, inExpression)],
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
          node.arguments = [];
          return;
        }

        const params = parseParams(
          file,
          parsed.id.value,
          parsed.id.start + start,
          parsed.id.end + start,
        ) as t.MarkoTagBody["params"];

        if (params.length !== 1) {
          diagnosticError(tag, {
            label: "Invalid <for(x from y)> arguments.",
            loc: args[0].loc || false,
          });
          node.arguments = [];
          return;
        }

        const attrs = [
          t.markoAttribute(
            "from",
            parseExpression(
              file,
              parsed.from.value,
              parsed.from.start + start,
              parsed.from.end + start,
            ),
          ),
        ];

        if (parsed.to) {
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

        if (parsed.step) {
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
          node.arguments = [];
          return;
        }
        break;
      }
    }
  },
};

function generateSafeIdentifier(scope: t.Scope, name: string) {
  return scope.generateUidIdentifier(name);
  // TODO: why doesn't this work?
  // return scope.hasBinding(name)
  //   ? scope.generateUidIdentifier(name)
  //   : t.identifier(name);
}
