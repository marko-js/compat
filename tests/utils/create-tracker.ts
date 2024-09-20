import format, { plugins } from "pretty-format";

const { DOMElement, DOMCollection } = plugins;
const enum NodeType {
  ELEMENT_NODE = 1,
  TEXT_NODE = 3,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
}
const enum NodeFilter {
  SHOW_ELEMENT = 1,
  SHOW_COMMENT = 128,
}

export default function createTracker(
  window: Window & typeof globalThis,
  container: ParentNode,
) {
  let currentRecords: MutationRecord[] | null = null;
  const logs: string[] = [];
  const errors: Set<Error> = new Set();

  window.addEventListener("error", handleError);
  window.addEventListener("unhandledrejection", handleRejection);
  const observer = new window.MutationObserver(addRecords);
  observer.observe(container, {
    attributes: true,
    attributeOldValue: true,
    characterData: true,
    characterDataOldValue: true,
    childList: true,
    subtree: true,
  });

  return {
    log(message: string) {
      logs.push(message);
    },
    logUpdate(update: unknown) {
      throwErrors();
      addRecords(observer.takeRecords());
      logs.push(
        getStatusString(
          cloneAndNormalize(container),
          currentRecords || [],
          update,
        ),
      );
      currentRecords = null;
    },
    getLogs() {
      return logs.join("\n\n");
    },
    cleanup() {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
      observer.disconnect();
      throwErrors();
    },
  };

  function throwErrors() {
    switch (errors.size) {
      case 0:
        return;
      case 1:
        for (const err of errors) throw err;
        break;
      default:
        throw new AggregateError(
          errors,
          `\n${[...errors].join("\n").replace(/^(?!\s*$)/gm, "\t")}`,
        );
    }
  }

  function handleError(ev: ErrorEvent) {
    errors.add(ev.error.detail || ev.error);
    ev.preventDefault();
  }

  function handleRejection(ev: PromiseRejectionEvent) {
    errors.add(ev.reason.detail || ev.reason);
    ev.preventDefault();
  }

  function addRecords(records: MutationRecord[]) {
    if (currentRecords) {
      currentRecords = currentRecords.concat(records);
    } else {
      currentRecords = records;
    }
  }
}

function cloneAndNormalize(container: ParentNode) {
  const idMap: Map<string, number> = new Map();
  const clone = container.cloneNode(true);
  const document = isDocument(container) ? container : container.ownerDocument!;
  const commentAndElementWalker = document.createTreeWalker(
    clone,
    NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT,
  );

  let node: Comment | Element;
  let nextNode = commentAndElementWalker.nextNode();
  while ((node = nextNode as Comment | Element)) {
    nextNode = commentAndElementWalker.nextNode();
    if (
      isComment(node) ||
      (node.tagName === "SCRIPT" && node.textContent?.includes("$MC"))
    ) {
      node.remove();
    } else {
      const { id, attributes } = node;
      if (/\d/.test(id)) {
        let idIndex = idMap.get(id);

        if (idIndex === undefined) {
          idIndex = idMap.size;
          idMap.set(id, idIndex);
        }

        node.id = `GENERATED-${idIndex}`;
      }

      for (let i = attributes.length; i--; ) {
        const attr = attributes[i];

        if (/^data-(w-|widget$|marko(-|$))/.test(attr.name)) {
          node.removeAttributeNode(attr);
        }
      }
    }
  }

  if (idMap.size) {
    const elementWalker = document.createTreeWalker(
      clone,
      1 /** SHOW_ELEMENT */,
    );

    nextNode = elementWalker.nextNode();
    while ((node = nextNode as Element)) {
      nextNode = elementWalker.nextNode();
      const { attributes } = node;

      for (let i = attributes.length; i--; ) {
        const attr = attributes[i];
        const { value } = attr;
        const updated = value
          .split(" ")
          .map((part) => {
            const idIndex = idMap.get(part);
            if (idIndex === undefined) {
              return part;
            }

            return `GENERATED-${idIndex}`;
          })
          .join(" ");

        if (value !== updated) {
          attr.value = updated;
        }
      }
    }
  }

  clone.normalize();

  return clone;
}

