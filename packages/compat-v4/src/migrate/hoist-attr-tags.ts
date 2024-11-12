import { isAttributeTag, isTransparentTag } from "@marko/babel-utils";
import { types as t } from "@marko/compiler";

export default {
  Program: {
    exit(program) {
      for (const child of program.get("body")) {
        if (child.isMarkoTag()) {
          hoistAttrTags(child);
        }
      }
    },
  },
} satisfies t.Visitor;

function hoistAttrTags(tag: t.NodePath<t.MarkoTag>) {
  let hadAttrTags = false;
  const isControlFlow = isTransparentTag(tag);
  const body = tag.get("body");
  for (const child of body.get("body")) {
    if (child.isMarkoTag()) {
      const hoistedChildren = hoistAttrTags(child);
      if (
        isAttributeTag(child) ||
        (isTransparentTag(child) && hoistedChildren)
      ) {
        if (!isControlFlow) {
          tag.pushContainer("attributeTags", child.node);
          child.remove();
        }
        hadAttrTags = true;
      }
    }
  }

  if (isControlFlow && hadAttrTags) {
    body.node.attributeTags = true;
  }

  return hadAttrTags;
}
