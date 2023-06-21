import { t as _t } from "marko/src/runtime/vdom/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import Component1 from "./components/component-1.marko";
import Component2Template from "./components/component-2.marko";
import _Component from "./components/component-3.marko";
import Component4Template from "./components/component-4.marko";
const Component2 = "test";
const Component3 = "test";
const Component3Template = "test";
import _marko_tag from "marko/src/runtime/helpers/render-tag.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
import { r as _marko_registerComponent } from "marko/src/runtime/components/registry";
_marko_registerComponent(_marko_componentType, () => _marko_template);
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  const _tagName = input.show1 ? Component1 : null;
  if (_tagName) _marko_tag(_tagName, {}, out, _componentDef, "0");
  const _tagName2 = input.show2 ? Component2Template : null;
  if (_tagName2) _marko_tag(_tagName2, {}, out, _componentDef, "1");
  const _tagName3 = input.show3 ? _Component : null;
  if (_tagName3) _marko_tag(_tagName3, {}, out, _componentDef, "2");
  const _tagName4 = input.show4 ? Component4Template : null;
  if (_tagName4) _marko_tag(_tagName4, {}, out, _componentDef, "3");
  out.t("Referenced Global ", _component);
  out.t(typeof Component4 === "undefined", _component);
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);
import _marko_defineComponent from "marko/src/runtime/components/defineComponent.js";
_marko_template.Component = _marko_defineComponent(_marko_component, _marko_template._);