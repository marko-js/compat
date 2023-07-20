import { types as t } from "@marko/compiler";
import { diagnosticDeprecate, diagnosticError } from "@marko/babel-utils";
import { exprToAttrs, getTagNameForTemplatePath } from "@marko/compat-utils";

export default {
  enter(tag: t.NodePath<t.MarkoTag>) {
    const args = tag.node.arguments;
    if (!args?.length) {
      diagnosticError(tag, {
        label:
          'The <include(...)> tag must have an argument: <include("./target.marko")/> or <include(input.renderBody)/>',
      });

      tag.remove();
      return;
    }

    if (args.length > 2) {
      diagnosticError(tag, {
        label: "The <include> tag only supports 2 arguments.",
      });

      tag.remove();
      return;
    }

    for (const arg of args) {
      if (arg.type === "SpreadElement") {
        diagnosticError(tag, {
          label: "The <include> tag does not support spread arguments.",
          loc: arg.loc || tag.node.loc || false,
        });

        tag.remove();
        return;
      }
    }

    const [rendererExpression, inputExpression] = args as t.Expression[];
    const tagNameExpression =
      rendererExpression.type === "StringLiteral"
        ? getTagNameForTemplatePath(tag, rendererExpression.value)
        : rendererExpression;

    diagnosticDeprecate(tag, {
      label:
        'The "<include>" tag is deprecated. Please use the "<${dynamic}/>" tag or import and reference the tag directly. See: https://github.com/marko-js/marko/wiki/Deprecation:-include-tag',
      fix() {
        tag.replaceWith(
          t.markoTag(
            tagNameExpression,
            exprToAttrs(inputExpression),
            tag.node.body,
          ),
        );
      },
    });
  },
};
