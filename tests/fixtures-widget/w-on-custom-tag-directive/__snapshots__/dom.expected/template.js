import { t as _t } from "marko/src/runtime/vdom/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import "./template.marko.register.js";
import _eventEmitter from "./components/event-emitter.marko";
import _marko_tag from "marko/src/runtime/helpers/render-tag.js";
import _marko_renderer from "marko/src/runtime/components/legacy/renderer-legacy.js";
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  function trackEvent(name) {
    return (...args) => {
      window.__test_events__.push([name, args.slice(0, -1)]);
    };
  }
  _marko_tag(_eventEmitter, {}, out, _componentDef, "0", [["thing", trackEvent("a"), false]]);
  _marko_tag(_eventEmitter, {}, out, _componentDef, "1", [["thing", trackEvent("b"), false]]);
  _marko_tag(_eventEmitter, {}, out, _componentDef, "2", [["thing", trackEvent("c"), false]]);
  _marko_tag(_eventEmitter, {}, out, _componentDef, "3", [["Thing", trackEvent("d"), false]]);
  out.e("div", null, "4", _component, 0, 0, {
    "onthing": _componentDef.d("thing", trackEvent("e"), false)
  });
  out.e("div", null, "5", _component, 0, 0, {
    "onthing": _componentDef.d("thing", trackEvent("f"), false)
  });
  out.e("div", null, "6", _component, 0, 0, {
    "onthing": _componentDef.d("thing", trackEvent("g"), false)
  });
  out.e("div", null, "7", _component, 0, 0, {
    "onThing": _componentDef.d("Thing", trackEvent("h"), false)
  });
}, {
  t: _marko_componentType,
  i: true,
  s: true,
  d: true
});