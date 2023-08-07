exports.templateData = {
  header: {
    renderBody: function (out) {
      out.write("Header content!");
    },
  },
};

exports.fails = true;
