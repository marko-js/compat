import { t as _t } from "marko/src/runtime/vdom/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import Component1 from "./components/component-1.marko";
import Component2Template from "./components/component-2.marko";
import _Component from "./components/component-3.marko";
import Component4Template from "./components/component-4.marko";
const Component2 = "test";
const Component3 = "test";
const Component3Template = "test";
import _marko_tag from "marko/src/runtime/helpers/render-tag.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
import { r as _marko_registerComponent } from "marko/src/runtime/components/registry";
_marko_registerComponent(_marko_componentType, () => _marko_template);
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.be("div", {
    "id": "no-body"
  }, "0", _component, null, 1);
  {
    const _tagName = input.show1 ? null : Component1;
    if (_tagName) _marko_tag(_tagName, {}, out, _componentDef, "1");
    const _tagName2 = input.show2 ? null : Component2Template;
    if (_tagName2) _marko_tag(_tagName2, {}, out, _componentDef, "2");
    const _tagName3 = input.show3 ? null : _Component;
    if (_tagName3) _marko_tag(_tagName3, {}, out, _componentDef, "3");
    const _tagName4 = input.show4 ? null : Component4Template;
    if (_tagName4) _marko_tag(_tagName4, {}, out, _componentDef, "4");
  }
  out.ee();
  out.be("div", {
    "id": "with-body"
  }, "5", _component, null, 1);
  {
    const _tagName5 = input.show1 ? null : Component1;
    const _renderBody = out => {
      out.t("Body 1", _component);
    };
    if (_tagName5) _marko_tag(_tagName5, {
      "renderBody": _renderBody
    }, out, _componentDef, "6");else _renderBody(out);
    const _tagName6 = input.show2 ? null : Component2Template;
    const _renderBody2 = out => {
      out.t("Body 2", _component);
    };
    if (_tagName6) _marko_tag(_tagName6, {
      "renderBody": _renderBody2
    }, out, _componentDef, "7");else _renderBody2(out);
    const _tagName7 = input.show3 ? null : _Component;
    const _renderBody3 = out => {
      out.t("Body 3", _component);
    };
    if (_tagName7) _marko_tag(_tagName7, {
      "renderBody": _renderBody3
    }, out, _componentDef, "8");else _renderBody3(out);
    const _tagName8 = input.show4 ? null : Component4Template;
    const _renderBody4 = out => {
      out.t("Body 4", _component);
    };
    if (_tagName8) _marko_tag(_tagName8, {
      "renderBody": _renderBody4
    }, out, _componentDef, "9");else _renderBody4(out);
  }
  out.ee();
  out.t("Referenced Global ", _component);
  out.t(typeof Component4 === "undefined", _component);
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);
import _marko_defineComponent from "marko/src/runtime/components/defineComponent.js";
_marko_template.Component = _marko_defineComponent(_marko_component, _marko_template._);