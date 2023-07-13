import type { Visitor } from "@marko/compiler/babel-types";
import wPreserveDirectives from "./w-preserve-directives";
import widgetReference from "./widget-reference";

export default [wPreserveDirectives, widgetReference] satisfies Visitor[];
