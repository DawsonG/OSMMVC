OSMMVC
======

A super small, super light, routing magic plugin for creating MVC patterns in Node.js with Express.

## Usage
Install osmmvc with `npm install osmmvc` or add it to your package.json depedencies `"dependencies": { "osmmvc": "1.0.1" }` and call `npm install`

Add the following lines to your application's main js file.  They muse fall after any Express configuration.  `app` is the `express()` function return.
```
var mvc = require('osmmvc');
mvc.routing(app);
```

If you need additional pathes outside of the `/:controller/:action/para/met/ers` pattern you can either declare them above the `mvc.routing(app);` line or use the additional routing function.  For example:
```
var mvc = require('osmmvc');
mvc.routing(app, function(app) {
	app.get('/some/other/path', function(req, res) {
		// Whatever actions you need.
	});
});
```

Controllers need to be created inside the `/controllers/` folder.  They must include the osmmvc Controller object.  A basic example looks like this:
```
var osmmvc = require('osmmvc');
var Controller = osmmvc.Controller;

var MainController = new Controller();

MainController.index = function() {
	this.res.render('index', { title: 'The index page!', body: 'Common body stuff' });
}

module.exports = MainController;
```

Response and Request objects can be found in the `this.res` and `this.req` variables of the Controller object.  Use the response object to do anything you'd normally do in an Express path.

## Tutorial Page
[OSMstudios Tutorial Page](http://osmstudios.com/tutorials/osmmvc)

