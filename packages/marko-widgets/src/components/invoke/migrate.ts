import { types as t } from "@marko/compiler";
import { diagnosticError, withLoc } from "@marko/babel-utils";
import {
  isSourceBooleanAttribute,
  renderCallToDynamicTag,
} from "@marko/compat-utils";

export default {
  exit(tag: t.NodePath<t.MarkoTag>) {
    let hasErrors = false;
    if (!tag.node.attributes.length) {
      diagnosticError(tag, {
        label: "The <invoke> tag requires a value.",
      });
      hasErrors = true;
    }

    const attrs = tag.get("attributes");
    const functionAttr = attrs[0] as t.NodePath<t.MarkoAttribute>;
    if (
      functionAttr &&
      !(
        isSourceBooleanAttribute(functionAttr.node) &&
        functionAttr.node.arguments
      )
    ) {
      diagnosticError(functionAttr, {
        label: "The <invoke> tag requires a function call.",
      });
      hasErrors = true;
    }

    if (hasErrors) {
      tag.remove();
      return;
    }

    const { file } = tag.hub;
    const start = functionAttr.node.start;
    const callIdentifier = t.identifier(functionAttr.node.name);
    const callExpression = t.callExpression(
      callIdentifier,
      functionAttr.node.arguments!,
    );
    if (start != null) {
      withLoc(
        file,
        callIdentifier,
        start,
        start + functionAttr.node.name.length,
      );

      withLoc(file, callExpression, start, functionAttr.node.end!);
    }

    const dynamicTag = renderCallToDynamicTag(callExpression);
    if (dynamicTag) {
      for (let i = 1; i < attrs.length; i++) {
        dynamicTag.attributes.push(attrs[i].node);
      }

      tag.replaceWith(dynamicTag);
      return;
    }

    if (attrs.length > 1) {
      diagnosticError(attrs[1], {
        label: "The <invoke> tag does not support other attributes.",
      });
      tag.remove();
      return;
    }

    tag.replaceWith(
      t.markoScriptlet([t.expressionStatement(callExpression)], false),
    );
  },
};
