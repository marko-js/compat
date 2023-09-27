import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
function _toString(value) {
  return value == null ? "" : value;
}
import { x as _marko_escapeXml } from "marko/src/runtime/html/helpers/escape-xml.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  var firstName = "John";
  var lastName = "Smith";
  var fullName;
  fullName = `${_toString(firstName)} ${_toString(lastName)}`;
  out.w("<div>");
  out.w(_marko_escapeXml(fullName));
  out.w("</div>");
  var count = 0;
  count++;
  if (count === 1) {
    count++;
  }
  out.w("<div>");
  out.w(_marko_escapeXml(count));
  out.w("</div>");
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);