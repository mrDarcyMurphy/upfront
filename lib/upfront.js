var _               = require('underscore'),
    fs              = require("fs"),
    express         = require('express'),
    upfront         = module.exports,
    default_config  = {
      "ignore": [ ],
      "extensions": [ "html", "utml" ]
    },
    app, views_path, rx;

upfront.version = '0.1.0';
upfront.config  = {};

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
    try {
      fs.readFile(app.settings.views + '/upfront.json', 'utf8', function (err, data) {
        if (!err) {
          try {
            var cfg = JSON.parse(data);
            glom(cfg, done);
          } catch(e) {
            return done(e);
          }
        }
        else {
          glom({}, done);
        }
      });
    } catch(e) {
      return done(e, true);
    }
  }

  else if ( typeof opts.config == "object" ) {
    console.log('config is object');
    glom(opts.config, done);
  }

  else if ( typeof opts.config == "string" ) {
    // console.log('config is string');
    try {
      fs.readFile(opts.config, 'utf8', function (err, data) {
        if (err) {
          upfront.config = {};
          return done(err);
        }
        var cfg = JSON.parse(data);
        // console.log('cfg', typeof cfg, cfg);
        glom(data, done);
      });
    } catch(e) {
      // console.log('wtf?');
      return done(e, true);
    }
  }

};

var glom = function(config, done) {
  upfront.config = _.extend(default_config, config);
  upfront.config.views = app.settings.views;
  var reg = [ "^", upfront.config.views, "\/(.*?)\.(", upfront.config.extensions.join('|'), ")$" ];
  upfront.config.rx = new RegExp(reg.join(''));
  done(null, true);
};


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
