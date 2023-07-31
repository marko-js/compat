import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _marko_props from "marko/src/runtime/html/helpers/data-marko.js";
import _marko_attr from "marko/src/runtime/html/helpers/attr.js";
import _marko_renderer from "marko/src/runtime/components/legacy/renderer-legacy.js";
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.w(`<div${_marko_props(out, _componentDef, 0, "@_wbind", _componentDef)}${_marko_attr("id", _componentDef.elId("_wbind"))}></div>`);
}, {
  t: _marko_componentType,
  d: true
});