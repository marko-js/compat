module.exports = require("marko-widgets").defineComponent({
  template: require("./template.marko"),

  getInitialState: function (input) {
    return { interactive: input.interactive };
  },

  getTemplateData: function (state) {
    return {
      interactive: state.interactive,
    };
  },
});
