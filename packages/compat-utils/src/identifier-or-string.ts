import { types as t } from "@marko/compiler";

export function isIdentifierOrStringNamed(
  expr: t.MemberExpression["property"],
  name: string,
) {
  return (
    (expr.type === "Identifier" && expr.name === name) ||
    (expr.type === "StringLiteral" && expr.value === name)
  );
}
