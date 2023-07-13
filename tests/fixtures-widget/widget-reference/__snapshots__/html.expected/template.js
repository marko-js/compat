import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _marko_attr from "marko/src/runtime/html/helpers/attr.js";
import { x as _marko_escapeXml } from "marko/src/runtime/html/helpers/escape-xml.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.w(`<div${_marko_attr("id", _componentDef.elId(true))}></div>`);
  out.w(`<div${_marko_attr("id", _componentDef.elId("my-div"))}></div>`);
  out.w(`<div${_marko_attr("id", _component.elId("my-repeated-thing", 1))}></div>`);
  out.w("<div>");
  out.w(_marko_escapeXml(typeof _component));
  out.w("</div>");
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);