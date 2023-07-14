import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/components/test.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import { x as _marko_escapeXml } from "marko/src/runtime/html/helpers/escape-xml.js";
import _marko_dynamic_tag from "marko/src/runtime/helpers/dynamic-tag.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.w("<div class=a>");
  out.w(_marko_escapeXml(JSON.stringify(input.a)));
  _marko_dynamic_tag(out, input.a, null, null, null, null, _componentDef, "1");
  out.w("</div>");
  out.w("<div class=b>");
  out.w(_marko_escapeXml(JSON.stringify(input.b)));
  _marko_dynamic_tag(out, input.b, null, null, null, null, _componentDef, "3");
  out.w("</div>");
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);