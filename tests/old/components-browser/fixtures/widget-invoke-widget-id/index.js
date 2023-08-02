var barRenderer = require("./components/app-bar/renderer").render;

module.exports = require("marko-widgets").defineComponent({
  template: require("./template.marko"),
  getTemplateData: function () {
    return {
      barRenderer: barRenderer,
    };
  },
});
