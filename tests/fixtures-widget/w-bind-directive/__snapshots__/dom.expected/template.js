import { t as _t } from "marko/src/runtime/vdom/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _marko_renderer from "marko/src/runtime/components/legacy/renderer-legacy.js";
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.e("div", {
    "id": _componentDef.elId("_wbind")
  }, "@_wbind", _component, 0, 1);
}, {
  t: _marko_componentType,
  d: true
});