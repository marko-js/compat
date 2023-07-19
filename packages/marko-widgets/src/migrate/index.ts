import type { Visitor } from "@marko/compiler/babel-types";
import scriptMarkoInit from "./script-marko-init";
import wBodyDirective from "./w-body-directive";
import wConfigDirective from "./w-config-directive";
import wFor from "./w-for";
import wIdDirective from "./w-id-directive";
import widgetReference from "./widget-reference";
import wPreserveDirectives from "./w-preserve-directives";

export default [
  scriptMarkoInit,
  wBodyDirective,
  wConfigDirective,
  wFor,
  wIdDirective,
  widgetReference,
  wPreserveDirectives,
] satisfies Visitor[];
