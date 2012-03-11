var express = require('express'),
    assert  = require('assert'),
    should  = require('should');


describe('Setups', function(){

  describe('fails', function(){

    describe('because', function(){
      var upfront = require('../lib/upfront.js');
      it('no callback was given', function(){
        assert.throws(
          function(){
            upfront.setup();
          },
          'upfront was not given a callback'
        );
      });
    });

    describe('because', function(){

      var app, upfront;

      beforeEach(function(done){
        upfront = require('../lib/upfront.js');
        done();
      });

      it('app is undefined, when passed as part of an object', function(done){
        should.not.exist(app);
        upfront.setup({app:app}, function(err, result){
          should.exist(err);
          upfront.config.should.not.have.property('rx');
          upfront.config.should.not.have.property('views');
          done();
        });
      });
      it('app is undefined, when passed as lone argument', function(done){
        should.not.exist(app);
        upfront.setup(app, function(err, result){
          should.exist(err);
          upfront.config.should.not.have.property('rx');
          upfront.config.should.not.have.property('views');
          done();
        });
      });
    });

    describe('because', function(){

      var app, upfront;

      beforeEach(function(done){
        upfront = require('../lib/upfront.js');
        done();
      });

      it('view path is undefined, when passed as part of an object', function(done){
        var app     = express.createServer(),
            upfront = require('../lib/upfront.js');
        should.exist(app.settings);
        upfront.setup({app:app}, function(err, result){
          should.exist(err);
          done();
        });
      });
      it('view path is undefined, when app passed as lone argument', function(done){
        var app     = express.createServer(),
            upfront = require('../lib/upfront.js');
        should.exist(app.settings);
        upfront.setup({app:app}, function(err, result){
          should.exist(err);
          done();
        });
      });
    });
  });

  describe('Successful', function(){

    it('succeeds when passing app in directly', function(done){
      var app     = express.createServer(),
          upfront = require('../lib/upfront.js');
      app.configure(function(){
        app.set('views', __dirname + '/default_config');
      });
      should.exist(app.settings);
      should.exist(app.settings.views);
      upfront.setup(app, function(err, success){
        should.equal(false, true, 'need to check for opts.app');
        should.not.exist(err);
        should.exist(success);
        done();
      });
    });

    it('succeeds with no configuration', function(done){
      var app     = express.createServer(),
          upfront = require('../lib/upfront.js');
      app.configure(function(){
        app.set('views', __dirname + '/default_config');
      });
      should.exist(app.settings);
      should.exist(app.settings.views);
      upfront.setup({app:app}, function(err, success){
        should.not.exist(err);
        should.exist(success);
        done();
      });
    });

    it('succeeds with custom configuration in default file', function(done){
      var app     = express.createServer(),
          upfront = require('../lib/upfront.js');
      app.configure(function(){
        app.set('views', __dirname + '/custom_config');
      });
      should.exist(app.settings);
      should.exist(app.settings.views);
      upfront.setup({app:app}, function(err, success){
        should.not.exist(err);
        should.exist(success);
        done();
      });
    });

    it('succeeds with custom configuration options', function(done){
      var app     = express.createServer(),
          upfront = require('../lib/upfront.js');
      app.configure(function(){
        app.set('views', __dirname + '/custom_config');
      });
      should.exist(app.settings);
      should.exist(app.settings.views);
      upfront.setup({app:app}, function(err, success){
        should.equal(false, true, 'Need to write the custom configuration options');
        should.not.exist(err);
        should.exist(success);
        done();
      });
    });

    it('succeeds with custom configuration in a specified file', function(done){
      var app     = express.createServer(),
          upfront = require('../lib/upfront.js');
      app.configure(function(){
        app.set('views', __dirname + '/custom_config');
      });
      should.exist(app.settings);
      should.exist(app.settings.views);
      upfront.setup({app:app, config:app.settings.views+'/custom.json'}, function(err, success){
        should.equal(false, true, 'Need to write the custom configuration options');
        should.not.exist(err);
        should.exist(success);
        done();
      });
    });
  });
});



