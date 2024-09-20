import { types as t } from "@marko/compiler";
import {
  diagnosticDeprecate,
  diagnosticError,
  getStart,
  withLoc,
} from "@marko/babel-utils";
import { getAttributeValue } from "@marko/compat-utils";

export default {
  exit(tag: t.NodePath<t.MarkoTag>) {
    const {
      node,
      hub: { file },
    } = tag;
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
    const nameStart = getStart(file, node.name);
    if (nameStart != null) {
      withLoc(
        tag.hub.file,
        memberProperty,
        nameStart + 1,
        nameStart + name.node.value.length,
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
  return str.replace(/-([a-z])/g, matchToUpperCase);
}

function matchToUpperCase(_: string, str: string) {
  return str.toUpperCase();
}
