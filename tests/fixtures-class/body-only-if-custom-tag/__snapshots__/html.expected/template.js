import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _component from "./components/component-1.marko";
import _component2 from "./components/component-2.marko";
import _component3 from "./components/component-3.marko";
import _marko_tag from "marko/src/runtime/helpers/render-tag.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component4, state, $global) {
  const _tagName = input.show1 ? _component : null;
  if (_tagName) _marko_tag(_tagName, {}, out, _componentDef, "0");
  const _tagName2 = input.show2 ? _component2 : null;
  if (_tagName2) _marko_tag(_tagName2, {}, out, _componentDef, "1");
  const _tagName3 = input.show2 ? _component3 : null;
  if (_tagName3) _marko_tag(_tagName3, {}, out, _componentDef, "2");
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);