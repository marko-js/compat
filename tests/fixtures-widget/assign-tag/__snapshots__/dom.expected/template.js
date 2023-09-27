import { t as _t } from "marko/src/runtime/vdom/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
function _toString(value) {
  return value == null ? "" : value;
}
import _marko_renderer from "marko/src/runtime/components/renderer.js";
import { r as _marko_registerComponent } from "marko/src/runtime/components/registry";
_marko_registerComponent(_marko_componentType, () => _marko_template);
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  var firstName = "John";
  var lastName = "Smith";
  var fullName;
  fullName = `${_toString(firstName)} ${_toString(lastName)}`;
  out.be("div", null, "0", _component, null, 0);
  out.t(fullName, _component);
  out.ee();
  var count = 0;
  count++;
  if (count === 1) {
    count++;
  }
  out.be("div", null, "1", _component, null, 0);
  out.t(count, _component);
  out.ee();
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);
import _marko_defineComponent from "marko/src/runtime/components/defineComponent.js";
_marko_template.Component = _marko_defineComponent(_marko_component, _marko_template._);