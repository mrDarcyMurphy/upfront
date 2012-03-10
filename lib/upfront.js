exports.version = '0.0.0';

var fs = require("fs"),
    upfront = module.exports;

var app, views_path;

upfront.setup = function(a, callback) {
  app = a;
  if ( ! app ) { callback("app doesn't exist."); return; }
  if ( ! app.settings ) { callback("app.settings doesn't exist."); return; }
  if ( ! app.settings.views ) { callback("Views path doesn't exist."); return; }
  views_path = app.settings.views;
  callback(null, true);
}
