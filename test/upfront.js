var express = require('express'),
    assert  = require('assert'),
    should  = require('should');


describe('SETUP', function(){

  describe('Fails', function(){

    describe('when no callback is given', function(){
      var upfront = require('../lib/upfront.js');
      it('throws an error', function(){
        assert.throws(
          function(){
            upfront.setup();
          },
          /upfront given no callback/
        );
      });
    });

    describe('when app is undefined', function(){
      var app, upfront;
      beforeEach(function(done){
        upfront = require('../lib/upfront.js');
        should.not.exist(app);
        done();
      });
      it('throws an error when sent as a lone object', function(){
        assert.throws(
          function(){
            upfront.setup(app, function(){});
          },
          /upfront options unset./
        );
      });
      it('throws an error when sent as an attribute of an object', function(){
        assert.throws(
          function(){
            upfront.setup({app:app}, function(){});
          },
          /express app doesn't exist./
        );
      });
    });

    describe('when view path is undefined', function(){
      var app, upfront;
      beforeEach(function(done){
        app     = express.createServer();
        upfront = require('../lib/upfront.js');
        should.exist(app.settings);
        should.not.exist(app.settings.views);
        done();
      });
      it('throws an error when app passed as lone object', function(){
        assert.throws(
          function(){
            upfront.setup(app, function(){});
          },
          /no views path./
        );
      });
      it('throws an error when app sent as an attribute of an object', function(){
        assert.throws(
          function(){
            upfront.setup({app:app}, function(){});
          },
          /no views path./
        );
      });
    });

    describe('when upfront.json is corrupted', function(){
      var app, upfront;
      beforeEach(function(done){
        app     = express.createServer();
        app.set('views', __dirname + '/broken_config');
        upfront = require('../lib/upfront.js');
        should.exist(app.settings);
        should.exist(app.settings.views);
        done();
      });
      it('returns an error when parsing the file', function(done){
        upfront.setup(app, function(error, success){
          should.exist(error);
          should.not.exist(success);
          done();
        });
      });
    });

    describe("when custom config file doesn't exist", function(){
      var app, upfront;
      beforeEach(function(done){
        app     = express.createServer();
        app.set('views', __dirname + '/broken_config');
        upfront = require('../lib/upfront.js');
        should.exist(app.settings);
        should.exist(app.settings.views);
        done();
      });
      it('returns an error when parsing the file', function(done){
        upfront.setup({app:app, config:"not_there.json"}, function(error, success){
          should.exist(error);
          should.not.exist(success);
          done();
        });
      });
      it('resets config to empty object', function(done){
        upfront.setup({app:app, config:"not_there.json"}, function(error, success){
          should.exist(error);
          should.not.exist(success);
          should.deepEqual(upfront.config, {});
          done();
        });
      });

    });

  });

  // -------------------------

  describe('Default Configuration', function(){
    describe('Succeeds', function(){
      describe('when passing app', function(done){
        var app, upfront;
        beforeEach(function(done){
          upfront = undefined;
          upfront = require('../lib/upfront.js');
          app     = express.createServer();
          app.set('views', __dirname + '/default_config');
          should.exist(app.settings);
          should.exist(app.settings.views);
          done();
        });
        it('returns without error', function(done){
          upfront.setup(app, function(err, success){
            should.not.exist(err);
            should.exist(success);
            done();
          });
        });
        it('creates config', function(done){
          upfront.setup(app, function(err, success){
            should.exist(upfront.config);
            upfront.config.should.have.property('views');
            upfront.config.should.have.property('rx');
            upfront.config.should.have.property('extensions');
            upfront.config.should.have.property('ignore');
            done();
          });
        });
        it('upfront.views matches app.settings.views', function(done){
          upfront.setup(app, function(err, success){
            assert.equal(upfront.config.views, app.settings.views);
            done();
          });
        });
        it('creates a properly formed regex', function(done){
          upfront.setup(app, function(err, success){
            upfront.config.rx.should.be.an.instanceof(RegExp);
            var rx = ["/^" + __dirname + "/default_config/(.*?).(html|utml)$/"].join('');
            should.equal(rx, upfront.config.rx);
            done();
          });
        });
        it('ignores nothing', function(done){
          upfront.setup(app, function(err, success){
            upfront.config.should.have.property('ignore');
            upfront.config.ignore.should.be.an.instanceof(Array).with.lengthOf(0);
            should.deepEqual(upfront.config.ignore, []);
            done();
          });
        });
      });

      describe('when passing app as attribute', function(done){
        var app, upfront;
        beforeEach(function(done){
          upfront = require('../lib/upfront.js');
          app     = express.createServer();
          app.set('views', __dirname + '/default_config');
          should.exist(app.settings);
          should.exist(app.settings.views);
          done();
        });
        it('returns without error', function(done){
          upfront.setup({app:app}, function(err, success){
            should.not.exist(err);
            should.exist(success);
            done();
          });
        });
        it('creates config', function(done){
          upfront.setup({app:app}, function(err, success){
            should.exist(upfront.config);
            upfront.config.should.have.property('views');
            upfront.config.should.have.property('rx');
            upfront.config.should.have.property('extensions');
            upfront.config.should.have.property('ignore');
            done();
          });
        });
        it('upfront.views matches app.settings.views', function(done){
          upfront.setup({app:app}, function(err, success){
            assert.equal(upfront.config.views, app.settings.views);
            done();
          });
        });
        it('creates a properly formed regex', function(done){
          upfront.setup({app:app}, function(err, success){
            upfront.config.rx.should.be.an.instanceof(RegExp);
            var rx = ["/^" + __dirname + "/default_config/(.*?).(html|utml)$/"].join('');
            should.equal(rx, upfront.config.rx);
            done();
          });
        });
        it('ignores nothing', function(done){
          upfront.setup(app, function(err, success){
            upfront.config.should.have.property('ignore');
            upfront.config.ignore.should.be.an.instanceof(Array).with.lengthOf(0);
            should.deepEqual(upfront.config.ignore, []);
            done();
          });
        });
      });
    });
  });

  describe('Custom Configuration', function(){
    describe('Succeeds', function(){
      describe('when passing app with upfront.json', function(done){
        var app, upfront;
        beforeEach(function(done){
          upfront = require('../lib/upfront.js');
          app     = express.createServer();
          app.set('views', __dirname + '/custom_config');
          should.exist(app.settings);
          should.exist(app.settings.views);
          done();
        });
        it('returns without error', function(done){
          upfront.setup(app, function(err, success){
            should.not.exist(err);
            should.exist(success);
            done();
          });
        });
        it('creates config', function(done){
          upfront.setup(app, function(err, success){
            should.exist(upfront.config);
            upfront.config.should.have.property('views');
            upfront.config.should.have.property('rx');
            upfront.config.should.have.property('extensions');
            upfront.config.should.have.property('ignore');
            done();
          });
        });
        it('upfront.views matches app.settings.views', function(done){
          upfront.setup(app, function(err, success){
            assert.equal(upfront.config.views, app.settings.views);
            done();
          });
        });
        it('is set to ignore files', function(done){
          upfront.setup(app, function(err, success){
            upfront.config.should.have.property('ignore');
            upfront.config.ignore.should.be.an.instanceof(Array).with.lengthOf(1);
            should.deepEqual(upfront.config.ignore, [ "ignore_me" ]);
            done();
          });
        });
        it('creates a properly formed regex', function(done){
          upfront.setup(app, function(err, success){
            upfront.config.rx.should.be.an.instanceof(RegExp);
            var rx = ["/^" + __dirname + "/custom_config/(.*?).(jade|md)$/"].join('');
            should.equal(rx, upfront.config.rx);
            done();
          });
        });
      });

      describe('when passing app as attribute with upfront.json', function(done){
        var app, upfront;
        beforeEach(function(done){
          upfront = require('../lib/upfront.js');
          app     = express.createServer();
          app.set('views', __dirname + '/custom_config');
          should.exist(app.settings);
          should.exist(app.settings.views);
          done();
        });
        it('returns without error', function(done){
          upfront.setup({app:app}, function(err, success){
            should.not.exist(err);
            should.exist(success);
            done();
          });
        });
        it('creates config', function(done){
          upfront.setup({app:app}, function(err, success){
            should.exist(upfront.config);
            upfront.config.should.have.property('views');
            upfront.config.should.have.property('rx');
            upfront.config.should.have.property('extensions');
            upfront.config.should.have.property('ignore');
            done();
          });
        });
        it('upfront.views matches app.settings.views', function(done){
          upfront.setup({app:app}, function(err, success){
            assert.equal(upfront.config.views, app.settings.views);
            done();
          });
        });
        it('is set to ignore files', function(done){
          upfront.setup({app:app}, function(err, success){
            upfront.config.should.have.property('ignore');
            upfront.config.ignore.should.be.an.instanceof(Array).with.lengthOf(1);
            should.deepEqual(upfront.config.ignore, [ "ignore_me" ]);
            done();
          });
        });
        it('creates a properly formed regex', function(done){
          upfront.setup({app:app}, function(err, success){
            upfront.config.rx.should.be.an.instanceof(RegExp);
            var rx = ["/^" + __dirname + "/custom_config/(.*?).(jade|md)$/"].join('');
            should.equal(rx, upfront.config.rx);
            done();
          });
        });
      });

      describe('when passing app as attribute with config file string', function(done){
        var app, upfront, cfg;
        beforeEach(function(done){
          upfront = require('../lib/upfront.js');
          app     = express.createServer();
          app.set('views', __dirname + '/custom_config');
          should.exist(app.settings);
          should.exist(app.settings.views);
          cfg = app.settings.views + "/upfront_custom.json";
          done();
        });
        it('returns without error', function(done){
          upfront.setup({app:app, config:cfg}, function(err, success){
            should.not.exist(err);
            should.exist(success);
            done();
          });
        });
        it('creates config', function(done){
          upfront.setup({app:app, config:cfg}, function(err, success){
            should.exist(upfront.config);
            upfront.config.should.have.property('views');
            upfront.config.should.have.property('rx');
            upfront.config.should.have.property('extensions');
            upfront.config.should.have.property('ignore');
            done();
          });
        });
        it('upfront.views matches app.settings.views', function(done){
          upfront.setup({app:app, config:cfg}, function(err, success){
            assert.equal(upfront.config.views, app.settings.views);
            done();
          });
        });
        it('is set to ignore files', function(done){
          upfront.setup({app:app, config:cfg}, function(err, success){
            upfront.config.should.have.property('ignore');
            upfront.config.ignore.should.be.an.instanceof(Array).with.lengthOf(3);
            should.deepEqual(upfront.config.ignore, [ "slugs", "of", "ignorance" ]);
            done();
          });
        });
        it('creates a properly formed regex', function(done){
          upfront.setup({app:app, config:cfg}, function(err, success){
            upfront.config.rx.should.be.an.instanceof(RegExp);
            var rx = ["/^" + __dirname + "/custom_config/(.*?).(custom|json)$/"].join('');
            should.equal(rx, upfront.config.rx);
            done();
          });
        });
      });

      describe('when passing app as attribute with config as object', function(done){
        var app, upfront,
            cfg = {
              "ignore"      : [ "ignorace", "is not a", "virtue" ],
              "extensions"  : [ "xyz", "rst" ]
            };
        beforeEach(function(done){
          upfront = require('../lib/upfront.js');
          app     = express.createServer();
          app.set('views', __dirname + '/custom_config');
          should.exist(app.settings);
          should.exist(app.settings.views);
          done();
        });
        it('returns without error', function(done){
          upfront.setup({app:app, config:cfg}, function(err, success){
            should.not.exist(err);
            should.exist(success);
            done();
          });
        });
        it('creates config', function(done){
          upfront.setup({app:app, config:cfg}, function(err, success){
            should.exist(upfront.config);
            upfront.config.should.have.property('views');
            upfront.config.should.have.property('rx');
            upfront.config.should.have.property('extensions');
            upfront.config.should.have.property('ignore');
            done();
          });
        });
        it('upfront.views matches app.settings.views', function(done){
          upfront.setup({app:app, config:cfg}, function(err, success){
            assert.equal(upfront.config.views, app.settings.views);
            done();
          });
        });
        it('is set to ignore files', function(done){
          upfront.setup({app:app, config:cfg}, function(err, success){
            upfront.config.should.have.property('ignore');
            upfront.config.ignore.should.be.an.instanceof(Array).with.lengthOf(3);
            should.deepEqual(upfront.config.ignore, [ "ignorace", "is not a", "virtue" ]);
            done();
          });
        });
        it('creates a properly formed regex', function(done){
          upfront.setup({app:app, config:cfg}, function(err, success){
            upfront.config.rx.should.be.an.instanceof(RegExp);
            var rx = ["/^" + __dirname + "/custom_config/(.*?).(xyz|rst)$/"].join('');
            should.equal(rx, upfront.config.rx);
            done();
          });
        });
      });

    });
  });
});


describe('COMPILATION', function(){

  describe('Default Configuration', function(){});

  describe('Custom Configuration', function(){
    describe('when passing app with upfront.json', function(done){});
    describe('when passing app as attribute with upfront.json', function(done){});
    describe('when passing app as attribute with config file string', function(done){});
    describe('when passing app as attribute with config as object', function(done){});
  });

});

/*
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
*/

/*
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
*/

/*
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
*/
