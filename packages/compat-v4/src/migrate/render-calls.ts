import { types as t } from "@marko/compiler";
import { diagnosticDeprecate } from "@marko/babel-utils";
import { replaceRenderCallStatements } from "@marko/compat-utils";

export default {
  MarkoScriptlet(scriptlet) {
    const replacedBody: t.MarkoTagBody["body"] = [];
    let replaced = false;
    for (const node of scriptlet.node.body) {
      if (replaceRenderCallStatements(node, replacedBody)) {
        replaced = true;
      } else {
        replacedBody.push(t.markoScriptlet([node]));
      }
    }
    if (replaced) {
      diagnosticDeprecate(scriptlet, {
        label:
          "Directly rendering by passing `out` to a function is deprecated. Please use the dynamic tag instead. See: https://github.com/marko-js/marko/wiki/Deprecation:-imperative-render-calls",
        loc: scriptlet.node.loc || scriptlet.node.body[0].loc || false,
        fix() {
          scriptlet.replaceWithMultiple(replacedBody);
        },
      });
    }
  },
} satisfies t.Visitor;
