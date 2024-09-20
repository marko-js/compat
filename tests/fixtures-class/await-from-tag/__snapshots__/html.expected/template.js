import { t as _t } from "marko/src/runtime/html/index.js";
const _marko_componentType = "<fixture-dir>/template.marko",
  _marko_template = _t(_marko_componentType);
export default _marko_template;
function cbTick(cb, value) {
  queueMicrotask(() => cb(null, value));
}
import { x as _marko_escapeXml } from "marko/src/runtime/html/helpers/escape-xml.js";
import { a as _marko_repeatable_attr_tag, i as _marko_render_input } from "marko/src/runtime/helpers/attr-tag.js";
import _await from "marko/src/core-tags/core/await/renderer.js";
import _marko_tag from "marko/src/runtime/helpers/render-tag.js";
import _marko_renderer from "marko/src/runtime/components/renderer.js";
const _marko_component = {};
_marko_template._ = _marko_renderer(function (input, out, _componentDef, _component, state, $global) {
  _marko_tag(_await, _marko_render_input(() => {
    _marko_repeatable_attr_tag("then", {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      }
    });
  }, {
    "timeout": 10000,
    "_provider": Promise.resolve("a"),
    "_name": "Promise.resolve(\"a\")"
  }), out, _componentDef, "0");
  _marko_tag(_await, _marko_render_input(() => {
    _marko_repeatable_attr_tag("then", {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      }
    });
    _marko_repeatable_attr_tag("placeholder", {
      "renderBody": out => {
        out.w("b placeholder");
      }
    });
    _marko_repeatable_attr_tag("catch", {
      "renderBody": out => {
        out.w("b error");
      }
    });
  }, {
    "_provider": Promise.resolve("b"),
    "_name": "Promise.resolve(\"b\")"
  }), out, _componentDef, "1");
  _marko_tag(_await, _marko_render_input(() => {
    _marko_repeatable_attr_tag("then", {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      }
    });
    _marko_repeatable_attr_tag("placeholder", {
      "renderBody": out => {
        out.w("c placeholder");
      }
    });
    _marko_repeatable_attr_tag("catch", {
      "renderBody": (out, err) => {
        if (err.name === "TimeoutError") {
          out.w("c timeout");
        } else {
          out.w("c error");
        }
      }
    });
  }, {
    "_provider": Promise.resolve("c"),
    "_name": "Promise.resolve(\"c\")"
  }), out, _componentDef, "2");
  _marko_tag(_await, _marko_render_input(() => {
    _marko_repeatable_attr_tag("then", {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      }
    });
    _marko_repeatable_attr_tag("placeholder", {
      "renderBody": out => {
        out.w("d placeholder");
      }
    });
    _marko_repeatable_attr_tag("catch", {
      "renderBody": (out, err) => {
        if (err.name === "TimeoutError") {
          out.w("d timeout");
        } else {
          out.w("d error");
        }
      }
    });
  }, {
    "_provider": Promise.resolve("d"),
    "_name": "Promise.resolve(\"d\")"
  }), out, _componentDef, "3");
  _marko_tag(_await, _marko_render_input(() => {
    _marko_repeatable_attr_tag("then", {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      }
    });
    _marko_repeatable_attr_tag("placeholder", {
      "renderBody": out => {
        out.w("e placeholder");
      }
    });
    _marko_repeatable_attr_tag("catch", {
      "renderBody": (out, err) => {
        if (err.name === "TimeoutError") {
          out.w("e timeout");
        } else {
          out.w("e error");
        }
      }
    });
  }, {
    "_provider": {
      x(cb) {
        cbTick(cb, "e");
      }
    }["x"],
    "_name": "{\n  x(cb) {\n    cbTick(cb, \"e\");\n  }\n}[\"x\"]"
  }), out, _componentDef, "4");
  _marko_tag(_await, _marko_render_input(() => {
    _marko_repeatable_attr_tag("then", {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      }
    });
    _marko_repeatable_attr_tag("placeholder", {
      "renderBody": out => {
        out.w("f placeholder");
      }
    });
    _marko_repeatable_attr_tag("catch", {
      "renderBody": (out, err) => {
        if (err.name === "TimeoutError") {
          out.w("f timeout");
        } else {
          out.w("f error");
        }
      }
    });
  }, {
    "_provider": {
      x(cb) {
        cbTick(cb, this);
      }
    }["x"].bind("f"),
    "_name": "{\n  x(cb) {\n    cbTick(cb, this);\n  }\n}[\"x\"].bind(\"f\")"
  }), out, _componentDef, "5");
  _marko_tag(_await, _marko_render_input(() => {
    _marko_repeatable_attr_tag("then", {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      }
    });
    _marko_repeatable_attr_tag("placeholder", {
      "renderBody": out => {
        out.w("g placeholder");
      }
    });
    _marko_repeatable_attr_tag("catch", {
      "renderBody": (out, err) => {
        if (err.name === "TimeoutError") {
          out.w("g timeout");
        } else {
          out.w("g error");
        }
      }
    });
  }, {
    "_provider": ((data, cb) => {
      cbTick(cb, data);
    }).bind(null, "g"),
    "_name": "((data, cb) => {\n  cbTick(cb, data);\n}).bind(null, \"g\")"
  }), out, _componentDef, "6");
  _marko_tag(_await, _marko_render_input(() => {
    _marko_repeatable_attr_tag("then", {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      }
    });
    _marko_repeatable_attr_tag("placeholder", {
      "renderBody": out => {
        out.w("h placeholder");
      }
    });
    _marko_repeatable_attr_tag("catch", {
      "renderBody": (out, err) => {
        if (err.name === "TimeoutError") {
          out.w("h timeout");
        }
      }
    });
  }, {
    "_provider": Promise.resolve("h"),
    "_name": "Promise.resolve(\"h\")"
  }), out, _componentDef, "7");
  _marko_tag(_await, _marko_render_input(() => {
    _marko_repeatable_attr_tag("then", {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      }
    });
    _marko_repeatable_attr_tag("placeholder", {
      "renderBody": out => {
        out.w("g placeholder");
      }
    });
    _marko_repeatable_attr_tag("catch", {
      "renderBody": (out, err) => {
        if (err.name === "TimeoutError") {
          out.w("g timeout");
        } else {
          out.w("g error");
        }
      }
    });
  }, {
    "_provider": ((data, cb) => {
      cbTick(cb, JSON.stringify(data));
    }).bind(null, {
      "a": "a",
      "b": "b"
    }),
    "_name": "((data, cb) => {\n  cbTick(cb, JSON.stringify(data));\n}).bind(null, {\n  \"a\": \"a\",\n  \"b\": \"b\"\n})"
  }), out, _componentDef, "8");
  _marko_tag(_await, _marko_render_input(() => {
    _marko_repeatable_attr_tag("then", {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      }
    });
    _marko_repeatable_attr_tag("placeholder", {
      "renderBody": out => {
        out.w("g placeholder");
      }
    });
    _marko_repeatable_attr_tag("catch", {
      "renderBody": (out, err) => {
        if (err.name === "TimeoutError") {
          out.w("g timeout");
        } else {
          out.w("g error");
        }
      }
    });
  }, {
    "_provider": ((data, cb) => {
      cbTick(cb, JSON.stringify(data));
    }).bind(null, {
      ...{
        a: "a"
      },
      "b": "b",
      "c": "c"
    }),
    "_name": "((data, cb) => {\n  cbTick(cb, JSON.stringify(data));\n}).bind(null, {\n  ...{\n    a: \"a\"\n  },\n  \"b\": \"b\",\n  \"c\": \"c\"\n})"
  }), out, _componentDef, "9");
  _marko_tag(_await, _marko_render_input(() => {
    _marko_repeatable_attr_tag("then", {
      "renderBody": (out, value) => {
        out.w(_marko_escapeXml(value));
      }
    });
  }, {
    "_provider": Promise.resolve("MODERN"),
    "_name": "Promise.resolve(\"MODERN\")"
  }), out, _componentDef, "10");
}, {
  t: _marko_componentType,
  i: true,
  d: true
}, _marko_component);