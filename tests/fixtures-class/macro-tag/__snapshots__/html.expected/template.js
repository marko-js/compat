import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import { x as _marko_escapeXml } from "marko/src/runtime/html/helpers/escape-xml.js";
import _marko_dynamic_tag from "marko/src/runtime/helpers/dynamic-tag.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  function _test(out, {
    firstName,
    lastName
  }) {
    out.w("<div>");
    out.w(_marko_escapeXml(firstName));
    out.w(" ");
    out.w(_marko_escapeXml(lastName));
    out.w("</div>");
  }
  _marko_dynamic_tag(out, _test, () => ({
    "firstName": "John"
  }), null, null, null, _componentDef, "2");
  _marko_dynamic_tag(out, _test, () => ({
    "firstName": "John",
    "lastName": "Smith"
  }), null, null, null, _componentDef, "3");
  _marko_dynamic_tag(out, _test, () => ({
    "firstName": "John",
    "lastName": "Smith"
  }), null, null, null, _componentDef, "4");
  function _test2(out, {
    renderBody
  }) {
    out.w("<div>");
    _marko_dynamic_tag(out, renderBody, null, null, null, null, _componentDef, "7");
    out.w("</div>");
  }
  _marko_dynamic_tag(out, _test2, null, out => {
    out.w("Hello");
  }, null, null, _componentDef, "8");
  function _test3(out, {
    renderBody
  }) {
    out.w("<div>");
    _marko_dynamic_tag(out, renderBody, null, null, null, null, _componentDef, "11");
    out.w("</div>");
  }
  function _test4(out, {
    renderBody
  }) {
    out.w("<div>");
    _marko_dynamic_tag(out, renderBody, null, null, null, null, _componentDef, "14");
    out.w("</div>");
  }
  _marko_dynamic_tag(out, _test3, null, out => {
    _marko_dynamic_tag(out, _test4, null, out => {
      out.w("Hello");
    }, null, null, _componentDef, "16");
  }, null, null, _componentDef, "15");
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);