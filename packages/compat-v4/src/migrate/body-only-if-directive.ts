import { types as t } from "@marko/compiler";
import {
  diagnosticDeprecate,
  diagnosticError,
  isAttributeTag,
  isDynamicTag,
  isMacroTag,
  isNativeTag,
} from "@marko/babel-utils";
import { getTagFile, importCustomTag } from "@marko/compat-utils";

export default {
  MarkoAttribute(attr) {
    const tag = attr.parentPath as t.NodePath<t.MarkoTag>;
    const {
      node: { name, arguments: args },
    } = attr;

    if (
      name !== "body-only-if" ||
      !args?.length ||
      isMacroTag(tag) ||
      isAttributeTag(tag)
    ) {
      return;
    }

    const arg =
      args.length === 1
        ? (args[0] as t.Expression)
        : t.sequenceExpression(args as t.Expression[]);

    if (isMacroTag(tag)) {
      diagnosticError(attr, {
        label:
          "The body-only-if attribute could not be applied to this tag since it is a macro tag.",
        fix() {
          attr.remove();
        },
      });
      return;
    }

    let nameExpression: t.Expression;

    if (
      isDynamicTag(tag) ||
      isNativeTag(tag) ||
      !t.isStringLiteral(tag.node.name)
    ) {
      nameExpression = tag.node.name;
    } else {
      const tagFile = getTagFile(tag);

      if (!tagFile) {
        diagnosticError(attr, {
          label:
            "The body-only-if attribute could not be applied to this tag since we could not find it's file path.",
          fix() {
            attr.remove();
          },
        });

        return;
      }

      nameExpression = importCustomTag(
        tag as t.NodePath<t.MarkoTag & { name: t.StringLiteral }>,
        tagFile,
      );
    }

    diagnosticDeprecate(attr, {
      label:
        'The "body-only-if(x)" directive is deprecated. Please use "<${test ? tag : null>" instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-body%E2%80%90only%E2%80%90if',
      fix() {
        attr.remove();

        if (arg.type === "BooleanLiteral") {
          if (arg.value) {
            tag.replaceWithMultiple(tag.node.body.body);
          }
          return;
        } else {
          tag.set(
            "name",
            t.conditionalExpression(arg, t.nullLiteral(), nameExpression),
          );

          (tag.get("name") as t.NodePath<t.ConditionalExpression>)
            .get("test")
            .visit();
        }
      },
    });
  },
} satisfies t.Visitor;
