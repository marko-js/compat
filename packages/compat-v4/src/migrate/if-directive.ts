import { types as t } from "@marko/compiler";
import { diagnosticDeprecate, isAttributeTag } from "@marko/babel-utils";
import { willMigrateAllAttrs } from "@marko/compat-utils";

export default {
  MarkoAttribute(attr) {
    const {
      node: { name, arguments: args },
    } = attr;
    const tag = attr.parentPath as t.NodePath<t.MarkoTag>;
    if (
      name === "if" &&
      tag.node.name.type === "StringLiteral" &&
      tag.node.name.value === "else"
    ) {
      diagnosticDeprecate(attr, {
        label: `The "if" attribute on an <else> tag is deprecated. Please use "<else-if>" tag instead.`,
        fix() {
          tag.node.arguments = args;
          tag.node.name = t.stringLiteral("else-if");
          attr.remove();
        },
      });
      return;
    }

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

    if (willMigrateAllAttrs(tag)) {
      return;
    }

    diagnosticDeprecate(attr, {
      label: `The "${name}" directive is deprecated. Please use "<${name}>" tag instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-control-flow-attributes`,
      fix() {
        attr.remove();
        const body = t.markoTagBody([tag.node]);
        if (isAttributeTag(tag)) body.attributeTags = true;
        tag.replaceWith(t.markoTag(t.stringLiteral(name), [], body, args));
      },
    });
  },
} satisfies t.Visitor;
