import path from "path";
import { types as t } from "@marko/compiler";
import {
  diagnosticDeprecate,
  diagnosticError,
  getTaglibLookup,
} from "@marko/babel-utils";
import { exprToAttrs, importTemplateAtPath } from "@marko/compat-utils";

export default {
  enter(tag: t.NodePath<t.MarkoTag>) {
    const args = tag.node.arguments;
    if (!args?.length) {
      diagnosticError(tag, {
        label:
          'The <include(...)> tag must have an argument: <include("./target.marko")/> or <include(input.renderBody)/>',
      });

      tag.remove();
      return;
    }

    if (args.length > 2) {
      diagnosticError(tag, {
        label: "The <include> tag only supports 2 arguments.",
      });

      tag.remove();
      return;
    }

    for (const arg of args) {
      if (arg.type === "SpreadElement") {
        diagnosticError(tag, {
          label: "The <include> tag does not support spread arguments.",
          loc: arg.loc || tag.node.loc || false,
        });

        tag.remove();
        return;
      }
    }

    const { file } = tag.hub;
    const [rendererExpression, inputExpression] = args as t.Expression[];
    let tagNameExpression: t.Expression;

    if (rendererExpression.type === "StringLiteral") {
      const lookup = getTaglibLookup(file);
      const request = rendererExpression.value;
      const resolvedRequest = path.join(
        file.opts.filename as string,
        "..",
        request,
      );

      for (const def of lookup.getTagsSorted()) {
        if (
          def.template === resolvedRequest ||
          def.renderer === resolvedRequest
        ) {
          tagNameExpression = t.stringLiteral(def.name);
          break;
        }
      }

      tagNameExpression ||= importTemplateAtPath(tag, rendererExpression.value);
    } else {
      tagNameExpression = rendererExpression;
    }

    diagnosticDeprecate(tag, {
      label:
        'The "<include>" tag is deprecated. Please use the "<${dynamic}/>" tag or import and reference the tag directly. See: https://github.com/marko-js/marko/wiki/Deprecation:-include-tag',
      fix() {
        tag.replaceWith(
          t.markoTag(
            tagNameExpression,
            exprToAttrs(inputExpression),
            tag.node.body,
          ),
        );
      },
    });
  },
};
