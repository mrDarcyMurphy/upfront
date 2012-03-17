var _       = require('underscore'),
    fs      = require("fs"),
    express = require('express'),
    upfront = module.exports,
    app, views_path, rx;

upfront.version = '0.1.0';
upfront.config = {
  "ignore": [ ],
  "extensions": [ "html", "jade", "md" ]
};

upfront.setup = function(opts, done) {

  // SANITY CHECKS ------------------------------

  // Basics
  if (!done) { throw new Error("upfront given no callback"); }
  if (!opts) { throw new Error("upfront options unset."); }

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
  if (!app.settings.views) { throw new Error("no views path.");  }


  // CONFIG -----------------------------

    // [null || undefined] pass in nothing
      // check for 'upfront.json' in views folder
        // yes
          // - merge with defaults
          // * use that configuration
        // no
          // - use default configuration

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

  // ------------------------------------


  if ( !opts.config ) {
    console.log('no opts');
    try {
      fs.readFile(app.settings.views + '/upfront.json', 'utf8', function (err, data) {
        if (!err) {
          try {
            var cfg = JSON.parse(data);
            glom(cfg, done);
            return done(null, true);
          } catch(e) {
            // glom(cfg, done);
            return done(e);
          }
        }
        else {
          glom({}, done);
        }
      });
    } catch(e) {
      console.log('caught error', e);
      return done(e, true);
    }
  }
  else if ( typeof opts.config == "object" ) {
    console.log('opts is object');
    glom(opts.config);
    done(null, true);
    return;
  }
  else if ( typeof opts.config == "string" ) {
    console.log('opts is string');
    fs.readFile(opts.config, 'utf8', function (err, data) {
      if (!err) { glom(data); }
      done(null, true);
      return;
    });
  }

};

upfront.grab = function(done) {
  walk(upfront.config.views, function(err, results){
    app.set('templates', results);
    if (typeof done == 'function') {
      done(null, true);
    }
  });
};


var glom = function(config, done) {
  // console.log("GLOM!");
  upfront.config = _.extend(upfront.config, config);
  upfront.config.views = app.settings.views;
  // upfront.config.rx = new RegExp("^"+upfront.config.views+"\/(.*?)\.(html|md|utml)$");
  done(null, true);
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
