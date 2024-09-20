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
    const into = getAttributeValue(tag, "into");

    if (!into || !into.isStringLiteral()) {
      diagnosticError(tag, {
        label:
          "The <layout-put> tag requires an 'into' attribute that is a string literal.",
      });
      tag.remove();
      return;
    }

    const value = getAttributeValue(tag, "value");
    if (node.attributes.length > (value ? 2 : 1)) {
      diagnosticError(tag, {
        label:
          "The <layout-put> tag only supports the 'into' and 'value' attributes.",
      });
      tag.remove();
      return;
    }

    let children = node.body.body;

    if (value) {
      if (children.length) {
        diagnosticError(tag, {
          label:
            "The <layout-put> tag does not support children when using the 'value' attribute.",
        });
        tag.remove();
        return;
      }

      children = [t.markoPlaceholder(value.node)];
    }

    const newName = t.stringLiteral(`@${toCamelCase(into.node.value)}`);
    const nameStart = getStart(file, node.name);
    if (nameStart != null) {
      withLoc(file, newName, nameStart, nameStart + into.node.value.length);
    }

    diagnosticDeprecate(tag, {
      label:
        'The "<layout-put>" tag is deprecated and replaced by `<@attribute>` tags tag. See: https://github.com/marko-js/marko/wiki/Deprecation:-layout-tag',
      fix() {
        tag.replaceWith(t.markoTag(newName, [], t.markoTagBody(children)));
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
