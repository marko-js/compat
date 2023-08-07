var expect = require("chai").expect;

exports.templateData = {};

exports.checkError = function (err) {
  expect(err.toString()).to.contain(
    "The <unless> tag requires a condition argument",
  );
};
