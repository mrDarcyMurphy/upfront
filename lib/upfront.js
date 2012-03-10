exports.version = '0.0.0';

var _ = require('underscore'),
    fs = require("fs"),
    upfront = module.exports;

var app, views_path, rx;

upfront.config = {};

upfront.setup = function(a, done) {
  app = a;

  // Sanity?
  if ( ! app ) { done("app doesn't exist."); return; }
  if ( ! app.settings ) { done("app.settings doesn't exist."); return; }
  if ( ! app.settings.views ) { done("Views path doesn't exist."); return; }

  views_path = app.settings.views;
  rx = new RegExp("^"+views_path+"\/(.*?)\.(html|md|utml)$");

  fs.readFile(views_path + '/upfront.json', 'utf8', function (err, data) {
    if (err) throw err;
    upfront.config = JSON.parse(data);
    done(null, true);
  });

}

upfront.grab = function(done) {
  walk(views_path, function(err, results){
    app.set('templates', results);
    if (typeof done == 'function') {
      done(null, true);
    }
  });
};


// Walk -- What did you say?
var walk = function(dir, done) {
  var slug, results = {};
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = _.extend(results, res);
            if (!--pending) done(null, results);
          });
        } else {
          if ( file.match(rx) ){
            slug = file.match(rx)[1];
            if ( !!upfront.config.ignore.indexOf(slug) ) {
              results[slug] = fs.readFileSync(file, 'utf8');
            }
          }
          if (!--pending) done(null, results);
        }
      });
    });
  });
};
