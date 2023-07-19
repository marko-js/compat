import { types as t } from "@marko/compiler";

export function* getAllTags(
  body: (t.Program["body"] | t.MarkoTag["body"]["body"])[number][],
): Generator<t.MarkoTag> {
  for (const child of body) {
    if (child.type === "MarkoTag") {
      yield child;
      yield* getAllTags(child.body.body);
    }
  }
}

export function* getAllNodes(node: t.Node | null | void): Generator<t.Node> {
  if (!node) return;
  yield node;

  for (const key of (t as any).VISITOR_KEYS[node.type]) {
    const child = (node as any)[key] as void | null | t.Node | t.Node[];

    if (Array.isArray(child)) {
      for (const item of child) {
        yield* getAllNodes(item);
      }
    } else {
      yield* getAllNodes(child);
    }
  }
}
