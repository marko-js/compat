import type { Visitor } from "@marko/compiler/babel-types";
import wPreserveDirectives from "./w-preserve-directives";
import wBodyDirective from "./w-body-directive";
import widgetReference from "./widget-reference";
import scriptMarkoInit from "./script-marko-init";
import wConfigDirective from "./w-config-directive";

export default [
  wPreserveDirectives,
  wBodyDirective,
  widgetReference,
  wConfigDirective,
  scriptMarkoInit,
] satisfies Visitor[];
