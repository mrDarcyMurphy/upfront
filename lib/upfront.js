var _               = require('underscore'),
    fs              = require("fs"),
    express         = require('express'),
    upfront         = module.exports,
    default_config  = {
      "ignore": [ ],
      "extensions": [ "html", "utml" ]
    },
    app, views_path, rx;

upfront.version = '0.2.0';
upfront.config  = {};

upfront.setup = function(opts, done) {

  // SANITY CHECKS

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


  // CONFIG

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

  else if ( typeof opts.config == "string" ) {
    try {
      fs.readFile(opts.config, 'utf8', function (err, data) {
        if (err) {
          upfront.config = {};
          return done(err);
        }
        var cfg = JSON.parse(data);
        glom(cfg, done);
      });
    } catch(e) {
      return done(e, true);
    }
  }

  else if ( typeof opts.config == "object" ) {
    glom(opts.config, done);
  }

};

// Gloms the config options together
var glom = function(config, done) {
  // Three step process necessary to ensure upfront.config does not persist,
  // and to ensure the default config doesn't get overwritten
  upfront.config = {};
  upfront.config = _.extend(upfront.config, default_config);
  upfront.config = _.extend(upfront.config, config);

  upfront.config.views = app.settings.views;
  var reg = [ "^", upfront.config.views, "\/(.*?)\.(", upfront.config.extensions.join('|'), ")$" ];
  upfront.config.rx = new RegExp(reg.join(''));
  done(null, true);
};


// Grabs the templates and saves them to app.settings.templates
upfront.compile = function(done) {
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
