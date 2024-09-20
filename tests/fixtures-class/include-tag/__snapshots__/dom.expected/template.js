import { t as _t } from "marko/src/runtime/vdom/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import Test from "./test.marko";
import Nested from "./nested/index.marko";
import Thing from "./nested/thing.marko";
import _marko_tag from "marko/src/runtime/helpers/render-tag.js";
import _test from "./components/test.marko";
import _marko_dynamic_tag from "marko/src/runtime/helpers/dynamic-tag.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
import { r as _marko_registerComponent } from "marko/src/runtime/components/registry.js";
_marko_registerComponent(_marko_componentType, () => _marko_template);
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.be("div", {
    "class": "a"
  }, "0", _component, null, 1);
  _marko_tag(Test, {}, out, _componentDef, "1");
  out.ee();
  out.be("div", {
    "class": "b"
  }, "2", _component, null, 1);
  _marko_tag(Nested, {}, out, _componentDef, "3");
  out.ee();
  out.be("div", {
    "class": "c"
  }, "4", _component, null, 1);
  _marko_tag(Thing, {}, out, _componentDef, "5");
  out.ee();
  out.be("div", {
    "class": "d"
  }, "6", _component, null, 1);
  _marko_tag(_test, {}, out, _componentDef, "7");
  out.ee();
  out.be("div", {
    "class": "e"
  }, "8", _component, null, 1);
  _marko_tag(Test, {
    "value": 1
  }, out, _componentDef, "9");
  out.ee();
  out.be("div", {
    "class": "f"
  }, "10", _component, null, 1);
  _marko_tag(Nested, {
    "value": 1
  }, out, _componentDef, "11");
  out.ee();
  out.be("div", {
    "class": "g"
  }, "12", _component, null, 1);
  _marko_tag(Thing, {
    "value": 1
  }, out, _componentDef, "13");
  out.ee();
  out.be("div", {
    "class": "h"
  }, "14", _component, null, 1);
  _marko_tag(_test, {
    "value": 1
  }, out, _componentDef, "15");
  out.ee();
  out.be("div", {
    "class": "i"
  }, "16", _component, null, 1);
  if (typeof null === "string") {} else {
    const _tagName = null;
    if (_tagName) _marko_tag(_tagName, {}, out, _componentDef, "17");
  }
  out.ee();
  out.be("div", {
    "class": "j"
  }, "18", _component, null, 1);
  if (typeof false === "string") {
    out.t(false, _component);
  } else {
    _marko_dynamic_tag(out, false, null, null, null, null, _componentDef, "19");
  }
  out.ee();
  out.be("div", {
    "class": "k"
  }, "20", _component, null, 1);
  if (typeof Test === "string") {
    out.t(Test, _component);
  } else {
    _marko_tag(Test, {}, out, _componentDef, "21");
  }
  out.ee();
  out.be("div", {
    "class": "l"
  }, "22", _component, null, 1);
  _marko_tag(Test, {
    "renderBody": out => {
      out.t("template.marko renderbody", _component);
    }
  }, out, _componentDef, "23");
  out.ee();
  out.be("div", {
    "class": "m"
  }, "24", _component, null, 1);
  _marko_tag(Test, {
    "value": 1
  }, out, _componentDef, "25");
  out.ee();
  out.be("div", {
    "class": "n"
  }, "26", _component, null, 1);
  var obj = {
    value: 1
  };
  _marko_tag(Test, obj, out, _componentDef, "27");
  out.ee();
  out.be("div", {
    "class": "o"
  }, "28", _component, null, 1);
  var obj = {
    value: 1
  };
  _marko_tag(Test, {
    "someMethod": function () {
      return 1;
    },
    get someGetter() {
      return 1;
    },
    [1 + 1]: 2,
    set someSetter(value) {},
    "someAsyncMethod": async function () {
      return 1;
    },
    "someGeneratorMethod": function* () {
      yield 1;
    },
    ...obj,
    "anotherValue": 1
  }, out, _componentDef, "29");
  out.ee();
  out.be("div", {
    "class": "p"
  }, "30", _component, null, 1);
  _marko_tag(Test, {
    [1 + 1]: 2,
    "stringName": 3
  }, out, _componentDef, "31");
  out.ee();
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);
import _marko_defineComponent from "marko/src/runtime/components/defineComponent.js";
_marko_template.Component = _marko_defineComponent(_marko_component, _marko_template._);