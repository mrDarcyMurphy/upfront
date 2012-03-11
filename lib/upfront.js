var _       = require('underscore'),
    fs      = require("fs"),
    upfront = module.exports,
    app, views_path, rx;

upfront.config = {};
upfront.version = '0.1.0';

upfront.setup = function(a, done) {
  app = a;

  // Sanity?
  if (!app) { done("app doesn't exist."); return; }
  if (!app.settings) { done("app.settings doesn't exist."); return; }
  if (!app.settings.views) { done("Views path doesn't exist."); return; }

  fs.readFile(app.settings.views + '/upfront.json', 'utf8', function (err, data) {
    if (err) throw err;
    upfront.config = JSON.parse(data);
    upfront.config.views = app.settings.views;
    upfront.config.rx = new RegExp("^"+upfront.config.views+"\/(.*?)\.(html|md|utml)$");
    done(null, true);
  });

}

upfront.grab = function(done) {
  walk(upfront.config.views, function(err, results){
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
          if ( file.match(upfront.config.rx) ){
            slug = file.match(upfront.config.rx)[1];
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
