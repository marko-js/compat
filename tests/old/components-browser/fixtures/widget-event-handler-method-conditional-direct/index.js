module.exports = require("marko-widgets").defineComponent({
  template: require.resolve("./template.marko"),

  getTemplateData: function () {
    return {};
  },

  init: function () {
    this.mouseMoved = false;
  },

  handleMouseMove: function () {
    this.mouseMoved = true;
  },
});
