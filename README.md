## Usage

In your app file:

```javascript
var upfront = require('upfront');
/* ... */
upfront.setup(app, function(){
  upfront.grab(function(err, done){
    if (err) throw new Error(err);
    app.expose(app.settings.templates, "Templates");
    app.listen(3000);
    console.log("App running on port %d in %s mode", app.address().port, app.settings.env);
  });
});
```

## Config

Add an upfront.json file to the root of your views directory. For now upfront only cares about which files to ignore, so create an array of them, like this:

```json
{
  "ignore" : [ "ignore", "whatever", "you", "want" ]
}
```

## Notes

I'm using (express-expose)[https://github.com/visionmedia/express-expose] to pass the templates to the browser. I figure you could use Browserify as well, but I haven't tested that yet.
