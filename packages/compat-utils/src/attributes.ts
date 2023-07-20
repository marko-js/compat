import type { types as t } from "@marko/compiler";

export function isSourceBooleanAttribute(
  node: t.MarkoAttribute | t.MarkoSpreadAttribute,
): node is t.MarkoAttribute & { value: t.BooleanLiteral & { value: true } } {
  return (
    node.type === "MarkoAttribute" &&
    !node.value.loc &&
    node.value.type === "BooleanLiteral" &&
    node.value.value
  );
}

export function getAttribute(tag: t.NodePath<t.MarkoTag>, name: string) {
  for (const attr of tag.get("attributes")) {
    if (attr.node.type === "MarkoAttribute" && attr.node.name === name) {
      return attr as t.NodePath<t.MarkoAttribute>;
    }
  }
}

export function getAttributeValue(tag: t.NodePath<t.MarkoTag>, name: string) {
  return getAttribute(tag, name)?.get("value");
}

export function hasAttribute(tag: t.NodePath<t.MarkoTag>, name: string) {
  return !!getAttribute(tag, name);
}
