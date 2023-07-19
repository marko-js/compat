import { types as t } from "@marko/compiler";
import {
  diagnosticDeprecate,
  diagnosticError,
  registerMacro,
} from "@marko/babel-utils";
import {
  getAllNodes,
  getAllTags,
  isSourceBooleanAttribute,
} from "@marko/compat-utils";

export default {
  enter(tag: t.NodePath<t.MarkoTag>) {
    const { node } = tag;
    if (node.attributes.length !== 1) {
      return;
    }

    const [attr] = node.attributes;
    if (!isSourceBooleanAttribute(attr) || !attr.arguments) {
      return;
    }

    registerMacro(tag, attr.name);
  },
  exit(tag: t.NodePath<t.MarkoTag>) {
    const { node } = tag;
    if (node.var || node.body.params.length || node.attributes.length !== 1) {
      return;
    }

    const [attr] = node.attributes;
    if (!isSourceBooleanAttribute(attr) || !attr.arguments) {
      return;
    }

    const name = attr.name;
    let params = attr.arguments as t.Identifier[];

    for (const param of params) {
      if (param.type !== "Identifier") {
        diagnosticError(tag, {
          label:
            "Only identifiers are supported as params on legacy <macro> tags.",
          loc: param.loc || false,
        });
        return;
      }
    }

    diagnosticDeprecate(tag.get("attributes")[0], {
      label:
        'The "<macro my-macro(input)>" syntax has been deprecated. Please use the new tag param syntax, eg: "<macro|input| name="my-macro">. See: https://github.com/marko-js/marko/wiki/Deprecation:-legacy-macro',
      fix() {
        for (const childNode of getAllNodes(node.body)) {
          switch (childNode.type) {
            case "Identifier":
              if (childNode.name === "renderBody") {
                break;
              }
              continue;
            case "MarkoTag":
              if (childNode.name.type === "StringLiteral") {
                if (childNode.name.value === "macro-body") {
                  break;
                }
              }

              continue;
            default:
              continue;
          }

          params = [...params, t.identifier("renderBody")];
          break;
        }

        for (const childTag of getAllTags(tag.hub.file.path.node.body)) {
          if (
            childTag.name.type === "StringLiteral" &&
            childTag.name.value === name &&
            childTag.arguments
          ) {
            // Update all references to this macro that are using the arguments syntax and migrate those also to use attributes.
            for (let i = 0; i < childTag.arguments.length; i++) {
              const arg = childTag.arguments[i];
              if (arg.type === "SpreadElement") {
                diagnosticError(tag, {
                  label:
                    "Spread arguments cannot be used to provide data to legacy macro tags.",
                  loc: arg.loc || false,
                });
              } else {
                childTag.attributes.push(t.markoAttribute(params[i].name, arg));
              }
            }
          }

          childTag.arguments = [];
        }

        tag.replaceWith(
          t.markoTag(
            tag.node.name,
            [t.markoAttribute("name", t.stringLiteral(name))],
            t.markoTagBody(
              tag.node.body.body,
              params.length
                ? [
                    t.objectPattern(
                      params.map((param) =>
                        t.objectProperty(param, param, false, true),
                      ),
                    ),
                  ]
                : [],
            ),
          ),
        );
      },
    });
  },
};
