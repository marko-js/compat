import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";
import { willMigrateTag } from "@marko/compat-utils";

export default {
  MarkoAttribute(attr) {
    const {
      node: { name, arguments: args },
    } = attr;

    switch (name) {
      case "if":
      case "unless":
      case "else-if":
        if (!args?.length) return;
        break;
      case "else":
        break;
      default:
        return;
    }

    const tag = attr.parentPath as t.NodePath<t.MarkoTag>;
    if (willMigrateTag(tag)) return;

    diagnosticDeprecate(attr, {
      label: `The "${name}" directive is deprecated. Please use "<${name}>" tag instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-control-flow-attributes`,
      fix() {
        attr.remove();
        tag.replaceWith(
          t.markoTag(
            t.stringLiteral(name),
            [],
            t.markoTagBody([tag.node]),
            args,
          ),
        );
      },
    });
  },
} satisfies t.Visitor;
