# Upfront v 0.2.2

Helps setup your front end.

## Notes

While upfront doesn't *require* [express-expose](https://github.com/visionmedia/express-expose), it's mostly useless without it. I figure you could use [Browserify](https://github.com/substack/node-browserify) as well, but I haven't tested that yet.

Upfront also pairs well with [Mike Frey's](https://github.com/mikefrey) [UTML](https://github.com/mikefrey/UTML) module, which lets you use underscore templates server side. Use upfront to send your templates up to your front-end and then you can use the same templates on the server and in the browser if you're builing a Backbone app.


## Usage

### In your app file:

This will send every template you have to the front end. Useful for fat clients.

```javascript
var upfront = require('upfront');

upfront.setup(app, function(err){
  if (err) throw new Error(err);
  upfront.compile(function(err, done){
    if (err) throw new Error(err);
    app.expose(app.settings.templates, "Templates");
  });
});
```

In your layout, assuming you're using express-expose, put this right before the closing `</body>` tag:

```html
<body>
  <!-- ... -->
  <script type="text/javascript"><%= javascript %></script>
</body>
```


## Configuration

There are a few ways to configure upfront to your liking.

1. Create an upfront.json file in your views folder.
2. Pass a string with the path name to a custom configuration file.
3. Pass in an object containing your configuration options.

### Examples

#### File path
```javascript
upfront.setup({app:app, config: __dirname + '/config/upfront.json'}, function(err){
  // ...
});
```

#### Config Object
```javascript
var cfg = {
  "ignore" : [ "file_names", "excluding_extension" ],
  "extensions": [ "jade", "md" ]
};
upfront.setup({app:app, config:cfg}, function(err){
  // ...
});
```



### Options

1. **Stuff to ignore.** If, for example, you don't want to include your layout, simply add it's filename, excluding the extension, to an array called "ignore".
2. **Extensions you care about.** Defaults to html and utml. Set this to whatever you want.


```json
{
  "ignore" : [ "layout", "ignore", "whatever", "you", "want" ],
  "extensions": [ "html", "jade", "md", "utml" ]
}
```
