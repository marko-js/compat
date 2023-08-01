import { t as _t } from "marko/src/runtime/vdom/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import "./template.marko.register.js";
import _marko_renderer from "marko/src/runtime/components/legacy/renderer-legacy.js";
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.e("input", {
    "id": _componentDef.elId("a")
  }, "@a", _component, 0, 1);
  out.be("label", {
    "for": _componentDef.elId("a")
  }, "0", _component, null, 0);
  out.t("a", _component);
  out.ee();
  out.e("input", {
    "id": _componentDef.elId("b")
  }, "@b", _component, 0, 1);
  out.be("label", {
    "for": _componentDef.elId("b")
  }, "1", _component, null, 0);
  out.t("b", _component);
  out.ee();
  out.e("input", {
    "id": _componentDef.elId("c")
  }, "@c", _component, 0, 1);
  out.be("label", {
    "for": _componentDef.elId("c")
  }, "2", _component, null, 0);
  out.t("c", _component);
  out.ee();
}, {
  t: _marko_componentType,
  i: true,
  s: true,
  d: true
});