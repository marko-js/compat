import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
function _toString(value) {
  return value == null ? "" : value;
}
const fromStatic = "${STATIC}";
import _marko_class_merge from "marko/src/runtime/helpers/class-value.js";
import _marko_attr from "marko/src/runtime/html/helpers/attr.js";
import { d as _marko_escape_double_quotes } from "marko/src/runtime/html/helpers/escape-quotes.js";
import { x as _marko_escapeXml } from "marko/src/runtime/html/helpers/escape-xml.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  const fromScriptlet = "${SCRIPLET}";
  const a = 1;
  const b = 2;
  const c = 3;
  out.w(`<div${_marko_attr("class", _marko_class_merge(a))} id="${_marko_escape_double_quotes(a)}"${_marko_attr("data-other", b)}></div>`);
  out.w("<div id=a>");
  out.w(_marko_escapeXml(fromStatic));
  out.w("</div>");
  out.w("<div id=b>");
  out.w(_marko_escapeXml(fromScriptlet));
  out.w("</div>");
  out.w("<div id=c>");
  out.w(_marko_escapeXml(a));
  out.w("</div>");
  out.w("<div id=d>");
  out.w("abc}");
  out.w("</div>");
  out.w("<div id=e>");
  out.w("abc}");
  out.w("</div>");
  out.w("<div id=f>");
  out.w("abc}");
  out.w("</div>");
  out.w("<div id=g>");
  out.w("abcd}ef");
  out.w("</div>");
  out.w("<div id=h>");
  out.w(_marko_escapeXml(`abc${_toString(c)}`));
  out.w("</div>");
  out.w("<div id=i>");
  out.w(_marko_escapeXml(`abc${_toString({
    x: 1
  }.missing)}def`));
  out.w("</div>");
  out.w("<div id=j>");
  out.w("${abc}");
  out.w("</div>");
  const handler = console.log;
  out.w("<button></button>");
}, {
  t: _marko_componentType,
  d: true
}, _marko_component);