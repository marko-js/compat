module.exports = require("marko-widgets").defineComponent({
  template: require("./template.marko"),
  getInitialState: function (input) {
    return {
      version: input.version,
    };
  },
  getTemplateData: function (state) {
    return {
      version: state.version,
    };
  },
  init: function () {
    window.rerenderInitOrder = window.rerenderInitOrder || [];
    window.rerenderInitOrder.push("parent");
  },
  onUpdate: function () {
    window.rerenderInitOrder.push("parent");
  },
});
