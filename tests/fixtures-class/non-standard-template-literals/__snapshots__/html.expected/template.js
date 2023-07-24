import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
const fromStatic = "${STATIC}";
import { x as _marko_escapeXml } from "marko/src/runtime/html/helpers/escape-xml.js";
import _marko_props from "marko/src/runtime/html/helpers/data-marko.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  const fromScriptlet = "${SCRIPLET}";
  const a = 1;
  const b = 2;
  const c = 3;
  out.w("<div id=1 data-other=2></div>");
  out.w("<div id=a>");
  out.w("${STATIC}");
  out.w("</div>");
  out.w("<div id=b>");
  out.w("${SCRIPLET}");
  out.w("</div>");
  out.w("<div id=c>");
  out.w("1");
  out.w("</div>");
  out.w("<div id=d>");
  out.w("abc}");
  out.w("</div>");
  out.w("<div id=e>");
  out.w("abc}");
  out.w("</div>");
  out.w("<div id=f>");
  out.w("abc}");
  out.w("</div>");
  out.w("<div id=g>");
  out.w("abcd}ef");
  out.w("</div>");
  out.w("<div id=h>");
  out.w("abc3");
  out.w("</div>");
  out.w("<div id=i>");
  out.w(_marko_escapeXml(`abc${{
    x: 1
  }.missing ?? ""}def`));
  out.w("</div>");
  const handler = console.log;
  out.w(`<button${_marko_props(out, _componentDef, {
    "onclick": _componentDef.d("click", handler, false)
  })}></button>`);
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);