describe('Default Configuration', function(){
  var app, upfront = require('../lib/upfront.js');
  before(function(done){
    app = express.createServer();
    app.configure(function(){
      app.set('views', __dirname + '/views');
    });
    upfront.setup({app:app}, function(err, success){
      should.not.exist(err);
      should.exist(success);
      done();
    });
  });

  it('has a list of files to ignore', function(){
    assert(false, true);
    upfront.should.have.property('config');
    upfront.config.should.have.property('ignore').with.lengthOf(1);
  });

  it('has a list of extensions to support', function(){
    assert(false, true);
    upfront.should.have.property('config');
    upfront.config.should.have.property('extensions').with.lengthOf(4);
  });

});


describe('Default Template Compilation', function(){

  var app, upfront = require('../lib/upfront.js');

  before(function(done){
    app = express.createServer();
    app.configure(function(){
      app.set('views', __dirname + '/views');
    });
    upfront.setup({app:app}, function(err, success){
      should.not.exist(err);
      should.exist(success);
      upfront.grab(function(err, success){
        done();
      });
    });
  });

  it('ignores upfront.json', function(){
    should.not.exist(app.settings.templates.upfront);
  });

  it('loads views into app.settings.templates', function(){
    should.exist(app.settings.templates);
    should.exist(app.settings.templates['extension_md']);
    should.exist(app.settings.templates['extension_html']);
    should.exist(app.settings.templates['extension_utml']);
    should.exist(app.settings.templates['subone/nested']);
    should.exist(app.settings.templates['subone/subtwo/nested2']);
  });

  it('ignores unrecognized files', function(){
    should.not.exist(app.settings.templates['unrecognized']);
    should.not.exist(app.settings.templates['extension_ejs']);
  });

  it('ignores files listed in upfront.json', function(){
    should.not.exist(app.settings.templates.ignore_me);
  });

});


describe('Custom Configuration', function(){
  var app, upfront = require('../lib/upfront.js');
  before(function(done){
    app = express.createServer();
    app.configure(function(){
      app.set('views', __dirname + '/views');
    });
    upfront.setup({app:app}, function(err, success){
      should.not.exist(err);
      should.exist(success);
      done();
    });
  });

  it('has a list of files to ignore', function(){
    assert(false, true);
    upfront.should.have.property('config');
    upfront.config.should.have.property('ignore').with.lengthOf(1);
  });

  it('has a list of extensions to support', function(){
    assert(false, true);
    upfront.should.have.property('config');
    upfront.config.should.have.property('extensions').with.lengthOf(4);
  });

});


describe('Custom Template Compilation', function(){

  var app, upfront = require('../lib/upfront.js');

  before(function(done){
    app = express.createServer();
    app.configure(function(){
      app.set('views', __dirname + '/views');
    });
    upfront.setup({app:app}, function(err, success){
      should.not.exist(err);
      should.exist(success);
      upfront.grab(function(err, success){
        done();
      });
    });
  });

  it('ignores upfront.json', function(){
    should.not.exist(app.settings.templates.upfront);
  });

  it('loads views into app.settings.templates', function(){
    should.exist(app.settings.templates);
    should.exist(app.settings.templates['extension_md']);
    should.exist(app.settings.templates['extension_html']);
    should.exist(app.settings.templates['extension_utml']);
    should.exist(app.settings.templates['subone/nested']);
    should.exist(app.settings.templates['subone/subtwo/nested2']);
  });

  it('ignores unrecognized files', function(){
    should.not.exist(app.settings.templates['unrecognized']);
    should.not.exist(app.settings.templates['extension_ejs']);
  });

  it('ignores files listed in upfront.json', function(){
    should.not.exist(app.settings.templates.ignore_me);
  });

});

