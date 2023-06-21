import { types as t } from "@marko/compiler";
import {
  diagnosticDeprecate,
  importDefault,
  isAttributeTag,
  isDynamicTag,
  isMacroTag,
  isNativeTag,
} from "@marko/babel-utils";

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

    diagnosticDeprecate(attr, {
      label:
        'The "body-only-if(x)" directive is deprecated. Please use "<${test ? tag : null>" instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-body%E2%80%90only%E2%80%90if',
      fix() {
        tag.set(
          "name",
          t.conditionalExpression(
            arg,
            isDynamicTag(tag) ||
              isNativeTag(tag) ||
              !t.isStringLiteral(tag.node.name)
              ? tag.node.name
              : importDefault(
                  tag.hub.file,
                  `<${tag.node.name.value}>`,
                  tag.node.name.value
                ),
            t.nullLiteral()
          )
        );
        attr.remove();
      },
    });
  },
} satisfies t.Visitor;
