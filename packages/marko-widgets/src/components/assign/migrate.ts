import { types as t } from "@marko/compiler";
import {
  diagnosticDeprecate,
  diagnosticError,
  parseExpression,
} from "@marko/babel-utils";

export default {
  exit(tag: t.NodePath<t.MarkoTag>) {
    if (!tag.node.attributes.length) {
      diagnosticError(tag, {
        label: "The <assign> tag requires a value.",
      });
      return;
    }

    diagnosticDeprecate(tag, {
      label:
        'The "<assign>" tag is deprecated. Please use "$ <js_code>" for JavaScript in the template. See: https://github.com/marko-js/marko/wiki/Deprecation:-var,-assign,-invoke-tags',
      fix() {
        const statements: t.Statement[] = [];
        let condition: t.Expression | undefined;

        for (const attr of tag.get("attributes")) {
          const { node } = attr;

          if (t.isMarkoSpreadAttribute(node)) {
            diagnosticError(attr, {
              label: "Spread attributes are not supported in <assign> tags.",
            });
            attr.remove();
            continue;
          }

          const { name, value } = node;

          if (name === "if" && node.arguments?.length) {
            condition =
              node.arguments.length === 1
                ? (node.arguments[0] as t.Expression)
                : t.sequenceExpression(node.arguments as t.Expression[]);
            continue;
          }

          statements.push(
            t.expressionStatement(
              t.isBooleanLiteral(value) &&
                value.value === true &&
                /^[+-]{2,}|[+-]{2,}$/.test(name)
                ? node.start != null && node.end != null
                  ? parseExpression(attr.hub.file, name, node.start, node.end!)
                  : parseExpression(attr.hub.file, name)
                : t.assignmentExpression("=", t.identifier(name), value)
            )
          );
        }

        if (condition) {
          tag.replaceWith(
            t.markoScriptlet([
              t.ifStatement(condition, t.blockStatement(statements)),
            ])
          );
        } else {
          tag.replaceWithMultiple(
            statements.map((it) => t.markoScriptlet([it]))
          );
        }
      },
    });
  },
};
