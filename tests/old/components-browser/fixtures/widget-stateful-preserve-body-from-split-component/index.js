module.exports = require("marko-widgets").defineRenderer({
  template: require.resolve("./template.marko"),
  getTemplateData: function () {
    return {
      buttonLabel: "Initial Button Label",
    };
  },
});
