import { types as t } from "@marko/compiler";
import { diagnosticError } from "@marko/babel-utils";

export default {
  exit(tag: t.NodePath<t.MarkoTag>) {
    const closestMacro = tag.findParent(isMacroDefinition);
    let hasErrors = false;

    if (!closestMacro) {
      diagnosticError(tag, {
        label: "The <macro-body> tag can only be used inside a <macro> tag.",
      });
      hasErrors = true;
    }

    if (tag.node.attributes.length) {
      diagnosticError(tag, {
        label: "The <macro-body> tag does not support attributes.",
        loc: tag.node.attributes[0].loc || tag.node.loc || false,
      });
      hasErrors = true;
    }

    if (tag.node.body.params.length) {
      diagnosticError(tag, {
        label: "The <macro-body> tag does not support params.",
        loc: tag.node.body.params[0].loc || tag.node.loc || false,
      });
      hasErrors = true;
    }

    if (tag.node.body.body.length) {
      diagnosticError(tag, {
        label: "The <macro-body> tag does not support children.",
        loc: tag.node.body.body[0].loc || tag.node.loc || false,
      });
      hasErrors = true;
    }

    if (hasErrors) {
      tag.remove();
      return;
    }

    tag.replaceWith(
      t.markoTag(t.identifier("renderBody"), [], t.markoTagBody()),
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
