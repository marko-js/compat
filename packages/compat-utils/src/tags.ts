import type { types as t } from "@marko/compiler";
import { getTagDef } from "@marko/babel-utils";

export function getTagFile(tag: t.NodePath<t.MarkoTag>) {
  const def = getTagDef(tag);
  return def && (def.template || def.renderer);
}

export function willMigrateTag(tag: t.NodePath<t.MarkoTag>) {
  switch (getTagDef(tag)?.taglibId) {
    case "marko-widgets":
    case "@marko/compat-v4":
      return true;
    default:
      return false;
  }
}
