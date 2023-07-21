import { t as _t } from "marko/src/runtime/vdom/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _marko_renderer from "marko/src/runtime/components/legacy/renderer-legacy.js";
import _marko_widget from "./index.js";
import { r as _marko_registerComponent } from "marko/src/runtime/components/registry";
_marko_registerComponent(_marko_componentType, () => _marko_template);
import _marko_defineWidget from "marko/src/runtime/components/legacy/defineWidget-legacy.js";
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.e("div", null, "0", _component, 0, 0);
}, {
  t: _marko_componentType,
  d: true
}, _marko_defineWidget(_marko_widget));