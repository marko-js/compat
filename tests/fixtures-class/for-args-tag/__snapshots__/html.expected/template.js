import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
function noop() {}
function evenItemsIterator(items, cb) {
  for (let i = 0; i < items.length; i++) {
    if (i % 2 === 0) {
      cb(items[i]);
    }
  }
}
import { x as _marko_escapeXml } from "marko/src/runtime/html/helpers/escape-xml.js";
import _marko_props from "marko/src/runtime/html/helpers/data-marko.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  const colorsArray = ["red", "green", "blue"];
  const colorCodes = {
    red: "FF0000",
    green: "00FF00",
    blue: "0000FF"
  };
  const listSize = 3;
  out.w("<div class=array>");
  {
    let _keyValue = 0;
    for (const color of colorsArray) {
      const _keyScope = `[${_keyValue++}]`;
      out.w("<li>");
      out.w(_marko_escapeXml(color));
      out.w("</li>");
    }
  }
  out.w("</div>");
  out.w("<div class=array-iterator>");
  {
    let _keyValue2 = 0;
    for (const color of (() => {
      const _result = [];
      evenItemsIterator(colorsArray, _result.push.bind(_result));
      return _result;
    })()) {
      const _keyScope2 = `[${_keyValue2++}]`;
      out.w("<li>");
      out.w(_marko_escapeXml(color));
      out.w("</li>");
    }
  }
  out.w("</div>");
  out.w("<div class=array-separator>");
  {
    let _index10 = 0;
    for (const color of colorsArray) {
      let _index = _index10++;
      const _keyScope3 = `[${_index}]`;
      out.w(_marko_escapeXml(_index ? ", " : ""));
      out.w("<li>");
      out.w(_marko_escapeXml(color));
      out.w("</li>");
    }
  }
  out.w("</div>");
  out.w("<div class=array-status-var>");
  {
    let _index11 = 0;
    const _all = colorsArray;
    for (const color of _all) {
      let _index2 = _index11++;
      const _keyScope4 = `[${_index2}]`;
      const loop = {
        getIndex() {
          return _index2;
        },
        getLength() {
          return _all.length;
        },
        isFirst() {
          return _index2 === 0;
        },
        isLast() {
          return _index2 === _all.length - 1;
        }
      };
      out.w(_marko_escapeXml(color));
      out.w(_marko_escapeXml(loop.getIndex() + 1));
      out.w(") of ");
      out.w(_marko_escapeXml(loop.getLength()));
      if (loop.isFirst()) {
        out.w(`<div${_marko_props(out, _componentDef, {
          "onclick": _componentDef.d("click", loop.getIndex() === 0 && "handleClick", false)
        })}>`);
        out.w(" - FIRST");
        out.w("</div>");
      }
      if (loop.isLast()) {
        out.w(" - LAST");
      }
      if (!loop.isLast()) {
        out.w(" - NOT LAST");
      }
    }
  }
  out.w("</div>");
  out.w("<div class=array-iterator-and-status-var>");
  {
    let _index12 = 0;
    for (const color of (() => {
      const _result2 = [];
      evenItemsIterator(colorsArray, _result2.push.bind(_result2));
      return _result2;
    })()) {
      let _index3 = _index12++;
      const _keyScope5 = `[${_index3}]`;
      out.w(_marko_escapeXml(_index3 ? ", " : ""));
      out.w("<li>");
      out.w(_marko_escapeXml(color));
      out.w("</li>");
    }
  }
  out.w("</div>");
  out.w("<div class=array-status-var-and-iterator>");
  {
    let _index13 = 0;
    const _all2 = (() => {
      const _result3 = [];
      evenItemsIterator(colorsArray, _result3.push.bind(_result3));
      return _result3;
    })();
    for (const color of _all2) {
      let _index4 = _index13++;
      const loop = {
        getIndex() {
          return _index4;
        },
        getLength() {
          return _all2.length;
        },
        isFirst() {
          return _index4 === 0;
        },
        isLast() {
          return _index4 === _all2.length - 1;
        }
      };
      out.w(_marko_escapeXml(color));
      out.w(_marko_escapeXml(loop.getIndex() + 1));
      out.w(") of ");
      out.w(_marko_escapeXml(loop.getLength()));
      if (loop.isFirst()) {
        out.w(" - FIRST");
      }
      if (loop.isLast()) {
        out.w(" - LAST");
      }
    }
  }
  out.w("</div>");
  out.w("<div class=array-status-var-and-separator>");
  {
    let _index14 = 0;
    const _all3 = colorsArray;
    for (const color of _all3) {
      let _index5 = _index14++;
      const loop = {
        getIndex() {
          return _index5;
        },
        getLength() {
          return _all3.length;
        },
        isFirst() {
          return _index5 === 0;
        },
        isLast() {
          return _index5 === _all3.length - 1;
        }
      };
      out.w(_marko_escapeXml(_index5 ? ", " : ""));
      out.w(_marko_escapeXml(color));
      out.w(_marko_escapeXml(loop.getIndex() + 1));
      out.w(") of ");
      out.w(_marko_escapeXml(loop.getLength()));
      if (loop.isFirst()) {
        out.w(" - FIRST");
      }
      if (loop.isLast()) {
        out.w(" - LAST");
      }
    }
  }
  out.w("</div>");
  out.w("<div class=array-status-var-and-iterator-and-separator>");
  {
    let _index15 = 0;
    const _all4 = (() => {
      const _result4 = [];
      evenItemsIterator(colorsArray, _result4.push.bind(_result4));
      return _result4;
    })();
    for (const color of _all4) {
      let _index6 = _index15++;
      const loop = {
        getIndex() {
          return _index6;
        },
        getLength() {
          return _all4.length;
        },
        isFirst() {
          return _index6 === 0;
        },
        isLast() {
          return _index6 === _all4.length - 1;
        }
      };
      out.w(_marko_escapeXml(_index6 ? ", " : ""));
      out.w(_marko_escapeXml(color));
      out.w(_marko_escapeXml(loop.getIndex() + 1));
      out.w(") of ");
      out.w(_marko_escapeXml(loop.getLength()));
      if (loop.isFirst()) {
        out.w(" - FIRST");
      }
      if (loop.isLast()) {
        out.w(" - LAST");
      }
    }
  }
  out.w("</div>");
  out.w("<div class=props>");
  for (const color in colorCodes) {
    const code = colorCodes[color];
    const _keyScope6 = `[${color}]`;
    out.w("<li>");
    out.w(_marko_escapeXml(color));
    out.w(": #");
    out.w(_marko_escapeXml(code));
    out.w("</li>");
  }
  out.w("</div>");
  out.w("<div class=props-separator>");
  {
    let _index16 = 0;
    for (const [color, code] of Object.entries(colorCodes)) {
      let _index7 = _index16++;
      const _keyScope7 = `[${_index7}]`;
      out.w(_marko_escapeXml(_index7 ? ", " : ""));
      out.w("<li>");
      out.w(_marko_escapeXml(color));
      out.w(": #");
      out.w(_marko_escapeXml(code));
      out.w("</li>");
    }
  }
  out.w("</div>");
  out.w("<div class=props-status-var>");
  {
    let _index17 = 0;
    const _all5 = Object.entries(colorCodes);
    for (const [color, code] of _all5) {
      let _index8 = _index17++;
      const _keyScope8 = `[${_index8}]`;
      const loop = {
        getIndex() {
          return _index8;
        },
        getLength() {
          return _all5.length;
        },
        isFirst() {
          return _index8 === 0;
        },
        isLast() {
          return _index8 === _all5.length - 1;
        }
      };
      out.w("<li>");
      out.w(_marko_escapeXml(color));
      out.w(": #");
      out.w(_marko_escapeXml(code));
      out.w("</li>");
      out.w(_marko_escapeXml(loop.getIndex() + 1));
      out.w(") of ");
      out.w(_marko_escapeXml(loop.getLength()));
      if (loop.isFirst()) {
        out.w(" - FIRST");
      }
      if (loop.isLast()) {
        out.w(" - LAST");
      }
    }
  }
  out.w("</div>");
  out.w("<div class=props-status-var-and-separator>");
  {
    let _index18 = 0;
    const _all6 = Object.entries(colorCodes);
    for (const [color, code] of _all6) {
      let _index9 = _index18++;
      const _keyScope9 = `[${_index9}]`;
      const loop = {
        getIndex() {
          return _index9;
        },
        getLength() {
          return _all6.length;
        },
        isFirst() {
          return _index9 === 0;
        },
        isLast() {
          return _index9 === _all6.length - 1;
        }
      };
      out.w(_marko_escapeXml(_index9 ? ", " : ""));
      out.w("<li>");
      out.w(_marko_escapeXml(color));
      out.w(": #");
      out.w(_marko_escapeXml(code));
      out.w("</li>");
      out.w(_marko_escapeXml(loop.getIndex() + 1));
      out.w(") of ");
      out.w(_marko_escapeXml(loop.getLength()));
      if (loop.isFirst()) {
        out.w(" - FIRST");
      }
      if (loop.isLast()) {
        out.w(" - LAST");
      }
    }
  }
  out.w("</div>");
  out.w("<div class=range>");
  for (let _steps = (10 - 0) / 1, _step = 0; _step <= _steps; _step++) {
    const i = 0 + _step * 1;
    const _keyScope10 = `[${i}]`;
    out.w("<li>");
    out.w(_marko_escapeXml(i));
    out.w("</li>");
  }
  out.w("</div>");
  out.w("<div class=statement-basic-increment>");
  for (let _steps2 = (colorsArray.length - 1 - 0) / 1, _step2 = 0; _step2 <= _steps2; _step2++) {
    const i = 0 + _step2 * 1;
    out.w(_marko_escapeXml(i));
  }
  out.w("</div>");
  out.w("<div class=statement-basic-increment-by-2>");
  for (let _steps3 = (listSize - 0) / 2, _step3 = 0; _step3 <= _steps3; _step3++) {
    const i = 0 + _step3 * 2;
    out.w(_marko_escapeXml(i));
  }
  out.w("</div>");
  out.w("<div class=statement-missing-declaration>");
  {
    let i;
    for (let _steps4 = (listSize - 0) / 2, _step4 = 0; _step4 <= _steps4; _step4++) {
      const i = 0 + _step4 * 2;
      out.w(_marko_escapeXml(i));
    }
  }
  out.w("</div>");
  out.w("<div class=statement-backwards-test>");
  var i = 0;
  while (colorsArray.length >= i) {
    out.w(_marko_escapeXml(i));
    i++;
  }
  out.w("</div>");
  out.w("<div class=statement-iterate-backwards>");
  var i = colorsArray.length;
  while (i >= 0) {
    out.w(_marko_escapeXml(i));
    i--;
  }
  out.w("</div>");
  out.w("<div class=statement-iterate-backwards-by-2>");
  var i = listSize;
  while (i > 0) {
    out.w(_marko_escapeXml(i));
    i -= 2;
  }
  out.w("</div>");
  out.w("<div class=statement-multi-declaration>");
  var i = 0,
    x = 2;
  while (i < listSize) {
    out.w(_marko_escapeXml(i));
    out.w(" ");
    out.w("2");
    i++;
  }
  out.w("</div>");
  out.w("<div class=statement-init-expression>");
  {
    let i = 0;
    noop();
    while (i < listSize) {
      out.w(_marko_escapeXml(i));
      i++;
    }
  }
  out.w("</div>");
  out.w("<div class=statement-test-expression>");
  var i = 0;
  while (noop()) {
    out.w(_marko_escapeXml(i));
    i++;
  }
  out.w("</div>");
  out.w("<div class=statement-update-expression>");
  var i = 0;
  while (i < listSize) {
    i++;
    out.w(_marko_escapeXml(i));
    noop();
  }
  out.w("</div>");
  out.w("<div class=statement-update-only>");
  {
    let i = listSize;
    while (i--) {
      out.w(_marko_escapeXml(i));
    }
  }
  out.w("</div>");
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);