import type { types as t } from "@marko/compiler";
export function isMemberProperty(
  node: t.MemberExpression,
  name: string,
): node is t.MemberExpression & { property: t.StringLiteral | t.Identifier } {
  switch (node.property.type) {
    case "StringLiteral":
      return node.property.value === name;
    case "Identifier":
      return node.property.name === name;
  }

  return false;
}
