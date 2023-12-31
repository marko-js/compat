module.exports = require("marko-widgets").defineComponent({
  template: require.resolve("./template.marko"),

  getInitialState: function (input) {
    return {
      name: input.name,
      messageCount: input.messageCount,
    };
  },

  getTemplateData: function (state) {
    return {
      name: state.name,
      messageCount: state.messageCount,
    };
  },

  setName: function (newName) {
    this.setState("name", newName);
  },
});
