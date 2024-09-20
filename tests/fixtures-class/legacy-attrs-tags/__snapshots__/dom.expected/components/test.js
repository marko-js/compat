import { t as _t } from "marko/src/runtime/vdom/index.js";
const _marko_componentType = "<fixture-dir>/components/test.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _marko_dynamic_tag from "marko/src/runtime/helpers/dynamic-tag.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
import { r as _marko_registerComponent } from "marko/src/runtime/components/registry.js";
_marko_registerComponent(_marko_componentType, () => _marko_template);
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.be("div", {
    "class": "a"
  }, "0", _component, null, 1);
  out.t(JSON.stringify(input.a), _component);
  _marko_dynamic_tag(out, input.a, null, null, null, null, _componentDef, "1");
  out.ee();
  out.be("div", {
    "class": "b"
  }, "2", _component, null, 1);
  out.t(JSON.stringify(input.b), _component);
  _marko_dynamic_tag(out, input.b, null, null, null, null, _componentDef, "3");
  out.ee();
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);
import _marko_defineComponent from "marko/src/runtime/components/defineComponent.js";
_marko_template.Component = _marko_defineComponent(_marko_component, _marko_template._);