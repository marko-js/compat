import { t as _t } from "marko/src/runtime/vdom/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
function _toString(value) {
  return value == null ? "" : value;
}
const fromStatic = "${STATIC}";
import _marko_class_merge from "marko/src/runtime/helpers/class-value.js";
import _marko_merge_attrs from "marko/src/runtime/vdom/helpers/merge-attrs.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
import { r as _marko_registerComponent } from "marko/src/runtime/components/registry.js";
_marko_registerComponent(_marko_componentType, () => _marko_template);
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  const fromScriptlet = "${SCRIPLET}";
  const a = 1;
  const b = 2;
  const c = 3;
  const d = "d";
  out.e("div", {
    "class": _marko_class_merge(a),
    "id": `${a}`,
    "data-other": b
  }, "0", _component, 0, 0);
  out.be("div", {
    "id": "a"
  }, "1", _component, null, 1);
  out.t(fromStatic, _component);
  out.ee();
  out.be("div", {
    "id": "b"
  }, "2", _component, null, 1);
  out.t(fromScriptlet, _component);
  out.ee();
  out.be("div", {
    "id": "c"
  }, "3", _component, null, 1);
  out.t(a, _component);
  out.ee();
  out.be("div", {
    "id": "d"
  }, "4", _component, null, 1);
  out.t(`abc${"}"}`, _component);
  out.ee();
  out.be("div", {
    "id": "e"
  }, "5", _component, null, 1);
  out.t(`abc${'}'}`, _component);
  out.ee();
  out.be("div", {
    "id": "f"
  }, "6", _component, null, 1);
  out.t(`abc${`}`}`, _component);
  out.ee();
  out.be("div", {
    "id": "g"
  }, "7", _component, null, 1);
  out.t(`abc${`d${"}"}e`}f`, _component);
  out.ee();
  out.be("div", {
    "id": "h"
  }, "8", _component, null, 1);
  out.t(`abc${_toString(c)}`, _component);
  out.ee();
  out.be("div", {
    "id": "i"
  }, "9", _component, null, 1);
  out.t(`abc${_toString({
    x: 1
  }.missing)}def`, _component);
  out.ee();
  out.be("div", {
    "id": "j"
  }, "10", _component, null, 1);
  out.t('\${abc}', _component);
  out.ee();
  out.e("div", _marko_merge_attrs(a, {
    "id": "k"
  }), "11", _component, 0, 4);
  out.e("div", _marko_merge_attrs(d, {
    "id": "l"
  }), "12", _component, 0, 4);
  out.be("div", {
    "id": "m"
  }, "13", _component, null, 1);
  out.t(a, _component);
  out.ee();
  const handler = console.log;
  out.e("button", null, "14", _component, 0, 0, {
    "onclick": _componentDef.d("click", handler, false)
  });
}, {
  t: _marko_componentType,
  d: true
}, _marko_component);
import _marko_defineComponent from "marko/src/runtime/components/defineComponent.js";
_marko_template.Component = _marko_defineComponent(_marko_component, _marko_template._);