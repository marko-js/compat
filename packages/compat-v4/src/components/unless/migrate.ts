import { types as t } from "@marko/compiler";
import { diagnosticDeprecate, diagnosticError } from "@marko/babel-utils";

export default {
  enter(tag: t.NodePath<t.MarkoTag>) {
    const { node } = tag;
    const name = tag.get("name");
    const args = node.arguments || [];
    if (!args.length) {
      diagnosticError(name, {
        label: "The <unless> tag requires a condition argument.",
      });
    }

    if (!node.body.body.length) {
      diagnosticError(name, {
        label: "The <unless> tag requires a body.",
      });
    }

    if (node.var) {
      diagnosticError(name, {
        label: "The <unless> tag does not support a tag variable.",
        fix() {
          node.var = null;
        },
      });
    }

    if (node.attributes.length) {
      diagnosticError(name, {
        label: "The <unless> tag does not support any attributes.",
        fix() {
          node.attributes = [];
        },
      });
    }

    if (node.body.params.length) {
      diagnosticError(name, {
        label: "The <unless> tag does not support any params.",
        fix() {
          node.body.params = [];
        },
      });
    }

    diagnosticDeprecate(name, {
      label:
        'The "<unless(x)>" tag is deprecated. Please use "<if(!x)>" instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-unless-tag',
      fix() {
        tag.replaceWith(
          t.markoTag(t.stringLiteral("if"), [], node.body, [
            args.length === 0
              ? t.booleanLiteral(false)
              : t.unaryExpression(
                  "!",
                  args.length === 1
                    ? (args[0] as t.Expression)
                    : t.sequenceExpression(args as t.Expression[]),
                ),
          ]),
        );
      },
    });
  },
};
