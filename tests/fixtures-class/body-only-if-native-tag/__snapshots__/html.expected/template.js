import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  out.w("<div>");
  {
    const _tagName = input.test ? null : "span";
    if (_tagName) out.w(`<${_tagName}>`);else out.bf("f_1", _component, 1);
    out.w("Blah");
    if (_tagName) out.w(`</${_tagName}>`);else out.ef();
    if (input.shouldShow) {
      const _tagName2 = input.test ? null : "span";
      if (_tagName2) out.w(`<${_tagName2}>`);else out.bf("f_2", _component, 1);
      out.w("Blah");
      if (_tagName2) out.w(`</${_tagName2}>`);else out.ef();
    }
    out.w("Blah");
    out.w("<span>");
    out.w("Blah");
    out.w("</span>");
  }
  out.w("</div>");
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);