module.exports = require("marko-widgets").defineComponent({
  template: require.resolve("./template.marko"),

  getTemplateData: function () {
    return {};
  },

  init: function () {
    this.fooClicked = false;
    this.barClicked = false;
  },

  handleFooClick: function () {
    this.fooClicked = true;
  },

  handleBarClick: function () {
    this.barClicked = true;
  },
});
