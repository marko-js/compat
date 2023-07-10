import { types as t } from "@marko/compiler";
import { diagnosticDeprecate, diagnosticError } from "@marko/babel-utils";

export default {
  exit(tag: t.NodePath<t.MarkoTag>) {
    if (!tag.node.attributes.length) {
      diagnosticError(tag, {
        label: "The <var> tag requires a value.",
        fix() {
          tag.remove();
        },
      });
      return;
    }

    diagnosticDeprecate(tag, {
      label:
        'The "<var>" tag is deprecated. Please use "$ <js_code>" for JavaScript in the template. See: https://github.com/marko-js/marko/wiki/Deprecation:-var,-assign,-invoke-tags',
      fix() {
        const statements: t.VariableDeclaration[] = [];
        let condition: t.Expression | undefined;

        for (const attr of tag.get("attributes")) {
          const { node } = attr;
          if (t.isMarkoSpreadAttribute(node)) {
            diagnosticError(attr, {
              label: "Spread attributes are not supported in <var> tags.",
              fix() {
                attr.remove();
              },
            });
            continue;
          }

          if (node.name === "if" && node.arguments?.length) {
            condition =
              node.arguments.length === 1
                ? (node.arguments[0] as t.Expression)
                : t.sequenceExpression(node.arguments as t.Expression[]);
            continue;
          }

          statements.push(
            t.variableDeclaration("var", [
              t.variableDeclarator(t.identifier(node.name), node.value),
            ]),
          );
        }

        if (condition) {
          tag.replaceWith(
            t.markoScriptlet([
              t.ifStatement(condition, t.blockStatement(statements)),
            ]),
          );
        } else {
          tag.replaceWithMultiple(
            statements.map((it) => t.markoScriptlet([it])),
          );
        }
      },
    });
  },
};
