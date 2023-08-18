import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";

export default {
  exit(tag: t.NodePath<t.MarkoTag>) {
    diagnosticDeprecate(tag, {
      label: "The <async-fragments> is no longer necessary and can be removed.",
      fix() {
        tag.replaceWithMultiple(tag.node.body.body);
      },
    });
  },
};
