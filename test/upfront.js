var express = require('express'),
    assert = require('assert'),
    should = require('should'),
    upfront = require('../lib/upfront.js');


describe('Botched Setup', function(){

  var app;

  it('fails gracefully when app is undefined', function(done){
    should.not.exist(app);
    upfront.setup(app, function(err, result){
      should.exist(err);
      done();
    });
  });

  it('fails gracefully when view path is undefined', function(done){
    app = module.exports = express.createServer();
    should.exist(app.settings);
    upfront.setup(app, function(err, result){
      should.exist(err);
      done();
    });
  });

});


describe('Successful Setup', function(){

  var app;

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
    upfront.setup(app, function(err, success){
      should.not.exist(err);
      should.exist(success);
      done();
    });
  });

});


describe('Template Compilation', function(){

  var app;

  before(function(done){
    app = module.exports = express.createServer();
    app.configure(function(){
      app.set('views', __dirname + '/views');
    });
    upfront.setup(app, function(err, success){
      should.not.exist(err);
      should.exist(success);
      done();
    });
  });

  it('walks the view tree and loads views into app.settings.templates', function(done){
    upfront.grab(function(err, success){
      should.not.exist(err);
      should.exist(success);
      should.exist(app.settings.templates);
      should.exist(app.settings.templates.md);
      should.exist(app.settings.templates.html);
      should.exist(app.settings.templates.utml);
      should.exist(app.settings.templates['subone/nested']);
      should.exist(app.settings.templates['subone/subtwo/nested2']);
      should.not.exist(app.settings.templates.unrecognized);
      done();
    });
  });

});
