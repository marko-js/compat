import { types as t } from "@marko/compiler";
import { resolveRelativePath } from "@marko/babel-utils";

export function importCustomTag(
  tag: t.NodePath<t.MarkoTag & { name: t.StringLiteral }>,
  tagFile: string,
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
          identifierName = generateTemplateImportName(tag, tag.node.name.value);
          child.pushContainer(
            "specifiers",
            t.importDefaultSpecifier(t.identifier(identifierName)),
          );
        }

        break;
      }
    }
  }

  if (!identifierName) {
    identifierName = generateTemplateImportName(tag, tag.node.name.value);
    const newImport = t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier(identifierName))],
      t.stringLiteral(shorthandImport),
    );

    if (lastImport) {
      lastImport.insertAfter(newImport);
    } else {
      program.unshiftContainer("body", newImport);
    }
  }

  return t.identifier(identifierName);
}

export function importTemplateAtPath(ref: t.NodePath<any>, request: string) {
  const {
    hub: { file },
  } = ref;
  const program = file.path;
  let identifierName = generateTemplateImportName(
    ref,
    /\/([^/]+?)(?:\/(?:index|template|renderer))?(?:\..*)?$/.exec(
      request,
    )?.[1] || "",
  );
  let lastImport: t.NodePath<t.ImportDeclaration> | undefined;
  let wasImported = false;

  for (const child of program.get("body")) {
    if (child.isImportDeclaration()) {
      const { source } = child.node;
      lastImport = child;

      if (source.value === request) {
        for (const specifier of child.node.specifiers) {
          if (specifier.type === "ImportDefaultSpecifier") {
            identifierName = specifier.local.name;
            wasImported = true;
            break;
          }
        }

        if (!wasImported) {
          wasImported = true;
          child.pushContainer(
            "specifiers",
            t.importDefaultSpecifier(t.identifier(identifierName)),
          );
        }

        break;
      }
    }
  }

  if (!wasImported) {
    const newImport = t.importDeclaration(
      [t.importDefaultSpecifier(t.identifier(identifierName))],
      t.stringLiteral(request),
    );

    if (lastImport) {
      lastImport.insertAfter(newImport);
    } else {
      program.unshiftContainer("body", newImport);
    }
  }

  return t.identifier(identifierName);
}

function generateTemplateImportName(ref: t.NodePath<any>, name: string) {
  let identifierName =
    name
      .replace(/(?<=^|-)[a-z]/g, toUpperCase)
      .replace(/^[^$A-Z_]|[^0-9A-Z_$]/gi, "") || "_";
  if (
    ref.scope.hasBinding(identifierName) ||
    ref.scope.hasGlobal(identifierName)
  ) {
    const suffixedIdentifierName = `${identifierName}Template`;

    if (
      ref.scope.hasBinding(suffixedIdentifierName) ||
      ref.scope.hasGlobal(suffixedIdentifierName)
    ) {
      identifierName = ref.scope.generateUid(identifierName);
    } else {
      identifierName = suffixedIdentifierName;
    }
  }
  return identifierName;
}

function toUpperCase(str: string) {
  return str.toUpperCase();
}
