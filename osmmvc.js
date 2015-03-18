var fs = require('fs'),
	path = require('path')

function OSMMVC() {
	this.app = null;
	this.appDir = '';
	this.defaultController = 'main';

	this.preload = null;
	this.postload = null;

	this.configured = false;
}

OSMMVC.prototype.setBeforeLoad = function(fn) {
	this.preload = fn;
};

OSMMVC.prototype.setAfterLoad = function(fn) {
	this.postload = fn;
};

OSMMVC.prototype.Route = function(path, controllerPath, arrVerbs) {
	var self = this;
	if (!arrVerbs) {
		arrVerbs = ["get"];
	}

	if (typeof arrVerbs !== 'Array') {
		arrVerbs = [arrVerbs];
	}

	for (var i = 0; i < arrVerbs.length; i++) {
		self.app[arrVerbs[i]].call(this.app, path, function(req, res) {
			var input = self._fillInput(null, req);
			var controllerArr = controllerPath.split('#'),
				controllerName = controllerArr[0],
				action = controllerArr.length > 1 ? controllerArr[1] : 'index';


			self._callController(controllerName, action, req, res, input);
		});
	}
};

OSMMVC.prototype.config = OSMMVC.prototype.configuration = function(opts) {
	if (opts && opts.directory) {
		this.appDir = opts.directory;
	}

	if (opts && opts.additional) {
		this.addtOpts = opts.additional;
	}

	if (opts && opts.defaultController) {
		this.defaultController = opts.defaultController;
	}

	this.configured = true;
};

OSMMVC.prototype.routing = function(app, routing) {
	var self = this;
	if (!self.configured)
		self.configuration();

	var appDir = path.join(path.dirname(require.main.filename), this.appDir);

   	this.appDir = appDir;
	this.app = app;

	if (routing && typeof routing == 'function') {
		routing(app);
	} 

	app.all("/*", function(req, res) {
		var controller = null;
		var action = null;
		var params = req.params[0].split('/');
		var input = self._fillInput(params, req); //input stores our extra parameters.


		// Lets get our parameters if and only if they already exist
		if (params.length >= 1) {
			controllerName = params[0];
			if (params.length >= 2) {
				action = params[1];
			}
		}

		// If we don't have a any parameters we go to the defaults.
		if (!controllerName)
			controllerName = self.defaultController;

		if (!action)
			action = "index";

		self._callController(controllerName, action, req, res, input);
	});
}

/* === Private Functions === */
function merge_options(obj1, obj2){
	var rtn = {};
	for (var attrname in obj1) { rtn[attrname] = obj1[attrname]; }
	for (var attrname in obj2) { rtn[attrname] = obj2[attrname]; }
	return rtn;
}

OSMMVC.prototype._fillInput = function(params, req) {
	var rtn = { params:[], query:[], body:[], user:{} };

	console.log(params);
	console.log(params.length);
	// Get any additional parameters
	if (!params && req.params) {
		rtn.params = req.params;
	} else {
		// Get any additional parameters
		if (params.length > 2) {
			for (var i = 2; i < params.length; i++) {
				rtn.params.push(params[i]);
			}
		}
	}

	// Add the query string as well
	if (req.query) {
		rtn.query = req.query;
	}

	// Add our user if need be
	if (req.user) {
		rtn.user = req.user;
	}

	// If we are posting we'll need the form body too.
	if (req.method == 'POST' || req.method == 'PUT') {
		rtn.body = req.body;
	}

	return rtn;
};

OSMMVC.prototype._callController = function(controllerName, action, req, res, input) {
	var self = this;

	// Find the controller, make sure it exists, and get it
	if (fs.existsSync(self.appDir + '/controllers/' + controllerName + '.js')) {
		controller = require(self.appDir + '/controllers/' + controllerName);
	} else {
		console.log("INVALID CONTROLLER PATH");
		console.log('ORIGINAL - ' + req.params[0] + '   PROCESSED - controllers/' + controllerName + '.js');
		return res.status(404).send('Not found');
	}
	
	// Make sure the request and response objects are sent to the controller.
	if (typeof controller.setApp !== 'function') {
		console.log("Controller does not have basic inherited functions.");
		console.log("Did you forget to require OSMMVC.Controller or to add your controller to module.exports?");
		return res.status(404).send('Not found');
	}

	controller.setApp(self.app);
	controller.setReq(req);
	controller.setRes(res);
	var opts = {
		controller: controllerName,
		action: action
	};

	if (typeof self.addtOpts === 'function') {
		opts = merge_options(opts, self.addtOpts.call(controller));
	}

	controller.setOpts(opts);

	// Get the function
	var fn = controller[action];

	if(typeof fn === 'function') {
		if(typeof self.preload === 'function') {
			if (self.preload.call(controller, self.app) === false)
				return;
		}

		// Call the function making sure the 'this' context is the controller
		fn.call(controller, input, self.app); // Don't forget to pass our parameters and query string

		if(typeof self.postload === 'function')
			self.postload.call(controller, self.app);
	} else {
		console.log("INVALID CONTROLLER ACTION");
		console.log(controller + '[' + action + ']');
		return res.status(404).send('Not found');
	}
};

var mvc = module.exports = exports = new OSMMVC;