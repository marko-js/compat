import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import Test from "./test.marko";
import Nested from "./nested/index.marko";
import Thing from "./nested/thing.marko";
import _marko_tag from "marko/src/runtime/helpers/render-tag.js";
import _test from "./components/test.marko";
import _marko_dynamic_tag from "marko/src/runtime/helpers/dynamic-tag.js";
import { x as _marko_escapeXml } from "marko/src/runtime/html/helpers/escape-xml.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.w("<div class=a>");
  _marko_tag(Test, {}, out, _componentDef, "1");
  out.w("</div>");
  out.w("<div class=b>");
  _marko_tag(Nested, {}, out, _componentDef, "3");
  out.w("</div>");
  out.w("<div class=c>");
  _marko_tag(Thing, {}, out, _componentDef, "5");
  out.w("</div>");
  out.w("<div class=d>");
  _marko_tag(_test, {}, out, _componentDef, "7");
  out.w("</div>");
  out.w("<div class=e>");
  _marko_tag(Test, {
    "value": 1
  }, out, _componentDef, "9");
  out.w("</div>");
  out.w("<div class=f>");
  _marko_tag(Nested, {
    "value": 1
  }, out, _componentDef, "11");
  out.w("</div>");
  out.w("<div class=g>");
  _marko_tag(Thing, {
    "value": 1
  }, out, _componentDef, "13");
  out.w("</div>");
  out.w("<div class=h>");
  _marko_tag(_test, {
    "value": 1
  }, out, _componentDef, "15");
  out.w("</div>");
  out.w("<div class=i>");
  if (typeof null === "string") {} else {
    const _tagName = null;
    if (_tagName) _marko_tag(_tagName, {}, out, _componentDef, "17");
  }
  out.w("</div>");
  out.w("<div class=j>");
  if (typeof false === "string") {
    out.w("false");
  } else {
    _marko_dynamic_tag(out, false, null, null, null, null, _componentDef, "19");
  }
  out.w("</div>");
  out.w("<div class=k>");
  if (typeof Test === "string") {
    out.w(_marko_escapeXml(Test));
  } else {
    _marko_tag(Test, {}, out, _componentDef, "21");
  }
  out.w("</div>");
  out.w("<div class=l>");
  out.w("template.marko renderbody");
  _marko_tag(Test, {}, out, _componentDef, "23");
  out.w("</div>");
  out.w("<div class=m>");
  _marko_tag(Test, {
    "value": 1
  }, out, _componentDef, "25");
  out.w("</div>");
  out.w("<div class=n>");
  var obj = {
    value: 1
  };
  out.w("<div>");
  _marko_tag(Test, obj, out, _componentDef, "28");
  out.w("</div>");
  out.w("</div>");
  out.w("<div class=o>");
  var obj = {
    value: 1
  };
  out.w("<div>");
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
  }, out, _componentDef, "31");
  out.w("</div>");
  out.w("</div>");
  out.w("<div class=p>");
  _marko_tag(Test, {
    [1 + 1]: 2,
    "stringName": 3
  }, out, _componentDef, "33");
  out.w("</div>");
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);