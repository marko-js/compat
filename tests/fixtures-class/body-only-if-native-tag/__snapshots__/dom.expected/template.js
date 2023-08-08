import { t as _t } from "marko/src/runtime/vdom/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _marko_renderer from "marko/src/runtime/components/renderer.js";
import { r as _marko_registerComponent } from "marko/src/runtime/components/registry";
_marko_registerComponent(_marko_componentType, () => _marko_template);
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.be("div", null, "0", _component, null, 0);
  {
    const _tagName = input.test ? null : "span";
    if (_tagName) out.be(_tagName, null, "1", _component, null, 0);else out.bf("f_1", _component);
    out.t("Blah", _component);
    if (_tagName) out.ee();else out.ef();
    const _tagName2 = input.test ? null : "span";
    if (_tagName2) out.be(_tagName2, null, "2", _component, null, 0);else out.bf("f_2", _component);
    out.t("Blah", _component);
    if (_tagName2) out.ee();else out.ef();
    if (input.shouldShow) {
      const _tagName3 = input.test ? null : "span";
      if (_tagName3) out.be(_tagName3, null, "3", _component, null, 0);else out.bf("f_3", _component);
      out.t("Blah", _component);
      if (_tagName3) out.ee();else out.ef();
    }
    out.t("Blah", _component);
    out.be("span", null, "4", _component, null, 0);
    out.t("Blah", _component);
    out.ee();
  }
  out.ee();
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);
import _marko_defineComponent from "marko/src/runtime/components/defineComponent.js";
_marko_template.Component = _marko_defineComponent(_marko_component, _marko_template._);