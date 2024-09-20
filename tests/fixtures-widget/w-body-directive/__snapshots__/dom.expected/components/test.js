import { t as _t } from "marko/src/runtime/vdom/index.js";
const _marko_componentType = "<fixture-dir>/components/test.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _marko_dynamic_tag from "marko/src/runtime/helpers/dynamic-tag.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
import { r as _marko_registerComponent } from "marko/src/runtime/components/registry.js";
_marko_registerComponent(_marko_componentType, () => _marko_template);
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.be("div", null, "0", _component, null, 0);
  if (typeof input.renderBody === "string") {
    out.t(input.renderBody, _component);
  } else {
    _marko_dynamic_tag(out, input.renderBody, null, null, null, null, _componentDef, "1");
  }
  out.ee();
  out.be("div", null, "2", _component, null, 0);
  if (typeof input.renderBody === "string") {
    out.t(input.renderBody, _component);
  } else {
    _marko_dynamic_tag(out, input.renderBody, null, out => {
      out.t("Child Content", _component);
    }, null, null, _componentDef, "3");
  }
  out.ee();
  var inputAlias = input;
  out.be("div", null, "4", _component, null, 0);
  _marko_dynamic_tag(out, inputAlias.renderBody, null, null, null, null, _componentDef, "5");
  out.ee();
  var bodyAlias = input.renderBody;
  out.be("div", null, "6", _component, null, 0);
  if (typeof bodyAlias === "string") {
    out.t(bodyAlias, _component);
  } else {
    _marko_dynamic_tag(out, bodyAlias, null, null, null, null, _componentDef, "7");
  }
  out.ee();
  var textContent = "Text Content";
  out.be("div", null, "8", _component, null, 0);
  if (typeof textContent === "string") {
    out.t(textContent, _component);
  } else {
    out.e(textContent, null, "9", _component, 0, 0);
  }
  out.ee();
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);
import _marko_defineComponent from "marko/src/runtime/components/defineComponent.js";
_marko_template.Component = _marko_defineComponent(_marko_component, _marko_template._);