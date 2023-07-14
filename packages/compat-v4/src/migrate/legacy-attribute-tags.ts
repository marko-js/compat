import { types as t } from "@marko/compiler";
import { diagnosticDeprecate, withLoc } from "@marko/babel-utils";
const legacyNestedTagSyntax = /:.*$/;

export default {
  MarkoTag(tag) {
    const { node } = tag;
    const match =
      node.name.type === "StringLiteral" &&
      node.name.value.match(legacyNestedTagSyntax);
    if (match) {
      diagnosticDeprecate(tag.get("name"), {
        label:
          'The "<my-tag:nested>" tagName syntax is deprecated. Please use the "<@nested>" tagName syntax instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-legacy-nested-tags',
        fix() {
          const newName = t.stringLiteral(`@${match[0].slice(1)}`);

          if (node.name.start != null && node.name.end != null) {
            withLoc(
              tag.hub.file,
              newName,
              node.name.start + match.index!,
              node.name.end,
            );
          }

          tag.replaceWith(
            t.markoTag(
              newName,
              node.attributes,
              node.body,
              node.arguments,
              node.var,
            ),
          );
        },
      });
    }
  },
} satisfies t.Visitor;
