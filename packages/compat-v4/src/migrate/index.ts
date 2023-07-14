import type { Visitor } from "@marko/compiler/babel-types";
import ifDirective from "./if-directive";
import forDirective from "./for-directive";
import renderCalls from "./render-calls";
import dynamicAttributes from "./dynamic-attributes";
import bodyOnlyIfDirective from "./body-only-if-directive";
import nonStandardTemplateLiterals from "./non-standard-template-literals";
import includeDirective from "./include-directive";
import legacyAttributeTags from "./legacy-attribute-tags";

export default [
  ifDirective,
  forDirective,
  includeDirective,
  legacyAttributeTags,
  renderCalls,
  dynamicAttributes,
  bodyOnlyIfDirective,
  nonStandardTemplateLiterals,
] satisfies Visitor[];
