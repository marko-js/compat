import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _marko_renderer from "marko/src/runtime/components/legacy/renderer-legacy.js";
import _marko_widget from "./index.js";
import _marko_defineWidget from "marko/src/runtime/components/legacy/defineWidget-legacy.js";
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.w("<div></div>");
}, {
  t: _marko_componentType,
  d: true
}, _marko_defineWidget(_marko_widget));