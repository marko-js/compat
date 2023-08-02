module.exports = require("marko-widgets").defineComponent({
  template: require("./template.marko"),
  handleColorClick: function (event, el) {
    this.color = el.getAttribute("data-color");
  },
});
