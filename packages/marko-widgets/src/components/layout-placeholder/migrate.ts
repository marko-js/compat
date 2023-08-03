import { types as t } from "@marko/compiler";
import {
  diagnosticDeprecate,
  diagnosticError,
  withLoc,
} from "@marko/babel-utils";
import { getAttributeValue } from "@marko/compat-utils";

export default {
  exit(tag: t.NodePath<t.MarkoTag>) {
    const { node } = tag;
    const name = getAttributeValue(tag, "name");

    if (!name || !name.isStringLiteral()) {
      diagnosticError(tag, {
        label:
          "The <layout-placeholder> tag requires a 'name' attribute that is a string literal.",
      });
      tag.remove();
      return;
    }

    if (node.attributes.length > 1) {
      diagnosticError(tag, {
        label:
          "The <layout-placeholder> tag only supports the 'name' attribute.",
      });
      tag.remove();
      return;
    }

    const memberProperty = t.identifier(toCamelCase(name.node.value));
    if (node.name.start != null && node.name.end != null) {
      withLoc(
        tag.hub.file,
        memberProperty,
        node.name.start + 1,
        node.name.start + name.node.value.length,
      );
    }

    diagnosticDeprecate(tag, {
      label:
        "The <layout-placeholder> tag is deprecated. Please use the <${dynamic}> tag instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-layout-tag",
      fix() {
        tag.replaceWith(
          t.markoTag(
            t.memberExpression(t.identifier("input"), memberProperty),
            [],
            node.body,
          ),
        );
      },
    });
  },
};

function toCamelCase(str: string) {
  return str.replace(/(?<=-)[a-z]/g, toUpperCase);
}

function toUpperCase(str: string) {
  return str.toUpperCase();
}
