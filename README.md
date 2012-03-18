# Upfront v 0.1.0

## Notes

While upfront doesn't *require* [express-expose](https://github.com/visionmedia/express-expose), it's mostly useless without it. I figure you could use [Browserify](https://github.com/substack/node-browserify) as well, but I haven't tested that yet.

Upfront also pairs well with [Mike Frey's](https://github.com/mikefrey) [UTML](https://github.com/mikefrey/UTML) module, which lets you use underscore templates server side. Use upfront to send your templates up to your front-end *(up, front, get it?)* and then you can use the same templates on the server and in the browser if you're builing a Backbone app.


## Usage

### In your app file:

This will send every template you have to the front end. Useful for fat clients.

```javascript
var upfront = require('upfront');
/* ... */
upfront.setup(app, function(){
  upfront.grab(function(err, done){
    if (err) throw new Error(err);
    app.expose(app.settings.templates, "Templates");
  });
});
```

In your layout, assuming you're using express-expose, put this right before the closing `</body>` tag:

```html
  <%= javascript %>
</body>
```


## Config

Add an upfront.json file to the root of your views directory. For now upfront only cares about which files to ignore, so create an array of them, like this:

```json
{
  "ignore" : [ "ignore", "whatever", "you", "want" ]
}
```
