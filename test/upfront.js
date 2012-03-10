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
    upfront.setup(app, function(err, succeeded){
      should.not.exist(err);
      should.exist(succeeded);
      done();
    });
  });

});
