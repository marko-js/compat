import { types as t } from "@marko/compiler";
import {
  diagnosticDeprecate,
  findParentTag,
  withLoc,
} from "@marko/babel-utils";

export default {
  MarkoTag(tag) {
    const { node } = tag;
    const match =
      node.name.type === "StringLiteral" && node.name.value.split(":");
    if (match && match.length > 1) {
      const attrTagName = match.pop()!;
      let curTag: t.NodePath<t.MarkoTag> | undefined = tag;

      for (let i = match.length; --i > 0; ) {
        if (
          !(curTag = findParentTag(curTag!)) ||
          curTag.node.name.type !== "StringLiteral" ||
          curTag.node.name.value !== `@${match[i]}`
        ) {
          return;
        }
      }

      const parentTag = findParentTag(curTag!);
      if (
        !parentTag ||
        parentTag.node.name.type !== "StringLiteral" ||
        parentTag.node.name.value !== match[0]
      ) {
        return;
      }

      diagnosticDeprecate(tag.get("name"), {
        label:
          'The "<my-tag:nested>" tagName syntax is deprecated. Please use the "<@nested>" tagName syntax instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-legacy-nested-tags',
        fix() {
          const attrTagNameLiteral = t.stringLiteral(`@${attrTagName}`);

          if (node.name.start != null && node.name.end != null) {
            withLoc(
              tag.hub.file,
              attrTagNameLiteral,
              node.name.end - attrTagName.length + 1,
              node.name.end,
            );
          }

          tag.replaceWith(
            t.markoTag(
              attrTagNameLiteral,
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
