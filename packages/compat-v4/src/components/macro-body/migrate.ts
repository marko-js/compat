import { types as t } from "@marko/compiler";
import { diagnosticError } from "@marko/babel-utils";

export default {
  enter(tag: t.NodePath<t.MarkoTag>) {
    const closestMacro = tag.findParent(isMacroDefinition);

    if (!closestMacro) {
      diagnosticError(tag, {
        label: "The <macro-body> tag can only be used inside a <macro> tag.",
      });
      return;
    }

    if (tag.node.attributes.length) {
      diagnosticError(tag, {
        label: "The <macro-body> tag does not support attributes.",
      });
    }

    if (tag.node.body.params.length) {
      diagnosticError(tag, {
        label: "The <macro-body> tag does not support params.",
      });
    }

    if (tag.node.body.body.length) {
      diagnosticError(tag, {
        label: "The <macro-body> tag does not support children.",
      });
    }

    tag.replaceWith(
      t.markoTag(t.identifier("renderBody"), [], t.markoTagBody())
    );
  },
};

function isMacroDefinition(tag: t.NodePath<t.Node>) {
  return (
    tag.node.type === "MarkoTag" &&
    tag.node.name.type === "StringLiteral" &&
    tag.node.name.value === "macro"
  );
}
