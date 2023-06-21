import { types as t } from "@marko/compiler";
import { resolveRelativePath } from "@marko/babel-utils";

export function importCustomTag(
  tag: t.NodePath<t.MarkoTag & { name: t.StringLiteral }>,
  tagFile: string
) {
  const {
    node,
    hub: { file },
  } = tag;
  const { name } = node;
  const program = file.path;
  const shorthandImport = `<${name.value}>`;
  const relativeImport = resolveRelativePath(file, tagFile);
  let identifierName: string | undefined;
  let lastImport: t.NodePath<t.ImportDeclaration> | undefined;

  for (const child of program.get("body")) {
    if (child.isImportDeclaration()) {
      const { source } = child.node;
      lastImport = child;

      if (source.value === relativeImport || source.value === shorthandImport) {
        for (const specifier of child.node.specifiers) {
          if (specifier.type === "ImportDefaultSpecifier") {
            identifierName = specifier.local.name;
            break;
          }
        }

        if (!identifierName) {
          identifierName = generateTagImportName(tag);
          child.pushContainer(
            "specifiers",
            t.importDefaultSpecifier(t.identifier(identifierName))
          );
        }

        break;
      }
    }
  }

  if (!identifierName) {
    identifierName = generateTagImportName(tag);
    const newImport = t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier(identifierName))],
      t.stringLiteral(shorthandImport)
    );

    if (lastImport) {
      lastImport.insertAfter(newImport);
    } else {
      program.unshiftContainer("body", newImport);
    }
  }

  return t.identifier(identifierName);
}

function generateTagImportName(
  tag: t.NodePath<t.MarkoTag & { name: t.StringLiteral }>
) {
  let identifierName = tag.node.name.value
    .replace(/(?<=^|-)[a-z]/g, toUpperCase)
    .replace(/[^a-zA-Z0-9_$]/g, "");
  if (
    tag.scope.hasBinding(identifierName) ||
    tag.scope.hasGlobal(identifierName)
  ) {
    const suffixedIdentifierName = `${identifierName}Template`;

    if (
      tag.scope.hasBinding(suffixedIdentifierName) ||
      tag.scope.hasGlobal(suffixedIdentifierName)
    ) {
      identifierName = tag.scope.generateUid(identifierName);
    } else {
      identifierName = suffixedIdentifierName;
    }
  }
  return identifierName;
}

function toUpperCase(str: string) {
  return str.toUpperCase();
}
