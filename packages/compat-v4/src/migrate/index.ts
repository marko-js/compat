import type { Visitor } from "@marko/compiler/babel-types";
import ifDirective from "./if-directive";
import loopDirective from "./loop-directive";
import renderCalls from "./render-calls";
import dynamicAttributes from "./dynamic-attributes";
import bodyOnlyIfDirective from "./body-only-if-directive";
import nonStandardTemplateLiterals from "./non-standard-template-literals";
import includeDirective from "./include-directive";
import legacyAttributeTags from "./legacy-attribute-tags";
import keyModifier from "./key-modifier";
import refAttribute from "./ref-attribute";
import nativeTagNamespacedAttribute from "./native-tag-namespaced-attribute";
import tagArguments from "./tag-arguments";
import hoistAttrTags from "./hoist-attr-tags";

export default [
  ifDirective,
  loopDirective,
  includeDirective,
  keyModifier,
  refAttribute,
  legacyAttributeTags,
  renderCalls,
  dynamicAttributes,
  bodyOnlyIfDirective,
  nonStandardTemplateLiterals,
  nativeTagNamespacedAttribute,
  tagArguments,
  hoistAttrTags,
] satisfies Visitor[];
