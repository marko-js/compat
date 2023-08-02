module.exports = require("marko-widgets").defineComponent({
  template: require.resolve("./template.marko"),
  getInitialState: function () {
    return { mounted: false };
  },
  init: function () {
    this.setState("mounted", true);
  },
});
