import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";

export default {
  exit(tag: t.NodePath<t.MarkoTag>) {
    diagnosticDeprecate(tag, {
      label:
        "The <component-globals> is no longer necessary and can be removed.",
      fix() {
        tag.remove();
      },
    });
  },
};
