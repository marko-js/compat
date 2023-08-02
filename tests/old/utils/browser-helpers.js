var assert = require("assert");
var expect = require("chai").expect;
var markoComponents = require("marko/components");

function BrowserHelpers() {
  this.logOutput = [];
  this.rendered = [];
  this.instances = [];
}

BrowserHelpers.prototype = {
  triggerEvent: function (el, type) {
    var ev = document.createEvent("Event");
    ev.initEvent(type, true, true);
    el.dispatchEvent(ev);
  },

  triggerCustomEvent: function (el, type, detail) {
    var ev = new CustomEvent(type, { detail: detail });
    el.dispatchEvent(ev);
  },

  triggerMouseEvent: function (el, type) {
    el.dispatchEvent(
      new MouseEvent(type, {
        view: window,
        bubbles: true,
        cancelable: true,
      }),
    );
  },

  triggerClick: function (el) {
    this.triggerMouseEvent(el, "click");
  },

  triggerMouseMove: function (el) {
    this.triggerMouseEvent(el, "mousemove");
  },

  mount: function (rendererPath, input) {
    var $global = input && input.$global;
    var renderer = require(rendererPath);
    renderer = renderer.default || renderer;
    var renderResult = renderer.renderSync(input).appendTo(this.targetEl);
    var instance;

    try {
      instance = renderResult.getComponent();
    } catch (e) {
      if (e.toString().indexOf("No component") === -1) {
        throw e;
      }
    }

    if (instance) {
      this.instances.push(instance);
    }

    var finalRendererPath = this.cleanPath(rendererPath);
    var finalTemplatePath = finalRendererPath.replace(
      /\/index\.js$/,
      "/template.marko",
    );

    this.rendered.push({
      renderer: finalRendererPath,
      template: finalTemplatePath,
      input: input,
      $global: $global,
    });

    return instance;
  },

  log: function (data) {
    this.logOutput.push(data);
  },

  getComponentForEl: function (el) {
    return markoComponents.getComponentForEl(el);
  },

  get targetEl() {
    return document.getElementById("testsTarget");
  },

  nodeListToArray: function (nodes) {
    var nodeArray = new Array(nodes.length);
    for (var i = 0; i < nodes.length; i++) {
      nodeArray[i] = nodes[i];
    }
    return nodeArray;
  },

  checkChildrenMatch: function (children1, children2) {
    expect(children1.length).to.equal(children2.length);

    for (var i = 0; i < children1.length; i++) {
      var child1 = children1[i];
      var child2 = children2[i];
      assert.ok(
        child1 === child2,
        "Children at index " +
          i +
          " do not match. child 1: " +
          child1 +
          " child 2: " +
          child2,
      );
    }
  },

  cleanPath: function (path) {
    return path.replace(/\.\d+\.in-context$/, "");
  },
};

module.exports = BrowserHelpers;
