var widgetLessRenderer = require("./components/app-widgetless/renderer");
var simpleRenderer = require("./components/app-simple").renderer;

module.exports = require("marko-widgets").defineComponent({
  template: require("./template.marko"),

  getTemplateData: function () {
    return {
      renderers: [widgetLessRenderer, widgetLessRenderer, simpleRenderer],
    };
  },
});
