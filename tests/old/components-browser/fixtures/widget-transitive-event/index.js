module.exports = require("marko-widgets").defineComponent({
  template: require("./template.marko"),
  handleTransitive: function () {
    window.transitiveHandled = true;
  },
});
