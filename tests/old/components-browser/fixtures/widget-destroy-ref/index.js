module.exports = require("marko-widgets").defineComponent({
  template: require.resolve("./template.marko"),
  getInitialState: function () {
    return {};
  },
  getTemplateData: function () {
    return {};
  },

  destroyButton1: function () {
    this.getWidget("button1").destroy();
  },

  getButton1: function () {
    return this.getWidget("button1");
  },
});
