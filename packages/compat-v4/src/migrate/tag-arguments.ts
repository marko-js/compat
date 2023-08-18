import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";
import {
  exprToAttrs,
  getTagFile,
  isCoreOrMigrateTag,
} from "@marko/compat-utils";

export default {
  MarkoTag(tag) {
    const args = tag.node.arguments;
    if (!args || isCoreOrMigrateTag(tag) || !getTagFile(tag)) {
      return;
    }

    diagnosticDeprecate(tag, {
      label:
        "Tag arguments have been deprecated. Instead use regular attributes, or spread attributes.",
      fix() {
        const attrs: t.MarkoTag["attributes"] = [];
        for (const arg of args) {
          if (arg.type === "SpreadElement") {
            attrs.push(t.markoSpreadAttribute(arg.argument));
            continue;
          }

          for (const attr of exprToAttrs(arg)) {
            attrs.push(attr);
          }
        }

        tag.node.arguments = null;
        tag.node.attributes = attrs.concat(tag.node.attributes);
      },
    });
  },
} satisfies t.Visitor;
