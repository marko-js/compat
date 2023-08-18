import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";
import { willMigrateAllAttrs } from "@marko/compat-utils";

export default {
  MarkoAttribute(attr) {
    const {
      node: { name, arguments: args },
    } = attr;

    if (name !== "include" || !args?.length) return;

    const tag = attr.parentPath as t.NodePath<t.MarkoTag>;
    if (willMigrateAllAttrs(tag)) return;

    diagnosticDeprecate(attr, {
      label:
        'The "include(x)" directive is deprecated. Please use the <${dynamic}> tag instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-include-tag',
      fix() {
        attr.remove();
        tag
          .get("body")
          .pushContainer(
            "body",
            t.markoTag(
              t.stringLiteral("include"),
              [],
              t.markoTagBody([]),
              args,
            ),
          );
      },
    });
  },
} satisfies t.Visitor;
