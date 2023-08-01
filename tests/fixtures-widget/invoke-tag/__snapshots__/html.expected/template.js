import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _marko_dynamic_tag from "marko/src/runtime/helpers/dynamic-tag.js";
import { x as _marko_escapeXml } from "marko/src/runtime/html/helpers/escape-xml.js";
import _marko_renderer from "marko/src/runtime/components/legacy/renderer-legacy.js";
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
  var renderBody = out => out.write('hi');
  _marko_dynamic_tag(out, renderBody, null, null, null, null, _componentDef, "@hi");
  out.w(_marko_escapeXml(x));
}, {
  t: _marko_componentType,
  i: true,
  s: true,
  d: true
});