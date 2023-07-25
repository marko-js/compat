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
import _marko_renderer from "marko/src/runtime/components/renderer.js";
import { r as _marko_registerComponent } from "marko/src/runtime/components/registry";
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
    for (const color of colorsArray || []) {
      const _keyScope = `[${_keyValue++}]`;
      out.be("div", null, "1" + _keyScope, _component, null, 0);
      out.be("li", null, "2" + _keyScope, _component, null, 0);
      out.t(color, _component);
      out.ee();
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "array-iterator"
  }, "3", _component, null, 1);
  {
    let _keyValue2 = 0;
    for (const color of (() => {
      const _result = [];
      evenItemsIterator(colorsArray || [], _result.push.bind(_result));
      return _result;
    })()) {
      const _keyScope2 = `[${_keyValue2++}]`;
      out.be("div", null, "4" + _keyScope2, _component, null, 0);
      out.be("li", null, "5" + _keyScope2, _component, null, 0);
      out.t(color, _component);
      out.ee();
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "array-separator"
  }, "6", _component, null, 1);
  {
    let _index10 = 0;
    for (const color of colorsArray || []) {
      let _index = _index10++;
      const _keyScope3 = `[${_index}]`;
      out.t(_index ? ", " : "", _component);
      out.be("div", null, "7" + _keyScope3, _component, null, 0);
      out.be("li", null, "8" + _keyScope3, _component, null, 0);
      out.t(color, _component);
      out.ee();
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "array-status-var"
  }, "9", _component, null, 1);
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
      out.be("div", null, "10" + _keyScope4, _component, null, 0);
      out.t(color, _component);
      out.t(loop.getIndex() + 1, _component);
      out.t(") of ", _component);
      out.t(loop.getLength(), _component);
      if (loop.isFirst()) {
        out.be("div", null, "11" + _keyScope4, _component, null, 0, {
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
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "array-iterator-and-status-var"
  }, "12", _component, null, 1);
  {
    let _index12 = 0;
    for (const color of (() => {
      const _result2 = [];
      evenItemsIterator(colorsArray || [], _result2.push.bind(_result2));
      return _result2;
    })()) {
      let _index3 = _index12++;
      const _keyScope5 = `[${_index3}]`;
      out.t(_index3 ? ", " : "", _component);
      out.be("div", null, "13" + _keyScope5, _component, null, 0);
      out.be("li", null, "14" + _keyScope5, _component, null, 0);
      out.t(color, _component);
      out.ee();
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "array-status-var-and-iterator"
  }, "15", _component, null, 1);
  {
    let _index13 = 0;
    const _all2 = (() => {
      const _result3 = [];
      evenItemsIterator(colorsArray || [], _result3.push.bind(_result3));
      return _result3;
    })();
    for (const color of _all2) {
      let _index4 = _index13++;
      const _keyScope6 = `[${_index4}]`;
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
      out.be("div", null, "16" + _keyScope6, _component, null, 0);
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
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "array-status-var-and-separator"
  }, "17", _component, null, 1);
  {
    let _index14 = 0;
    const _all3 = colorsArray || [];
    for (const color of _all3) {
      let _index5 = _index14++;
      const _keyScope7 = `[${_index5}]`;
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
      out.be("div", null, "18" + _keyScope7, _component, null, 0);
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
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "array-status-var-and-iterator-and-separator"
  }, "19", _component, null, 1);
  {
    let _index15 = 0;
    const _all4 = (() => {
      const _result4 = [];
      evenItemsIterator(colorsArray || [], _result4.push.bind(_result4));
      return _result4;
    })();
    for (const color of _all4) {
      let _index6 = _index15++;
      const _keyScope8 = `[${_index6}]`;
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
      out.be("div", null, "20" + _keyScope8, _component, null, 0);
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
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "props"
  }, "21", _component, null, 1);
  for (const color in colorCodes) {
    const code = colorCodes[color];
    const _keyScope9 = `[${color}]`;
    out.be("div", null, "22" + _keyScope9, _component, null, 0);
    out.be("li", null, "23" + _keyScope9, _component, null, 0);
    out.t(color, _component);
    out.t(": #", _component);
    out.t(code, _component);
    out.ee();
    out.ee();
  }
  out.ee();
  out.be("div", {
    "class": "props-separator"
  }, "24", _component, null, 1);
  {
    let _index16 = 0;
    for (const [color, code] of Object.entries(colorCodes)) {
      let _index7 = _index16++;
      const _keyScope10 = `[${_index7}]`;
      out.t(_index7 ? ", " : "", _component);
      out.be("div", null, "25" + _keyScope10, _component, null, 0);
      out.be("li", null, "26" + _keyScope10, _component, null, 0);
      out.t(color, _component);
      out.t(": #", _component);
      out.t(code, _component);
      out.ee();
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "props-status-var"
  }, "27", _component, null, 1);
  {
    let _index17 = 0;
    const _all5 = Object.entries(colorCodes);
    for (const [color, code] of _all5) {
      let _index8 = _index17++;
      const _keyScope11 = `[${_index8}]`;
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
      out.be("div", null, "28" + _keyScope11, _component, null, 0);
      out.be("li", null, "29" + _keyScope11, _component, null, 0);
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
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "props-status-var-and-separator"
  }, "30", _component, null, 1);
  {
    let _index18 = 0;
    const _all6 = Object.entries(colorCodes);
    for (const [color, code] of _all6) {
      let _index9 = _index18++;
      const _keyScope12 = `[${_index9}]`;
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
      out.be("div", null, "31" + _keyScope12, _component, null, 0);
      out.be("li", null, "32" + _keyScope12, _component, null, 0);
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
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "range"
  }, "33", _component, null, 1);
  for (let _steps = (10 - 0) / 1, _step = 0; _step <= _steps; _step++) {
    const i = 0 + _step * 1;
    const _keyScope13 = `[${i}]`;
    out.be("div", null, "34" + _keyScope13, _component, null, 0);
    out.be("li", null, "35" + _keyScope13, _component, null, 0);
    out.t(i, _component);
    out.ee();
    out.ee();
  }
  out.ee();
  out.be("div", {
    "class": "statement-basic-increment"
  }, "36", _component, null, 1);
  for (let _steps2 = (colorsArray.length - 1 - 0) / 1, _step2 = 0; _step2 <= _steps2; _step2++) {
    const i = 0 + _step2 * 1;
    const _keyScope14 = `[${i}]`;
    out.be("div", null, "37" + _keyScope14, _component, null, 0);
    out.t(i, _component);
    out.ee();
  }
  out.ee();
  out.be("div", {
    "class": "statement-basic-increment-by-2"
  }, "38", _component, null, 1);
  for (let _steps3 = (listSize - 0) / 2, _step3 = 0; _step3 <= _steps3; _step3++) {
    const i = 0 + _step3 * 2;
    const _keyScope15 = `[${i}]`;
    out.be("div", null, "39" + _keyScope15, _component, null, 0);
    out.t(i, _component);
    out.ee();
  }
  out.ee();
  out.be("div", {
    "class": "statement-missing-declaration"
  }, "40", _component, null, 1);
  {
    let i;
    for (let _steps4 = (listSize - 0) / 2, _step4 = 0; _step4 <= _steps4; _step4++) {
      const i = 0 + _step4 * 2;
      const _keyScope16 = `[${i}]`;
      out.be("div", null, "41" + _keyScope16, _component, null, 0);
      out.t(i, _component);
      out.ee();
    }
  }
  out.ee();
  out.be("div", {
    "class": "statement-backwards-test"
  }, "42", _component, null, 1);
  {
    var i = 0;
    let _keyValue3 = 0;
    while (colorsArray.length >= i) {
      const _keyScope17 = `[${_keyValue3++}]`;
      out.be("div", null, "43" + _keyScope17, _component, null, 0);
      out.t(i, _component);
      out.ee();
      i++;
    }
  }
  out.ee();
  out.be("div", {
    "class": "statement-iterate-backwards"
  }, "44", _component, null, 1);
  {
    var i = colorsArray.length;
    let _keyValue4 = 0;
    while (i >= 0) {
      const _keyScope18 = `[${_keyValue4++}]`;
      out.be("div", null, "45" + _keyScope18, _component, null, 0);
      out.t(i, _component);
      out.ee();
      i--;
    }
  }
  out.ee();
  out.be("div", {
    "class": "statement-iterate-backwards-by-2"
  }, "46", _component, null, 1);
  {
    var i = listSize;
    let _keyValue5 = 0;
    while (i > 0) {
      const _keyScope19 = `[${_keyValue5++}]`;
      out.be("div", null, "47" + _keyScope19, _component, null, 0);
      out.t(i, _component);
      out.ee();
      i -= 2;
    }
  }
  out.ee();
  out.be("div", {
    "class": "statement-multi-declaration"
  }, "48", _component, null, 1);
  {
    var i = 0,
      x = 2;
    let _keyValue6 = 0;
    while (i < listSize) {
      const _keyScope20 = `[${_keyValue6++}]`;
      out.be("div", null, "49" + _keyScope20, _component, null, 0);
      out.t(i, _component);
      out.t(" ", _component);
      out.t(x, _component);
      out.ee();
      i++;
    }
  }
  out.ee();
  out.be("div", {
    "class": "statement-init-expression"
  }, "50", _component, null, 1);
  {
    let i = 0;
    noop();
    let _keyValue7 = 0;
    while (i < listSize) {
      const _keyScope21 = `[${_keyValue7++}]`;
      out.be("div", null, "51" + _keyScope21, _component, null, 0);
      out.t(i, _component);
      out.ee();
      i++;
    }
  }
  out.ee();
  out.be("div", {
    "class": "statement-test-expression"
  }, "52", _component, null, 1);
  {
    var i = 0;
    let _keyValue8 = 0;
    while (noop()) {
      const _keyScope22 = `[${_keyValue8++}]`;
      out.be("div", null, "53" + _keyScope22, _component, null, 0);
      out.t(i, _component);
      out.ee();
      i++;
    }
  }
  out.ee();
  out.be("div", {
    "class": "statement-update-expression"
  }, "54", _component, null, 1);
  {
    var i = 0;
    let _keyValue9 = 0;
    while (i < listSize) {
      const _keyScope23 = `[${_keyValue9++}]`;
      out.be("div", null, "55" + _keyScope23, _component, null, 0);
      i++;
      out.t(i, _component);
      out.ee();
      noop();
    }
  }
  out.ee();
  out.be("div", {
    "class": "statement-update-only"
  }, "56", _component, null, 1);
  {
    let i = listSize;
    let _keyValue10 = 0;
    while (i--) {
      const _keyScope24 = `[${_keyValue10++}]`;
      out.be("div", null, "57" + _keyScope24, _component, null, 0);
      out.t(i, _component);
      out.ee();
    }
  }
  out.ee();
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);
import _marko_defineComponent from "marko/src/runtime/components/defineComponent.js";
_marko_template.Component = _marko_defineComponent(_marko_component, _marko_template._);