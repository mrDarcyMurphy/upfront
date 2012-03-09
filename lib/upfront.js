exports.version = '0.0.0';

var fs = require("fs");

var app, views_path;

module.exports = function(a) {
  app = a;
  views_path = app.settings.views;
  return module.exports;
};
