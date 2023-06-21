import type { Visitor } from "@marko/compiler/babel-types";
import ifDirective from "./if-directive";
import dynamicAttributes from "./dynamic-attributes";
import bodyOnlyIfDirective from "./body-only-if-directive";
import nonStandardTemplateLiterals from "./non-standard-template-literals";

export default [
  ifDirective,
  dynamicAttributes,
  bodyOnlyIfDirective,
  nonStandardTemplateLiterals,
] satisfies Visitor[];
