import { types as t } from "@marko/compiler";
import { diagnosticDeprecate, diagnosticError } from "@marko/babel-utils";
import { exprToAttrs, getTagNameForTemplatePath } from "@marko/compat-utils";

export default {
  exit(tag: t.NodePath<t.MarkoTag>) {
    const { node } = tag;
    const args = node.arguments as t.Expression[];

    if (
      !args ||
      args.length < 1 ||
      args.length > 2 ||
      !isOnlyExpressions(args)
    ) {
      diagnosticError(tag, {
        label:
          "Invalid <layout-use> tag. Expected: <layout-use(template[, data]) ...>",
      });
      tag.remove();
      return;
    }

    const [target] = args;
    const tagNameExpression =
      target.type === "StringLiteral"
        ? getTagNameForTemplatePath(tag, target.value)
        : target;
    const attributes =
      args.length === 2
        ? [...exprToAttrs(args[1]), ...node.attributes]
        : node.attributes;

    diagnosticDeprecate(tag, {
      label:
        "The <layout-use> tag is deprecated. Please use a combination of the <${dynamic}> tag and imports instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-layout-tag",
      fix() {
        tag.replaceWith(
          t.markoTag(
            tagNameExpression,
            attributes,
            node.body,
            undefined,
            undefined,
            node.attributeTags,
          ),
        );
      },
    });
  },
};

function isOnlyExpressions(
  args: (t.Expression | t.SpreadElement)[],
): args is t.Expression[] {
  for (const arg of args) {
    if (arg.type === "SpreadElement") {
      return false;
    }
  }

  return true;
}
