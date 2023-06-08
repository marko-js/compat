import type { Visitor } from "@marko/compiler/babel-types";
import nonStandardTemplateLiterals from "./non-standard-template-literals";

export default [nonStandardTemplateLiterals] satisfies Visitor[];
