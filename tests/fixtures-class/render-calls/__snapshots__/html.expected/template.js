import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _marko_dynamic_tag from "marko/src/runtime/helpers/dynamic-tag.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  _marko_dynamic_tag(out, input, null, null, null, null, _componentDef, "0");
  _marko_dynamic_tag(out, input.renderThing, null, null, null, null, _componentDef, "1");
  _marko_dynamic_tag(out, input, null, null, [attrs], null, _componentDef, "2");
  _marko_dynamic_tag(out, renderBody, null, null, null, null, _componentDef, "3");
  _marko_dynamic_tag(out, input.template, null, null, [{
    x: 1
  }], null, _componentDef, "4");
  _marko_dynamic_tag(out, input.template, null, null, [{
    y() {}
  }], null, _componentDef, "5");
  _marko_dynamic_tag(out, {
    render: input.barRenderer
  }, null, null, null, null, _componentDef, "6");
  _marko_dynamic_tag(out, {
    render: state.barRenderer
  }, null, null, null, null, _componentDef, "7");
  _marko_dynamic_tag(out, {
    render: input.barRenderer
  }, null, null, null, null, _componentDef, "8");
  _marko_dynamic_tag(out, {
    render: x.barRenderer
  }, null, null, null, null, _componentDef, "9");
  _marko_dynamic_tag(out, out => input.barRenderer({}, true, out), null, null, null, null, _componentDef, "10");
  if (x) {
    _marko_dynamic_tag(out, renderA, null, null, null, null, _componentDef, "11");
  } else {
    if (y) {
      _marko_dynamic_tag(out, renderB, null, null, null, null, _componentDef, "12");
    } else {
      _marko_dynamic_tag(out, renderC, null, null, null, null, _componentDef, "13");
    }
  }
  if (x) {
    _marko_dynamic_tag(out, renderA, null, null, null, null, _componentDef, "14");
  } else {
    if (y) {
      _marko_dynamic_tag(out, renderB, null, null, null, null, _componentDef, "15");
    } else {
      _marko_dynamic_tag(out, renderC, null, null, null, null, _componentDef, "16");
    }
  }
  if (x) {
    _marko_dynamic_tag(out, render, null, null, null, null, _componentDef, "17");
  }
  if (!x) {
    _marko_dynamic_tag(out, render, null, null, null, null, _componentDef, "18");
  }
  let i = 0;
  let _keyValue = 0;
  while (i < 10) {
    const _keyScope = `[${_keyValue++}]`;
    _marko_dynamic_tag(out, input.items[i], null, null, null, null, _componentDef, "19" + _keyScope);
    i++;
  }
  let j = 10;
  let _keyValue2 = 0;
  while (j--) {
    const _keyScope2 = `[${_keyValue2++}]`;
    _marko_dynamic_tag(out, input, null, null, null, null, _componentDef, "20" + _keyScope2);
  }
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);