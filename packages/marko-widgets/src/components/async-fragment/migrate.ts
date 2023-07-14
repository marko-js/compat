import { types as t } from "@marko/compiler";
import {
  diagnosticDeprecate,
  diagnosticError,
  withLoc,
} from "@marko/babel-utils";

export default {
  enter(tag: t.NodePath<t.MarkoTag>) {
    diagnosticDeprecate(tag, {
      label: `The "<async-fragment>" tag is deprecated. Please use "<await>" instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-async-fragment`,
      fix() {
        const thenChildren: t.MarkoTagBody["body"] = [];
        const placeholderChildren: t.MarkoTagBody["body"] = [];
        const timeoutChildren: t.MarkoTagBody["body"] = [];
        const errorChildren: t.MarkoTagBody["body"] = [];
        let varExpression: t.Expression | undefined;
        let providerExpression: t.Expression | undefined;
        let providerMethod: t.Expression | undefined;
        let providerScope: t.Expression | undefined;
        let providerArgs: t.Expression | undefined;
        let providerArgProps: t.ObjectProperty[] | undefined;

        for (const attr of tag.get("attributes")) {
          if (attr.isMarkoSpreadAttribute()) {
            diagnosticError(attr, {
              label: "Spread attributes are not supported on <async-fragment>.",
              fix() {
                attr.remove();
              },
            });
            return;
          }

          const { name, value } = attr.node as t.MarkoAttribute;

          switch (name) {
            case "var":
              varExpression = value;
              break;
            case "data-provider":
              providerExpression = value;
              break;
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
                  value,
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

        if (
          !(
            varExpression &&
            t.isStringLiteral(varExpression) &&
            t.isValidIdentifier(varExpression.value)
          )
        ) {
          diagnosticError(tag, {
            label:
              'Invalid <async-fragment> tag. "var" must be a string literal that is a valid javascript identifier. Example; <async-fragment data-provider=data.userInfo var="userInfo" />',
            fix() {
              tag.remove();
            },
          });
          return;
        }

        if (!providerExpression) {
          diagnosticError(tag, {
            label:
              'Invalid <async-fragment> tag. "data-provider" attribute is missing. Example; <async-fragment data-provider=data.userInfo var="userInfo" />',
            fix() {
              tag.remove();
            },
          });
          return;
        }

        for (const child of tag.node.body.body) {
          if (
            child.type === "MarkoTag" &&
            child.name.type === "StringLiteral"
          ) {
            switch (child.name.value) {
              case "async-fragment-placeholder":
                placeholderChildren.push(...child.body.body);
                continue;
              case "async-fragment-error":
                errorChildren.push(...child.body.body);
                continue;
              case "async-fragment-timeout":
                timeoutChildren.push(...child.body.body);
                continue;
            }
          }

          thenChildren.push(child);
        }

        const valueIdentifier = t.identifier(varExpression.value);
        if (varExpression.start != null && varExpression.end != null) {
          withLoc(
            tag.hub.file,
            valueIdentifier,
            varExpression.start + 1,
            varExpression.end - 1,
          );
        }

        if (providerMethod) {
          providerExpression = t.memberExpression(
            providerExpression,
            providerMethod,
            !t.isIdentifier(providerMethod),
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
            [providerScope || t.nullLiteral()].concat(providerArgs || []),
          );
        }

        const rootChildren: t.MarkoTagBody["body"] = [];

        if (thenChildren.length) {
          rootChildren.push(
            t.markoTag(
              t.stringLiteral("@then"),
              [],
              t.markoTagBody(thenChildren, [valueIdentifier]),
            ),
          );
        }

        if (placeholderChildren.length) {
          rootChildren.push(
            t.markoTag(
              t.stringLiteral("@placeholder"),
              [],
              t.markoTagBody(placeholderChildren),
            ),
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
                t.stringLiteral("TimeoutError"),
              ),
            ],
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
                        t.markoTagBody(errorChildren),
                      ),
                    ]
                  : [timeoutConditionTag],
                [t.identifier("err")],
              ),
            ),
          );
        } else if (errorChildren.length) {
          rootChildren.push(
            t.markoTag(
              t.stringLiteral("@catch"),
              [],
              t.markoTagBody(errorChildren),
            ),
          );
        }

        tag.replaceWith(
          t.markoTag(
            t.stringLiteral("await"),
            tag.node.attributes,
            t.markoTagBody(rootChildren),
            [providerExpression],
          ),
        );
      },
    });
  },
};
