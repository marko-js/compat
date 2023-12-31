var expect = require("chai").expect;

exports.templateData = {
  short: "short",
};

exports.checkError = function (e) {
  expect(Array.isArray(e.errors)).to.equal(true);
  expect(e.errors.length).to.equal(1);

  var message = e.toString();
  expect(message).to.contain("template.marko:1:0");
  expect(message).to.contain("Invalid JavaScript variable name: short");
};

exports.fails = true;
