function OSMMVC() {
	this.app = null;


	this.preload = null;
	this.postload = null;
}

OSMMVC.prototype.setBeforeLoad = function(fn) {
	this.preload = fn;
};

OSMMVC.prototype.setAfterLoad = function(fn) {
	this.postload = fn;
};

OSMMVC.prototype.routing = function(app, routing) {
	var self = this;
	var fs = require('fs');
	var path = require('path'),
    	appDir = path.dirname(require.main.filename);

   	this.appDir = appDir;
	this.app = app;

	if (routing && typeof routing == 'function') {
		routing(app);
	} 

	app.all('/*', function(req, res) {
		var controller = null;
		var action = null;
		var input = { params:[], query:[]}; //input stores our extra parameters.
		var params = req.params[0].split('/');

		// Lets get our parameters if and only if they already exist
		if (params.length >= 1) {
			controller = params[0];
			if (params.length >= 2) {
				action = params[1];
			}
		}

		// If we don't have a any parameters we go to the defaults.
		if (!controller)
			controller = "main";

		if (!action)
			action = "index";

		// Get any additional parameters
		if (params.length > 2) {
			for (var i = 2; i < params.length; i++) {
				input.params.push(req.params[i]);
			}
		}

		// Add the query string as well
		if (req.query) {
			input.query = req.query;
		}

		// Find the controller, make sure it exists, and get it
		if (fs.existsSync(appDir + '/controllers/' + controller + '.js')) {
			controller = require(appDir + '/controllers/' + controller);
		} else {
			console.log("INVALID CONTROLLER PATH");
			console.log('controllers/' + controller + '.js');
			return res.status(404).send('Not found');
		}
		
		// Make sure the request and response objects are sent to the controller.
		if (typeof controller.setApp !== 'function') {
			console.log("Controller does not have basic inherited functions.");
			console.log("Did you forget to require OSMMVC.Controller or to add your controller to module.exports?");
			return res.status(404).send('Not found');
		}

		controller.setApp(app);
		controller.setReq(req);
		controller.setRes(res);

		// Get the function
		var fn = controller[action]; 
		var params = {};

		if(typeof fn === 'function') {
			if(typeof self.preload === 'function') {
				if (self.preload.call(controller, app) === false)
					return;
			}

			// Call the function making sure the 'this' context is the controller
			fn.call(controller, input); // Don't forget to pass our parameters and query string

			if(typeof self.postload === 'function')
				self.postload.call(controller, app);
		} else {
			console.log("INVALID CONTROLLER ACTION");
			console.log(controller + '[' + action + ']');
			return res.status(404).send('Not found');
		}
	});
}

var mvc = module.exports = exports = new OSMMVC;