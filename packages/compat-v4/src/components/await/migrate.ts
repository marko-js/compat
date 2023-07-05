import { types as t } from "@marko/compiler";
import {
  diagnosticDeprecate,
  diagnosticError,
  getLocRange,
  parseExpression,
} from "@marko/babel-utils";

export default {
  enter(tag: t.NodePath<t.MarkoTag>) {
    const firstArg = tag.node.arguments?.[0];
    if (firstArg?.type !== "MarkoParseError") return;
    const match = /^\s*([$a-zA-Z_][0-9a-zA-Z_$]*)\s+from\s+/.exec(
      firstArg.source
    );
    if (!match) return;

    diagnosticDeprecate(tag, {
      label:
        'The "<await(result from promise)>" syntax has been deprecated, please use the modern syntax of "<await(promise)><@then|result|>". See: https://github.com/marko-js/marko/wiki/Deprecation:-legacy-await',
      fix() {
        const start = firstArg.start!;
        const fromStart = match[0].length;
        const identifierName = match[1];
        const valueIdentifier = withLoc(
          tag.hub.file,
          t.identifier(identifierName),
          start,
          start + identifierName.length
        );
        const thenChildren: t.MarkoTagBody["body"] = [];
        const placeholderChildren: t.MarkoTagBody["body"] = [];
        const timeoutChildren: t.MarkoTagBody["body"] = [];
        const errorChildren: t.MarkoTagBody["body"] = [];
        let providerExpression = parseExpression(
          tag.hub.file,
          firstArg.source.slice(fromStart),
          start + fromStart,
          firstArg.end!
        );
        let providerMethod: t.Expression | undefined;
        let providerScope: t.Expression | undefined;
        let providerArgs: t.Expression | undefined;
        let providerArgProps: t.ObjectProperty[] | undefined;

        for (const attr of tag.get("attributes")) {
          if (attr.isMarkoSpreadAttribute()) {
            diagnosticError(attr, {
              label:
                "Spread attributes are not supported in legacy <await(x from y)> tags.",
            });
            attr.remove();
            continue;
          }

          const { name, value } = attr.node as t.MarkoAttribute;
          switch (name) {
            case "method":
              providerMethod = value;
              break;
            case "scope":
              providerScope = value;
              break;
            case "arg":
              providerArgs = value;
              break;
            case "placeholder":
              placeholderChildren.push(t.markoPlaceholder(value));
              break;
            case "timeout-message":
              timeoutChildren.push(t.markoPlaceholder(value));
              break;
            case "error-message":
              errorChildren.push(t.markoPlaceholder(value));
              break;
            default:
              if (name.startsWith("arg-")) {
                const prop = t.objectProperty(
                  t.stringLiteral(name.slice(4)),
                  value
                );
                if (providerArgProps) {
                  providerArgProps.push(prop);
                } else {
                  providerArgProps = [prop];
                }
                break;
              }
              continue;
          }

          attr.remove();
        }

        for (const child of tag.node.body.body) {
          if (
            child.type === "MarkoTag" &&
            child.name.type === "StringLiteral"
          ) {
            switch (child.name.value) {
              case "await-placeholder":
                placeholderChildren.push(...child.body.body);
                continue;
              case "await-error":
                errorChildren.push(...child.body.body);
                continue;
              case "await-timeout":
                timeoutChildren.push(...child.body.body);
                continue;
            }
          }

          thenChildren.push(child);
        }

        if (providerMethod) {
          providerExpression = t.memberExpression(
            providerExpression,
            providerMethod,
            !t.isIdentifier(providerMethod)
          );
        }

        if (providerArgProps) {
          if (providerArgs) {
            providerArgs = t.objectExpression([
              t.spreadElement(providerArgs),
              ...providerArgProps,
            ]);
          } else {
            providerArgs = t.objectExpression(providerArgProps);
          }
        }

        if (providerArgs || providerScope) {
          providerExpression = t.callExpression(
            t.memberExpression(providerExpression, t.identifier("bind")),
            [providerScope || t.nullLiteral()].concat(providerArgs || [])
          );
        }

        tag.node.arguments = [providerExpression];

        const rootChildren: t.MarkoTagBody["body"] = (tag.node.body.body = []);

        if (thenChildren.length) {
          rootChildren.push(
            t.markoTag(
              t.stringLiteral("@then"),
              [],
              t.markoTagBody(thenChildren, [valueIdentifier])
            )
          );
        }

        if (placeholderChildren.length) {
          rootChildren.push(
            t.markoTag(
              t.stringLiteral("@placeholder"),
              [],
              t.markoTagBody(placeholderChildren)
            )
          );
        }

        if (timeoutChildren.length) {
          const timeoutConditionTag = t.markoTag(
            t.stringLiteral("if"),
            [],
            t.markoTagBody(timeoutChildren),
            [
              t.binaryExpression(
                "===",
                t.memberExpression(t.identifier("err"), t.identifier("name")),
                t.stringLiteral("TimeoutError")
              ),
            ]
          );
          rootChildren.push(
            t.markoTag(
              t.stringLiteral("@catch"),
              [],
              t.markoTagBody(
                errorChildren.length
                  ? [
                      timeoutConditionTag,
                      t.markoTag(
                        t.stringLiteral("else"),
                        [],
                        t.markoTagBody(errorChildren)
                      ),
                    ]
                  : [timeoutConditionTag],
                [t.identifier("err")]
              )
            )
          );
        } else if (errorChildren.length) {
          rootChildren.push(
            t.markoTag(
              t.stringLiteral("@catch"),
              [],
              t.markoTagBody(errorChildren)
            )
          );
        }
      },
    });
  },
};

function withLoc<T extends t.Node>(
  file: t.BabelFile,
  node: T,
  start: number,
  end: number
): T {
  node.loc = getLocRange(file, start, end);
  node.start = start;
  node.end = end;
  return node;
}
