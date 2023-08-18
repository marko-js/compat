import path from "path";
import { types as t } from "@marko/compiler";
import { getTagDef, getTaglibLookup } from "@marko/babel-utils";
import { importTemplateAtPath } from ".";

export function getTagFile(tag: t.NodePath<t.MarkoTag>) {
  const def = getTagDef(tag);
  return def && (def.template || def.renderer);
}

export function willMigrateTag(
  tag: t.NodePath<t.MarkoTag>,
): tag is t.NodePath<t.MarkoTag & { name: t.StringLiteral }> {
  switch (getTagDef(tag)?.taglibId) {
    case "marko-widgets":
    case "@marko/compat-v4":
      return true;
    default:
      return false;
  }
}

export function willMigrateAllAttrs(tag: t.NodePath<t.MarkoTag>) {
  if (willMigrateTag(tag)) {
    switch (tag.node.name.value) {
      case "assign":
      case "invoke":
      case "var":
        return true;
    }
  }

  return false;
}

export function getTagNameForTemplatePath(
  ref: t.NodePath<any>,
  request: string,
) {
  const { file } = ref.hub;
  const lookup = getTaglibLookup(file);
  const resolvedRequest = path.join(
    file.opts.filename as string,
    "..",
    request,
  );

  for (const def of lookup.getTagsSorted()) {
    if (def.template === resolvedRequest || def.renderer === resolvedRequest) {
      return t.stringLiteral(def.name);
    }
  }

  return importTemplateAtPath(ref, request);
}
