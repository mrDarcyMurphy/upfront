var _       = require('underscore'),
    fs      = require("fs"),
    express = require('express'),
    upfront = module.exports,
    app, views_path, rx;

upfront.config = {};
upfront.version = '0.1.0';

upfront.setup = function(opts, done) {

  // SANITY CHECKS ------------------------------

  // Basics
  if (!done) { throw new Error("upfront was not given a callback"); }
  if (!opts) { throw new Error("upfront options are unset."); }

  // Check for a proper app instance
  if ( opts instanceof express.HTTPServer || opts instanceof express.HTTPSServer ) {
    app = opts;
  }
  else if ( opts.app instanceof express.HTTPServer || opts.app instanceof express.HTTPSServer ) {
    app = opts.app;
  }
  else {
    throw new Error("express app doesn't exist.");
  }

  // Check for views path
  if (!app.settings.views) { throw new Error("views path doesn't exist.");  }


  // CONFIG -----------------------------

    // [object] pass in options directly
      // - merge with defaults
      // * use that configuration

    // [string] pass in path to file
      // check for files' existence
        // yes
          // - merge with defaults
          // * use that configuration
        // no
          // - use default configuration

    // [null || undefined] pass in nothing
      // check for 'upfront.json' in views folder
        // yes
          // - merge with defaults
          // * use that configuration
        // no
          // - use default configuration

  // ------------------------------------

  var cfg = opts.config || app.settings.views + '/upfront.json';

  fs.readFile(cfg, 'utf8', function (err, data) {
    if (err) throw new Error(err);
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
