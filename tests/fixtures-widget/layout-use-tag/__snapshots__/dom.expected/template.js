import { t as _t } from "marko/src/runtime/vdom/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import Test from "./test.marko";
import _marko_tag from "marko/src/runtime/helpers/render-tag.js";
import _test from "./components/test.marko";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
import { r as _marko_registerComponent } from "marko/src/runtime/components/registry.js";
_marko_registerComponent(_marko_componentType, () => _marko_template);
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  var someData = {
    y: 2
  };
  _marko_tag(Test, {}, out, _componentDef, "0");
  _marko_tag(Test, {
    "x": 1
  }, out, _componentDef, "1");
  _marko_tag(Test, someData, out, _componentDef, "2");
  if (someData.y > 2) {
    _marko_tag(Test, {}, out, _componentDef, "3");
  }
  if (someData.y <= 2) {
    _marko_tag(Test, {}, out, _componentDef, "4");
  }
  _marko_tag(_test, {}, out, _componentDef, "5");
  _marko_tag(_test, {
    "x": 1
  }, out, _componentDef, "6");
  _marko_tag(_test, someData, out, _componentDef, "7");
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);
import _marko_defineComponent from "marko/src/runtime/components/defineComponent.js";
_marko_template.Component = _marko_defineComponent(_marko_component, _marko_template._);