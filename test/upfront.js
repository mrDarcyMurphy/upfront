var express = require('express'),
    assert  = require('assert'),
    should  = require('should');


describe('Setup', function(){

  describe('FAILS', function(){

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

  });

  // -------------------------

  describe('Default Configuration', function(){
    describe('SUCCEEDS', function(){
      describe('when passing app', function(done){
        var app, upfront, err, success;
        beforeEach(function(done){
          upfront = require('../lib/upfront.js');
          app     = express.createServer();
          app.set('views', __dirname + '/default_config');
          should.exist(app.settings);
          should.exist(app.settings.views);
          done();
        });
        it('returns without error', function(){
          upfront.setup(app, function(err, success){
            should.not.exist(err);
            should.exist(success);
          });
        });
        it('creates config', function(){
          upfront.setup(app, function(err, success){
            should.exist(upfront.config);
            console.log(upfront.config);
          });
        });
        it('config has views path', function(){
          upfront.setup(app, function(err, success){
            should.have.property(upfront.config, 'views');
            console.log('upfront.config.views', upfront.config.views);
          });
        });

        it('upfront.views matches app.settings.views', function(){
          // console.log('upfront.config.views', upfront.config.views);
          // console.log('app.settings.views', app.settings.views);
          assert.equal(upfront.config.views, app.settings.views);
          assert.equal(app.settings.views, upfront.config.views);
        });
        it('creates a properly formed regex', function(){
          should.equal(false, true, 'test unwritten');
          // upfront.config.views = app.settings.views;
          // upfront.config.rx = new RegExp("^"+upfront.config.views+"\/(.*?)\.(html|md|utml)$");
        });
      });
      // describe('when passing app as attribute', function(done){
      //   it('succeeds', function(){
      //     should.equal(false, true, 'test unwritten');
      //   });
      // });
    });
  });

  // describe('Custom Configuration', function(){
  //   describe('SUCCEEDS', function(){
  //     describe('when passing app with upfront.js', function(done){
  //       it('succeeds', function(){
  //         should.equal(false, true, 'test unwritten');
  //       });
  //     });
  //     describe('when passing app as attribute with upfront.js', function(done){
  //       it('succeeds', function(){
  //         should.equal(false, true, 'test unwritten');
  //       });
  //     });
  //     describe('when passing app as attribute with config file attribute', function(done){
  //       it('succeeds', function(){
  //         should.equal(false, true, 'test unwritten');
  //       });
  //     });
  //     describe('when passing app as attribute with config as object', function(done){
  //       it('succeeds', function(){
  //         should.equal(false, true, 'test unwritten');
  //       });
  //     });
  //   });
  // });

});


/*
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
*/

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
