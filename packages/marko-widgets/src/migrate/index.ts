import type { Visitor } from "@marko/compiler/babel-types";
import wPreserveDirectives from "./w-preserve-directives";
import widgetReference from "./widget-reference";
import scriptMarkoInit from "./script-marko-init";

export default [
  wPreserveDirectives,
  widgetReference,
  scriptMarkoInit,
] satisfies Visitor[];
