module.exports = require("marko-widgets").defineComponent({
  template: require("./template.marko"),
  getInitialState: function (input) {
    return {
      name: input.name,
    };
  },
  getTemplateData: function (state) {
    return state;
  },
  setName: function (newName) {
    this.setState("name", newName);
  },
});
