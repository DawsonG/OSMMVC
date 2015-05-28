OSMMVC
======

A super small, super light, routing magic plugin for creating MVC patterns in Node.js with Express.

## Usage
Install osmmvc with `npm install osmmvc` or add it to your package.json depedencies `"dependencies": { "osmmvc": "2.0.0" }` and call `npm install`

Add the following lines to your application's main js file.  They must fall after any Express configuration.  `app` is the `express()` function return.
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

	// OR if you need to pass off a path to a specific controller function
	mvc.Route("/the/path/:aParameter", "", "get");  /* last argument is a comma separated list of 
	valid HTTP methods.  if blank it defaults to all */
});
```

Controllers need to be created inside the `/controllers/` folder.  They must include the osmmvc Controller object.  A basic example looks like this:
```
var osmmvc = require('osmmvc');
var Controller = osmmvc.Controller;

var MainController = new Controller();

MainController.index = function(input, output) {
	output.render({ title: 'The index page!', body: 'Common body stuff' }); // Will render /views/MainController/index passing in a title and body variable.
	// OR if you don't want to use the default view 
	output.render('/this/layout', { title: 'The index page!', body: 'Common body stuff' });
	// OR if you don't need anything at all
	output.render();
}

module.exports = MainController;
```

The output.render command wraps 

You can render a layout through your normal Express renderer using `output.render` or send information using `output.send`.  Using the render wrapper also passes the controller name, the called action, and the current date to your template.  The output object also wraps .redirect and .sendFile.

Response and Request objects can be found in the `output.res` and `this.req` variables of the Controller object.  Use the response object to do anything you'd normally do in an Express path. 

## Tutorial Page
[OSMstudios Tutorial Page](http://osmstudios.com/tutorials/osmmvc)