function getStatusString(
  container: Node,
  records: MutationRecord[],
  update: unknown,
) {
  const updateString =
    update == null ||
    (typeof update === "object" && !Object.keys(update).length)
      ? ""
      : typeof update === "function"
        ? `\n${getFunctionBody(update.toString()).replace(/^ {4}/gm, "")}\n`
        : ` ${JSON.stringify(update)}`;

  const formattedHTML = Array.from(container.childNodes)
    .map((child) =>
      format(child, {
        plugins: [DOMElement, DOMCollection],
      }).trim(),
    )
    .filter(Boolean)
    .join("\n")
    .trim();

  const formattedMutations = records
    .map(formatMutationRecord)
    .filter(Boolean)
    .join("\n");

  return `# Render${updateString}\n\`\`\`html\n${formattedHTML}\n\`\`\`${
    formattedMutations
      ? `\n\n# Mutations\n\`\`\`\n${formattedMutations}\n\`\`\``
      : ""
  }`;
}

function formatMutationRecord(record: MutationRecord) {
  const { target, oldValue } = record;

  switch (record.type) {
    case "attributes": {
      const { attributeName } = record;
      const newValue = (target as HTMLElement).getAttribute(
        attributeName as string,
      );
      return `${getNodePath(target)}: attr(${attributeName}) ${JSON.stringify(
        oldValue,
      )} => ${JSON.stringify(newValue)}`;
    }

    case "characterData": {
      const newValue = target.nodeValue;

      // if the new value begins with the old value
      // and whitespace delimits the old value and remaining new value
      if (
        newValue?.indexOf(oldValue!) === 0 &&
        (/\s$/ms.test(oldValue!) || /\s$/ms.test(newValue![oldValue!.length]))
      ) {
        // filter out invalid records that jsdom creates
        // see https://github.com/jsdom/jsdom/issues/3261
        // TODO: remove if fixed
        return;
      }

      return `${getNodePath(target)}: ${JSON.stringify(
        oldValue || "",
      )} => ${JSON.stringify(target.nodeValue || "")}`;
    }

    case "childList": {
      const { removedNodes, addedNodes, previousSibling, nextSibling } = record;
      const details: string[] = [];
      if (removedNodes.length) {
        const relativeNode = previousSibling || nextSibling || target;
        const position =
          relativeNode === previousSibling
            ? "after"
            : relativeNode === nextSibling
              ? "before"
              : "in";
        details.push(
          `removed ${Array.from(removedNodes)
            .map(getNodePath)
            .join(", ")} ${position} ${getNodePath(relativeNode)}`,
        );
      }

      if (addedNodes.length) {
        details.push(
          `inserted ${Array.from(addedNodes).map(getNodePath).join(", ")}`,
        );
      }

      return details.join("\n");
    }
  }
}

function getNodePath(node: Node) {
  const parts: string[] = [];
  let cur: Node | null = node;
  while (cur) {
    const { parentNode } = cur;

    let name = getNodeTypeName(cur);
    const index = parentNode
      ? (Array.from(parentNode.childNodes) as Node[]).indexOf(cur)
      : -1;

    if (index !== -1) {
      name += `${index}`;
    }

    parts.unshift(name);

    if (
      !parentNode ||
      parentNode.nodeType !== NodeType.ELEMENT_NODE ||
      (parentNode as Element).tagName === "BODY"
    ) {
      break;
    }

    cur = parentNode as Node;
  }

  return parts.join("/");
}

function getNodeTypeName(node: Node) {
  return node.nodeName.toLowerCase();
}

function isDocument(node: Node): node is Document {
  return node.nodeType === NodeType.DOCUMENT_NODE;
}

function isComment(node: Node): node is Comment {
  return node.nodeType === NodeType.COMMENT_NODE;
}

function getFunctionBody(source: string) {
  const match = source.match(/^[^(=]*(?:\(.*?\))?(?:\s*=>)?\s*({)?/m);
  if (match) {
    if (match[1]) {
      return trimDedent(
        source
          .slice(match[0].length)
          .replace(/;?\s*}\s*$/m, ";")
          .trim(),
      );
    }
    return trimDedent(source.slice(match[0].length).replace(/;?\s*$/m, ";"));
  }

  return trimDedent(source);
}

function trimDedent(str: string) {
  const indent = str.match(/^[ \t]+(?=\S)/gm);
  if (!indent) {
    return str.trim();
  }

  return str
    .replace(new RegExp(`^[ \\t]{${indent[0].length}}`, "gm"), "")
    .trim();
}
