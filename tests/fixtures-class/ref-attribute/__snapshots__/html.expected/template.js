import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {
  handleClick() {
    this.getEl("thing").style.color = 'red';
  }
};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.w("<button>");
  out.w("Click Me");
  out.w("</button>");
}, {
  t: _marko_componentType,
  d: true
}, _marko_component);