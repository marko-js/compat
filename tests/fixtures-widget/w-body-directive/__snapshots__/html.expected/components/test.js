import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/components/test.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import { x as _marko_escapeXml } from "marko/src/runtime/html/helpers/escape-xml.js";
import _marko_dynamic_tag from "marko/src/runtime/helpers/dynamic-tag.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.w("<div>");
  if (typeof input.renderBody === "string") {
    out.w(_marko_escapeXml(input.renderBody));
  } else {
    _marko_dynamic_tag(out, input.renderBody, null, null, null, null, _componentDef, "1");
  }
  out.w("</div>");
  out.w("<div>");
  if (typeof input.renderBody === "string") {
    out.w(_marko_escapeXml(input.renderBody));
  } else {
    _marko_dynamic_tag(out, input.renderBody, null, out => {
      out.w("Child Content");
    }, null, null, _componentDef, "3");
  }
  out.w("</div>");
  var inputAlias = input;
  out.w("<div>");
  _marko_dynamic_tag(out, inputAlias.renderBody, null, null, null, null, _componentDef, "5");
  out.w("</div>");
  var bodyAlias = input.renderBody;
  out.w("<div>");
  if (typeof bodyAlias === "string") {
    out.w(_marko_escapeXml(bodyAlias));
  } else {
    _marko_dynamic_tag(out, bodyAlias, null, null, null, null, _componentDef, "7");
  }
  out.w("</div>");
  var textContent = "Text Content";
  out.w("<div>");
  if (typeof textContent === "string") {
    out.w("Text Content");
  } else {
    out.w(`<${textContent}></${textContent}>`);
  }
  out.w("</div>");
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);