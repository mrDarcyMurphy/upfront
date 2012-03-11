var express = require('express'),
    assert = require('assert'),
    should = require('should');


describe('Botched Setup', function(){

  var app, upfront = require('../lib/upfront.js');

  it('fails gracefully when app is undefined', function(done){
    should.not.exist(app);
    upfront.setup({app:app}, function(err, result){
      should.exist(err);
      done();
    });
  });

  it('fails gracefully when view path is undefined', function(done){
    app = module.exports = express.createServer();
    should.exist(app.settings);
    upfront.setup({app:app}, function(err, result){
      should.exist(err);
      done();
    });
  });

});


describe('Successful Setup', function(){

  var app, upfront = require('../lib/upfront.js');

  before(function(done){
    app = module.exports = express.createServer();
    app.configure(function(){
      app.set('views', __dirname + '/views');
    });
    done();
  });

  it('succeeds when everything is setup right', function(done){
    should.exist(app.settings);
    should.exist(app.settings.views);
    upfront.setup({app:app}, function(err, success){
      should.not.exist(err);
      should.exist(success);
      done();
    });
  });

});

describe('Configuration', function(){
  var app, upfront = require('../lib/upfront.js');
  before(function(done){
    app = module.exports = express.createServer();
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
    upfront.should.have.property('config');
    upfront.config.should.have.property('ignore').with.lengthOf(1);
  });

  it('has a list of extensions to support', function(){
    upfront.should.have.property('config');
    upfront.config.should.have.property('extensions').with.lengthOf(4);
  });

});


describe('Template Compilation', function(){

  var app, upfront = require('../lib/upfront.js');

  before(function(done){
    app = module.exports = express.createServer();
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


describe('Custom Template Compilation', function(){

  var app, upfront = require('../lib/upfront.js');

  before(function(done){
    app = module.exports = express.createServer();
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

