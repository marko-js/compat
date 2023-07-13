import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import { x as _marko_escapeXml } from "marko/src/runtime/html/helpers/escape-xml.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  var x = 0;
  var fn = (...args) => {
    for (const arg of args) {
      x += arg;
    }
  };
  fn(1);
  fn(2, 3);
  fn(...[4, 5, 6]);
  out.w(_marko_escapeXml(x));
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);