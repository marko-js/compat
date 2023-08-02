module.exports = require("marko-widgets").defineComponent({
  template: require.resolve("./template.marko"),

  getTemplateData: function () {
    return {};
  },

  init: function () {
    this.clicked = false;
  },

  handleButtonClick: function () {
    this.clicked = true;
  },
});
