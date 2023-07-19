import { types as t } from "@marko/compiler";
import { diagnosticDeprecate, diagnosticError } from "@marko/babel-utils";
import { getAttribute } from "@marko/compat-utils";

export default {
  MarkoAttribute(attr) {
    switch (attr.node.name) {
      case "w-preserve":
        renameAttribute(attr, "no-update");
        break;
      case "w-preserve-if":
        renameAttribute(attr, "no-update-if");
        break;
      case "w-preserve-body":
        renameAttribute(attr, "no-update-body");
        break;
      case "w-preserve-body-if":
        renameAttribute(attr, "no-update-body-if");
        break;
      case "w-preserve-attrs": {
        const value = attr.node.value;
        if (value.type !== "StringLiteral") {
          diagnosticError(attr, {
            label: `The "w-preserve-attrs" attribute must have a string literal value.`,
          });
          attr.remove();
          return;
        }

        diagnosticDeprecate(attr, {
          label: `The "w-preserve-attrs" attribute is deprecated. Please use ":no-update" modifier instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-w‐*-Attributes`,
          fix() {
            const tag = attr.parentPath as t.NodePath<t.MarkoTag>;
            const seen = new Set<string>();
            const preserveAttrs = value.value.split(/\s*,\s*/);
            attr.remove();

            for (const name of preserveAttrs) {
              if (seen.has(name)) continue;
              seen.add(name);

              const existing = getAttribute(tag, name);
              if (existing) {
                existing.replaceWith(
                  t.markoAttribute(
                    name,
                    existing.node.value,
                    "no-update",
                    existing.node.arguments,
                    existing.node.default,
                    existing.node.bound,
                  ),
                );
              } else {
                tag.node.attributes.unshift(
                  t.markoAttribute(name, t.nullLiteral(), "no-update"),
                );
              }
            }
          },
        });
        break;
      }
    }
  },
} satisfies t.Visitor;

function renameAttribute(attr: t.NodePath<t.MarkoAttribute>, name: string) {
  const { node } = attr;
  diagnosticDeprecate(attr, {
    label: `The "${node.name}" attribute is deprecated. Please use "${name}" attribute instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-w‐*-Attributes`,
    fix() {
      attr.replaceWith(
        t.markoAttribute(
          name,
          node.value,
          node.modifier,
          node.arguments,
          node.default,
          node.bound,
        ),
      );
    },
  });
}
