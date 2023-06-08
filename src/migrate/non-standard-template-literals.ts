import { parseExpression } from "@marko/babel-utils";
import type { Visitor } from "@marko/compiler/babel-types";

const stringVisitor = {
  StringLiteral(string) {
    if (/^\${.*}$/g.test(string.node.value)) {
      string.replaceWith(
        parseExpression(
          string.hub.file,
          string.node.value.slice(2, -1),
          string.node.start ? string.node.start + 2 : undefined
        )
      );
    }
  },
} satisfies Visitor;

export default {
  MarkoPlaceholder(placeholder) {
    placeholder.traverse(stringVisitor);
  },
  MarkoAttribute(attr) {
    const value = attr.get("value");

    if (value.isStringLiteral()) {
      stringVisitor.StringLiteral(value);
    } else {
      value.traverse(stringVisitor);
    }
  },
} satisfies Visitor;
