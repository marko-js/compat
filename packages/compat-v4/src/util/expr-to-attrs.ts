import { types as t } from "@marko/compiler";

export function exprToAttrs(expr: t.Expression | undefined) {
  if (!expr) {
    return [];
  }

  if (expr.type !== "ObjectExpression") {
    return [t.markoSpreadAttribute(expr)];
  }

  const attrs: t.MarkoTag["attributes"] = [];
  let props: t.ObjectExpression["properties"] | undefined;

  for (const prop of expr.properties) {
    switch (prop.type) {
      case "ObjectMethod": {
        const name = getPropKeyName(prop.key);
        if (name) {
          props = undefined;
          attrs.push(t.markoAttribute(name, methodToFunctionExpression(prop)));
        } else if (props) {
          props.push(prop);
        } else {
          attrs.push(
            t.markoSpreadAttribute(t.objectExpression((props = [prop]))),
          );
        }

        break;
      }
      case "ObjectProperty": {
        const name = getPropKeyName(prop.key);
        if (name) {
          props = undefined;
          attrs.push(t.markoAttribute(name, prop.value as t.Expression));
        } else if (props) {
          props.push(prop);
        } else {
          attrs.push(
            t.markoSpreadAttribute(t.objectExpression((props = [prop]))),
          );
        }
        break;
      }
      case "SpreadElement":
        props = undefined;
        attrs.push(t.markoSpreadAttribute(prop.argument));
        break;
    }
  }

  return attrs;
}

function methodToFunctionExpression(method: t.ObjectMethod) {
  const fn = t.functionExpression(
    null,
    method.params,
    method.body,
    method.generator,
    method.async,
  );

  fn.trailingComments = method.trailingComments;
  fn.typeParameters = method.typeParameters;
  fn.returnType = method.returnType;
  fn.extra = method.extra;
  fn.start = method.start;
  fn.end = method.end;
  fn.loc = method.loc;
  return fn;
}

function getPropKeyName(key: t.ObjectProperty["key"]) {
  switch (key.type) {
    case "Identifier":
      return key.name;
    case "StringLiteral":
      return key.value;
  }
}
