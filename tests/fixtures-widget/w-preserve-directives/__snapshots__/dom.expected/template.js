import { t as _t } from "marko/src/runtime/vdom/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
import _preserve from "marko/src/core-tags/components/preserve-tag.js";
import _marko_tag from "marko/src/runtime/helpers/render-tag.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
import { r as _marko_registerComponent } from "marko/src/runtime/components/registry.js";
_marko_registerComponent(_marko_componentType, () => _marko_template);
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  _marko_tag(_preserve, {
    "n": true,
    "renderBody": out => {
      out.be("div", {
        "data-id": input.id
      }, "0", _component, null, 0);
      out.t(input.id, _component);
      out.ee();
    }
  }, out, _componentDef, "0");
  _marko_tag(_preserve, {
    "n": true,
    "i": true,
    "renderBody": out => {
      out.be("div", {
        "data-id": input.id
      }, "1", _component, null, 0);
      out.t(input.id, _component);
      out.ee();
    }
  }, out, _componentDef, "1");
  _marko_tag(_preserve, {
    "n": true,
    "i": false,
    "renderBody": out => {
      out.be("div", {
        "data-id": input.id
      }, "2", _component, null, 0);
      out.t(input.id, _component);
      out.ee();
    }
  }, out, _componentDef, "2");
  out.be("div", {
    "data-id": input.id
  }, "3", _component, null, 0);
  _marko_tag(_preserve, {
    "n": true,
    "b": true,
    "renderBody": out => {
      out.t(input.id, _component);
    }
  }, out, _componentDef, "3");
  out.ee();
  out.be("div", {
    "data-id": input.id
  }, "4", _component, null, 0);
  _marko_tag(_preserve, {
    "n": true,
    "b": true,
    "i": true,
    "renderBody": out => {
      out.t(input.id, _component);
    }
  }, out, _componentDef, "4");
  out.ee();
  out.be("div", {
    "data-id": input.id
  }, "5", _component, null, 0);
  _marko_tag(_preserve, {
    "n": true,
    "b": true,
    "i": false,
    "renderBody": out => {
      out.t(input.id, _component);
    }
  }, out, _componentDef, "5");
  out.ee();
  out.e("div", {
    "a": input.id,
    "b": input.id,
    "c": input.id
  }, "6", _component, 0, 0, {
    pa: {
      d: 1,
      a: 1,
      b: 1
    }
  });
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);
import _marko_defineComponent from "marko/src/runtime/components/defineComponent.js";
_marko_template.Component = _marko_defineComponent(_marko_component, _marko_template._);