import type { types as t } from "@marko/compiler";
import { diagnosticError } from "@marko/babel-utils";

export default (tag: t.NodePath<t.MarkoTag>) => {
  diagnosticError(tag, {
    label: `The <${tag
      .get("name")
      .toString()}> cannot be added via a custom transform.`,
  });
  tag.remove();
};
