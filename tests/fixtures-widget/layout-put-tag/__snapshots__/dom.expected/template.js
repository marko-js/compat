import { t as _t } from "marko/src/runtime/vdom/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import { a as _marko_repeatable_attr_tag, i as _marko_render_input } from "marko/src/runtime/helpers/attr-tag.js";
import _test from "./components/test.marko";
import _marko_tag from "marko/src/runtime/helpers/render-tag.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
import { r as _marko_registerComponent } from "marko/src/runtime/components/registry.js";
_marko_registerComponent(_marko_componentType, () => _marko_template);
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  _marko_tag(_test, _marko_render_input(() => {
    _marko_repeatable_attr_tag("a", {
      "renderBody": out => {
        out.be("div", null, "1", _component, null, 0);
        out.t("1", _component);
        out.ee();
      }
    });
    _marko_repeatable_attr_tag("b", {
      "renderBody": out => {
        out.t("2", _component);
      }
    });
  }), out, _componentDef, "0");
  _marko_tag(_test, _marko_render_input(() => {
    _marko_repeatable_attr_tag("a", {
      "renderBody": out => {
        out.be("div", null, "3", _component, null, 0);
        out.t("1", _component);
        out.ee();
      }
    });
    _marko_repeatable_attr_tag("b", {
      "renderBody": out => {
        out.t("2", _component);
      }
    });
  }), out, _componentDef, "2");
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);
import _marko_defineComponent from "marko/src/runtime/components/defineComponent.js";
_marko_template.Component = _marko_defineComponent(_marko_component, _marko_template._);