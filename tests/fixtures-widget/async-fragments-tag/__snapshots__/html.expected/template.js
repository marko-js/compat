import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import { x as _marko_escapeXml } from "marko/src/runtime/html/helpers/escape-xml.js";
import _marko_self_iterator from "marko/src/runtime/helpers/self-iterator.js";
import _await from "marko/src/core-tags/core/await/renderer.js";
import _marko_tag from "marko/src/runtime/helpers/render-tag.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.w("Before outside");
  out.w("<div class=outer>");
  out.w("Before ");
  out.w("Before inside ");
  _marko_tag(_await, {
    "timeout": 10000,
    "_provider": Promise.resolve("a"),
    "_name": "Promise.resolve(\"a\")",
    "then": {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      },
      [Symbol.iterator]: _marko_self_iterator
    }
  }, out, _componentDef, "1");
  out.w(" After inside");
  out.w(" After");
  out.w("</div>");
  out.w("After outside");
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);