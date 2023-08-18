import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";
import { willMigrateAllAttrs } from "@marko/compat-utils";

export default {
  MarkoAttribute(attr) {
    const {
      node: { name, arguments: args },
    } = attr;

    switch (name) {
      case "for":
      case "while":
        if (!args?.length) return;
        break;
      default:
        return;
    }

    const tag = attr.parentPath as t.NodePath<t.MarkoTag>;
    if (willMigrateAllAttrs(tag)) return;

    diagnosticDeprecate(attr, {
      label: `The "${name}(x)" directive is deprecated. Please use "<${name}>" tag instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-control-flow-attributes`,
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
