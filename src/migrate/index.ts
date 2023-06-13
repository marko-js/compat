import type { Visitor } from "@marko/compiler/babel-types";
import dynamicAttributes from "./dynamic-attributes";
import nonStandardTemplateLiterals from "./non-standard-template-literals";

export default [
  dynamicAttributes,
  nonStandardTemplateLiterals,
] satisfies Visitor[];
