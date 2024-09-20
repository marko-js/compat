import { types as t } from "@marko/compiler";
import {
  diagnosticDeprecate,
  diagnosticError,
  getEnd,
  getStart,
  parseStatements,
} from "@marko/babel-utils";

export default {
  MarkoTag(tag) {
    if (
      tag.node.name.type !== "StringLiteral" ||
      tag.node.name.value !== "script"
    )
      return;

    const { file } = tag.hub;
    for (const attr of tag.get("attributes")) {
      if (attr.node.type !== "MarkoAttribute") continue;
      switch (attr.node.name) {
        case "marko-init":
        case "template-helpers": {
          const { body } = tag.node.body;
          if (!body.length) {
            diagnosticDeprecate(attr, {
              label: `The "${attr.node.name}" attribute on <script> is deprecated. Since this tag is empty it can safely be removed. See https://github.com/marko-js/marko/wiki/Deprecation:-script-template-helpers`,
              fix() {
                tag.remove();
              },
            });
            return;
          }

          const start = getStart(file, body[0]);
          const end = getEnd(file, body[body.length - 1]);

          if (start == null || end == null) {
            diagnosticError(attr, {
              label: `The "${attr.node.name}" attribute on <script> is deprecated. See https://github.com/marko-js/marko/wiki/Deprecation:-script-template-helpers`,
            });
            tag.remove();
            return;
          }

          const statements = parseStatements(
            file,
            file.code.slice(start, end),
            start,
            end,
          );

          diagnosticDeprecate(attr, {
            label: `The "${attr.node.name}" attribute on <script> is deprecated. Use the static tag instead. See https://github.com/marko-js/marko/wiki/Deprecation:-script-template-helpers`,
            fix() {
              tag.replaceWith(t.markoScriptlet(statements));
            },
          });
          return;
        }
      }
    }
  },
} satisfies t.Visitor;
