import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import { x as _marko_escapeXml } from "marko/src/runtime/html/helpers/escape-xml.js";
import _marko_attr from "marko/src/runtime/html/helpers/attr.js";
import _preserve from "marko/src/core-tags/components/preserve-tag.js";
import _marko_tag from "marko/src/runtime/helpers/render-tag.js";
import _marko_props from "marko/src/runtime/html/helpers/data-marko.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  _marko_tag(_preserve, {
    "n": true,
    "renderBody": out => {
      out.w(`<div${_marko_attr("data-id", input.id)}>`);
      out.w(_marko_escapeXml(input.id));
      out.w("</div>");
    }
  }, out, _componentDef, "0");
  _marko_tag(_preserve, {
    "n": true,
    "i": true,
    "renderBody": out => {
      out.w(`<div${_marko_attr("data-id", input.id)}>`);
      out.w(_marko_escapeXml(input.id));
      out.w("</div>");
    }
  }, out, _componentDef, "1");
  _marko_tag(_preserve, {
    "n": true,
    "i": false,
    "renderBody": out => {
      out.w(`<div${_marko_attr("data-id", input.id)}>`);
      out.w(_marko_escapeXml(input.id));
      out.w("</div>");
    }
  }, out, _componentDef, "2");
  out.w(`<div${_marko_attr("data-id", input.id)}>`);
  _marko_tag(_preserve, {
    "n": true,
    "b": true,
    "renderBody": out => {
      out.w(_marko_escapeXml(input.id));
    }
  }, out, _componentDef, "3");
  out.w("</div>");
  out.w(`<div${_marko_attr("data-id", input.id)}>`);
  _marko_tag(_preserve, {
    "n": true,
    "b": true,
    "i": true,
    "renderBody": out => {
      out.w(_marko_escapeXml(input.id));
    }
  }, out, _componentDef, "4");
  out.w("</div>");
  out.w(`<div${_marko_attr("data-id", input.id)}>`);
  _marko_tag(_preserve, {
    "n": true,
    "b": true,
    "i": false,
    "renderBody": out => {
      out.w(_marko_escapeXml(input.id));
    }
  }, out, _componentDef, "5");
  out.w("</div>");
  out.w(`<div${_marko_props(out, _componentDef, {
    pa: ["d", "a", "b"]
  })}${_marko_attr("a", input.id)}${_marko_attr("b", input.id)}${_marko_attr("c", input.id)}></div>`);
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);