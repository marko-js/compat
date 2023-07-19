import type { Visitor } from "@marko/compiler/babel-types";
import wPreserveDirectives from "./w-preserve-directives";
import wIdDirective from "./w-id-directive";
import wBodyDirective from "./w-body-directive";
import widgetReference from "./widget-reference";
import scriptMarkoInit from "./script-marko-init";
import wConfigDirective from "./w-config-directive";

export default [
  wPreserveDirectives,
  wIdDirective,
  wBodyDirective,
  widgetReference,
  wConfigDirective,
  scriptMarkoInit,
] satisfies Visitor[];
