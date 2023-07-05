import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
function cbTick(cb, value) {
  queueMicrotask(() => cb(null, value));
}
import { x as _marko_escapeXml } from "marko/src/runtime/html/helpers/escape-xml.js";
import _marko_self_iterator from "marko/src/runtime/helpers/self-iterator.js";
import _await from "marko/src/core-tags/core/await/renderer.js";
import _marko_tag from "marko/src/runtime/helpers/render-tag.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  _marko_tag(_await, {
    "timeout": 10000,
    "_provider": Promise.resolve("a"),
    "_name": "Promise.resolve(\"a\")",
    "then": {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      },
      [Symbol.iterator]: _marko_self_iterator
    }
  }, out, _componentDef, "0");
  _marko_tag(_await, {
    "_provider": Promise.resolve("b"),
    "_name": "Promise.resolve(\"b\")",
    "then": {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "placeholder": {
      "renderBody": out => {
        out.w("b placeholder");
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "catch": {
      "renderBody": out => {
        out.w("b error");
      },
      [Symbol.iterator]: _marko_self_iterator
    }
  }, out, _componentDef, "1");
  _marko_tag(_await, {
    "_provider": Promise.resolve("c"),
    "_name": "Promise.resolve(\"c\")",
    "then": {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "placeholder": {
      "renderBody": out => {
        out.w("c placeholder");
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "catch": {
      "renderBody": (out, err) => {
        if (err.name === "TimeoutError") {
          out.w("c timeout");
        } else {
          out.w("c error");
        }
      },
      [Symbol.iterator]: _marko_self_iterator
    }
  }, out, _componentDef, "2");
  _marko_tag(_await, {
    "_provider": Promise.resolve("d"),
    "_name": "Promise.resolve(\"d\")",
    "then": {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "placeholder": {
      "renderBody": out => {
        out.w("d placeholder");
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "catch": {
      "renderBody": (out, err) => {
        if (err.name === "TimeoutError") {
          out.w("d timeout");
        } else {
          out.w("d error");
        }
      },
      [Symbol.iterator]: _marko_self_iterator
    }
  }, out, _componentDef, "3");
  _marko_tag(_await, {
    "_provider": {
      x(cb) {
        cbTick(cb, "e");
      }
    }["x"],
    "_name": "{\n  x(cb) {\n    cbTick(cb, \"e\");\n  }\n}[\"x\"]",
    "then": {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "placeholder": {
      "renderBody": out => {
        out.w("e placeholder");
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "catch": {
      "renderBody": (out, err) => {
        if (err.name === "TimeoutError") {
          out.w("e timeout");
        } else {
          out.w("e error");
        }
      },
      [Symbol.iterator]: _marko_self_iterator
    }
  }, out, _componentDef, "4");
  _marko_tag(_await, {
    "_provider": {
      x(cb) {
        cbTick(cb, this);
      }
    }["x"].bind("f"),
    "_name": "{\n  x(cb) {\n    cbTick(cb, this);\n  }\n}[\"x\"].bind(\"f\")",
    "then": {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "placeholder": {
      "renderBody": out => {
        out.w("f placeholder");
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "catch": {
      "renderBody": (out, err) => {
        if (err.name === "TimeoutError") {
          out.w("f timeout");
        } else {
          out.w("f error");
        }
      },
      [Symbol.iterator]: _marko_self_iterator
    }
  }, out, _componentDef, "5");
  _marko_tag(_await, {
    "_provider": ((data, cb) => {
      cbTick(cb, data);
    }).bind(null, "g"),
    "_name": "((data, cb) => {\n  cbTick(cb, data);\n}).bind(null, \"g\")",
    "then": {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "placeholder": {
      "renderBody": out => {
        out.w("g placeholder");
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "catch": {
      "renderBody": (out, err) => {
        if (err.name === "TimeoutError") {
          out.w("g timeout");
        } else {
          out.w("g error");
        }
      },
      [Symbol.iterator]: _marko_self_iterator
    }
  }, out, _componentDef, "6");
  _marko_tag(_await, {
    "_provider": Promise.resolve("h"),
    "_name": "Promise.resolve(\"h\")",
    "then": {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "placeholder": {
      "renderBody": out => {
        out.w("h placeholder");
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "catch": {
      "renderBody": (out, err) => {
        if (err.name === "TimeoutError") {
          out.w("h timeout");
        }
      },
      [Symbol.iterator]: _marko_self_iterator
    }
  }, out, _componentDef, "7");
  _marko_tag(_await, {
    "_provider": ((data, cb) => {
      cbTick(cb, JSON.stringify(data));
    }).bind(null, {
      "a": "a",
      "b": "b"
    }),
    "_name": "((data, cb) => {\n  cbTick(cb, JSON.stringify(data));\n}).bind(null, {\n  \"a\": \"a\",\n  \"b\": \"b\"\n})",
    "then": {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "placeholder": {
      "renderBody": out => {
        out.w("g placeholder");
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "catch": {
      "renderBody": (out, err) => {
        if (err.name === "TimeoutError") {
          out.w("g timeout");
        } else {
          out.w("g error");
        }
      },
      [Symbol.iterator]: _marko_self_iterator
    }
  }, out, _componentDef, "8");
  _marko_tag(_await, {
    "_provider": ((data, cb) => {
      cbTick(cb, JSON.stringify(data));
    }).bind(null, {
      ...{
        a: "a"
      },
      "b": "b",
      "c": "c"
    }),
    "_name": "((data, cb) => {\n  cbTick(cb, JSON.stringify(data));\n}).bind(null, {\n  ...{\n    a: \"a\"\n  },\n  \"b\": \"b\",\n  \"c\": \"c\"\n})",
    "then": {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "placeholder": {
      "renderBody": out => {
        out.w("g placeholder");
      },
      [Symbol.iterator]: _marko_self_iterator
    },
    "catch": {
      "renderBody": (out, err) => {
        if (err.name === "TimeoutError") {
          out.w("g timeout");
        } else {
          out.w("g error");
        }
      },
      [Symbol.iterator]: _marko_self_iterator
    }
  }, out, _componentDef, "9");
  _marko_tag(_await, {
    "_provider": Promise.resolve("MODERN"),
    "_name": "Promise.resolve(\"MODERN\")",
    "then": {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      },
      [Symbol.iterator]: _marko_self_iterator
    }
  }, out, _componentDef, "10");
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);