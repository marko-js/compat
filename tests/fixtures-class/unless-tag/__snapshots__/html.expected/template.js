import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  const falseCondition = false;
  const trueCondition = true;
  if (!falseCondition) {
    out.w("should show a");
  }
  if (!(trueCondition, falseCondition)) {
    out.w("should show b");
  }
  if (!trueCondition) {
    out.w("SHOULD NOT SHOW!");
  }
  if (!(falseCondition, trueCondition)) {
    out.w("SHOULD NOT SHOW");
  }
  if (!trueCondition) {
    out.w("SHOULD NOT SHOW!");
  } else {
    out.w("should show c");
  }
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);