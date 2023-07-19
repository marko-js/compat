import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _eventEmitter from "./components/event-emitter.marko";
import _marko_tag from "marko/src/runtime/helpers/render-tag.js";
import _marko_props from "marko/src/runtime/html/helpers/data-marko.js";
import _marko_attr from "marko/src/runtime/html/helpers/attr.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  function trackEvent(name) {
    return (...args) => {
      window.__test_events__.push([name, args.slice(0, -1)]);
    };
  }
  _marko_tag(_eventEmitter, {}, out, _componentDef, "@a", [["thing", trackEvent("a"), false]]);
  _marko_tag(_eventEmitter, {}, out, _componentDef, "@a", [["thing", trackEvent("b"), false]]);
  _marko_tag(_eventEmitter, {}, out, _componentDef, "@a", [["thing", trackEvent("c"), false]]);
  _marko_tag(_eventEmitter, {}, out, _componentDef, "@a", [["Thing", trackEvent("d"), false]]);
  out.w(`<div${_marko_props(out, _componentDef, {
    "onthing": _componentDef.d("thing", trackEvent("a"), false)
  }, "@a", _componentDef)}${_marko_attr("id", _componentDef.elId("a"))}></div>`);
  out.w(`<div${_marko_props(out, _componentDef, {
    "onthing": _componentDef.d("thing", trackEvent("b"), false)
  }, "@a", _componentDef)}${_marko_attr("id", _componentDef.elId("a"))}></div>`);
  out.w(`<div${_marko_props(out, _componentDef, {
    "onthing": _componentDef.d("thing", trackEvent("c"), false)
  }, "@a", _componentDef)}${_marko_attr("id", _componentDef.elId("a"))}></div>`);
  out.w(`<div${_marko_props(out, _componentDef, {
    "onThing": _componentDef.d("Thing", trackEvent("d"), false)
  }, "@a", _componentDef)}${_marko_attr("id", _componentDef.elId("a"))}></div>`);
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);