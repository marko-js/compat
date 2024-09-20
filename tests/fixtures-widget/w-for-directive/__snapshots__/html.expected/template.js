import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _marko_props from "marko/src/runtime/html/helpers/data-marko.js";
import _marko_attr from "marko/src/runtime/html/helpers/attr.js";
import _marko_renderer from "marko/src/runtime/components/legacy/renderer-legacy.js";
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.w(`<input${_marko_props(out, _componentDef, 0, "@a")}${_marko_attr("id", _componentDef.elId("a"))}>`);
  out.w(`<label${_marko_attr("for", _componentDef.elId("a"))}>`);
  out.w("a");
  out.w("</label>");
  out.w(`<input${_marko_props(out, _componentDef, 0, "@b")}${_marko_attr("id", _componentDef.elId("b"))}>`);
  out.w(`<label${_marko_attr("for", _componentDef.elId("b"))}>`);
  out.w("b");
  out.w("</label>");
  out.w(`<input${_marko_props(out, _componentDef, 0, "@c")}${_marko_attr("id", _componentDef.elId("c"))}>`);
  out.w(`<label${_marko_attr("for", _componentDef.elId("c"))}>`);
  out.w("c");
  out.w("</label>");
}, {
  t: _marko_componentType,
  i: true,
  s: true,
  d: true
});