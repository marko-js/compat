import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";
import { willMigrateTag } from "@marko/compat-utils";

export default {
  MarkoAttribute(attr) {
    const {
      node: { name, arguments: args },
    } = attr;

    if (name !== "if" || !args?.length) return;

    const tag = attr.parentPath as t.NodePath<t.MarkoTag>;
    if (willMigrateTag(tag)) return;

    diagnosticDeprecate(attr, {
      label:
        'The "if(x)" directive is deprecated. Please use "<if(test)>" tag instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-control-flow-attributes',
      fix() {
        attr.remove();
        tag.replaceWith(
          t.markoTag(
            t.stringLiteral("if"),
            [],
            t.markoTagBody([tag.node]),
            args,
          ),
        );
      },
    });
  },
} satisfies t.Visitor;
