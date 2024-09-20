import { t as _t } from "marko/src/runtime/vdom/index.js";
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
import _of_fallback from "marko/src/runtime/helpers/of-fallback.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
import { r as _marko_registerComponent } from "marko/src/runtime/components/registry.js";
_marko_registerComponent(_marko_componentType, () => _marko_template);
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  const colorsArray = ["red", "green", "blue"];
  const colorCodes = {
    red: "FF0000",
    green: "00FF00",
    blue: "0000FF"
  };
  const listSize = 3;
  out.be("div", {
    "class": "array"
  }, "0", _component, null, 1);
  {
    let _keyValue = 0;
    for (const color of _of_fallback(colorsArray || [])) {
      const _keyScope = `[${_keyValue++}]`;
      out.be("li", null, "1" + _keyScope, _component, null, 0);
      out.t(color, _component);
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "array-iterator"
  }, "2", _component, null, 1);
  {
    let _keyValue2 = 0;
    for (const color of _of_fallback((() => {
      const _result = [];
      evenItemsIterator(colorsArray || [], color => _result.push(color));
      return _result;
    })())) {
      const _keyScope2 = `[${_keyValue2++}]`;
      out.be("li", null, "3" + _keyScope2, _component, null, 0);
      out.t(color, _component);
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "array-separator"
  }, "4", _component, null, 1);
  {
    let _index10 = 0;
    for (const color of _of_fallback(colorsArray || [])) {
      let _index = _index10++;
      const _keyScope3 = `[${_index}]`;
      out.t(_index ? ", " : "", _component);
      out.be("li", null, "5" + _keyScope3, _component, null, 0);
      out.t(color, _component);
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "array-status-var"
  }, "6", _component, null, 1);
  {
    let _index11 = 0;
    const _all = colorsArray || [];
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
      out.t(color, _component);
      out.t(loop.getIndex() + 1, _component);
      out.t(") of ", _component);
      out.t(loop.getLength(), _component);
      if (loop.isFirst()) {
        out.be("div", null, "7" + _keyScope4, _component, null, 0, {
          "onclick": _componentDef.d("click", loop.getIndex() === 0 && "handleClick", false)
        });
        out.t(" - FIRST", _component);
        out.ee();
      }
      if (loop.isLast()) {
        out.t(" - LAST", _component);
      }
      if (!loop.isLast()) {
        out.t(" - NOT LAST", _component);
      }
    }
  }
  out.ee();
  out.be("div", {
    "class": "array-iterator-and-status-var"
  }, "8", _component, null, 1);
  {
    let _index12 = 0;
    for (const color of _of_fallback((() => {
      const _result2 = [];
      evenItemsIterator(colorsArray || [], color => _result2.push(color));
      return _result2;
    })())) {
      let _index3 = _index12++;
      const _keyScope5 = `[${_index3}]`;
      out.t(_index3 ? ", " : "", _component);
      out.be("li", null, "9" + _keyScope5, _component, null, 0);
      out.t(color, _component);
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "array-status-var-and-iterator"
  }, "10", _component, null, 1);
  {
    let _index13 = 0;
    const _all2 = (() => {
      const _result3 = [];
      evenItemsIterator(colorsArray || [], color => _result3.push(color));
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
      out.t(color, _component);
      out.t(loop.getIndex() + 1, _component);
      out.t(") of ", _component);
      out.t(loop.getLength(), _component);
      if (loop.isFirst()) {
        out.t(" - FIRST", _component);
      }
      if (loop.isLast()) {
        out.t(" - LAST", _component);
      }
    }
  }
  out.ee();
  out.be("div", {
    "class": "array-status-var-and-separator"
  }, "11", _component, null, 1);
  {
    let _index14 = 0;
    const _all3 = colorsArray || [];
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
      out.t(_index5 ? ", " : "", _component);
      out.t(color, _component);
      out.t(loop.getIndex() + 1, _component);
      out.t(") of ", _component);
      out.t(loop.getLength(), _component);
      if (loop.isFirst()) {
        out.t(" - FIRST", _component);
      }
      if (loop.isLast()) {
        out.t(" - LAST", _component);
      }
    }
  }
  out.ee();
  out.be("div", {
    "class": "array-status-var-and-iterator-and-separator"
  }, "12", _component, null, 1);
  {
    let _index15 = 0;
    const _all4 = (() => {
      const _result4 = [];
      evenItemsIterator(colorsArray || [], color => _result4.push(color));
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
      out.t(_index6 ? ", " : "", _component);
      out.t(color, _component);
      out.t(loop.getIndex() + 1, _component);
      out.t(") of ", _component);
      out.t(loop.getLength(), _component);
      if (loop.isFirst()) {
        out.t(" - FIRST", _component);
      }
      if (loop.isLast()) {
        out.t(" - LAST", _component);
      }
    }
  }
  out.ee();
  out.be("div", {
    "class": "props"
  }, "13", _component, null, 1);
  for (const color in colorCodes) {
    const code = colorCodes[color];
    const _keyScope6 = `[${color}]`;
    out.be("li", null, "14" + _keyScope6, _component, null, 0);
    out.t(color, _component);
    out.t(": #", _component);
    out.t(code, _component);
    out.ee();
  }
  out.ee();
  out.be("div", {
    "class": "props-separator"
  }, "15", _component, null, 1);
  {
    let _index16 = 0;
    for (const [color, code] of _of_fallback(Object.entries(colorCodes))) {
      let _index7 = _index16++;
      const _keyScope7 = `[${_index7}]`;
      out.t(_index7 ? ", " : "", _component);
      out.be("li", null, "16" + _keyScope7, _component, null, 0);
      out.t(color, _component);
      out.t(": #", _component);
      out.t(code, _component);
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "props-status-var"
  }, "17", _component, null, 1);
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
      out.be("li", null, "18" + _keyScope8, _component, null, 0);
      out.t(color, _component);
      out.t(": #", _component);
      out.t(code, _component);
      out.ee();
      out.t(loop.getIndex() + 1, _component);
      out.t(") of ", _component);
      out.t(loop.getLength(), _component);
      if (loop.isFirst()) {
        out.t(" - FIRST", _component);
      }
      if (loop.isLast()) {
        out.t(" - LAST", _component);
      }
    }
  }
  out.ee();
  out.be("div", {
    "class": "props-status-var-and-separator"
  }, "19", _component, null, 1);
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
      out.t(_index9 ? ", " : "", _component);
      out.be("li", null, "20" + _keyScope9, _component, null, 0);
      out.t(color, _component);
      out.t(": #", _component);
      out.t(code, _component);
      out.ee();
      out.t(loop.getIndex() + 1, _component);
      out.t(") of ", _component);
      out.t(loop.getLength(), _component);
      if (loop.isFirst()) {
        out.t(" - FIRST", _component);
      }
      if (loop.isLast()) {
        out.t(" - LAST", _component);
      }
    }
  }
  out.ee();
  out.be("div", {
    "class": "range"
  }, "21", _component, null, 1);
  for (let _steps = (10 - 0) / 1, _step = 0; _step <= _steps; _step++) {
    const i = 0 + _step * 1;
    const _keyScope10 = `[${i}]`;
    out.be("li", null, "22" + _keyScope10, _component, null, 0);
    out.t(i, _component);
    out.ee();
  }
  out.ee();
  out.be("div", {
    "class": "statement-basic-increment"
  }, "23", _component, null, 1);
  for (let _steps2 = (colorsArray.length - 1 - 0) / 1, _step2 = 0; _step2 <= _steps2; _step2++) {
    const i = 0 + _step2 * 1;
    out.t(i, _component);
  }
  out.ee();
  out.be("div", {
    "class": "statement-basic-increment-by-2"
  }, "24", _component, null, 1);
  for (let _steps3 = (listSize - 0) / 2, _step3 = 0; _step3 <= _steps3; _step3++) {
    const i = 0 + _step3 * 2;
    out.t(i, _component);
  }
  out.ee();
  out.be("div", {
    "class": "statement-missing-declaration"
  }, "25", _component, null, 1);
  {
    let i;
    for (let _steps4 = (listSize - 0) / 2, _step4 = 0; _step4 <= _steps4; _step4++) {
      const i = 0 + _step4 * 2;
      out.t(i, _component);
    }
  }
  out.ee();
  out.be("div", {
    "class": "statement-backwards-test"
  }, "26", _component, null, 1);
  var i = 0;
  while (colorsArray.length >= i) {
    out.t(i, _component);
    i++;
  }
  out.ee();
  out.be("div", {
    "class": "statement-iterate-backwards"
  }, "27", _component, null, 1);
  var i = colorsArray.length;
  while (i >= 0) {
    out.t(i, _component);
    i--;
  }
  out.ee();
  out.be("div", {
    "class": "statement-iterate-backwards-by-2"
  }, "28", _component, null, 1);
  var i = listSize;
  while (i > 0) {
    out.t(i, _component);
    i -= 2;
  }
  out.ee();
  out.be("div", {
    "class": "statement-multi-declaration"
  }, "29", _component, null, 1);
  var i = 0,
    x = 2;
  while (i < listSize) {
    out.t(i, _component);
    out.t(" ", _component);
    out.t(x, _component);
    i++;
  }
  out.ee();
  out.be("div", {
    "class": "statement-init-expression"
  }, "30", _component, null, 1);
  {
    let i = 0;
    noop();
    while (i < listSize) {
      out.t(i, _component);
      i++;
    }
  }
  out.ee();
  out.be("div", {
    "class": "statement-test-expression"
  }, "31", _component, null, 1);
  var i = 0;
  while (noop()) {
    out.t(i, _component);
    i++;
  }
  out.ee();
  out.be("div", {
    "class": "statement-update-expression"
  }, "32", _component, null, 1);
  var i = 0;
  while (i < listSize) {
    i++;
    out.t(i, _component);
    noop();
  }
  out.ee();
  out.be("div", {
    "class": "statement-update-only"
  }, "33", _component, null, 1);
  {
    let i = listSize;
    while (i--) {
      out.t(i, _component);
    }
  }
  out.ee();
}, {
  t: _marko_componentType,
  d: true
}, _marko_component);
import _marko_defineComponent from "marko/src/runtime/components/defineComponent.js";
_marko_template.Component = _marko_defineComponent(_marko_component, _marko_template._);