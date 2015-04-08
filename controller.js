function merge_options(obj1, obj2){
	var rtn = {};
	for (var attrname in obj1) { rtn[attrname] = obj1[attrname]; }
	for (var attrname in obj2) { rtn[attrname] = obj2[attrname]; }
	return rtn;
}

function Controller(name) {
	this.name = name ? name : "";
	this.app = this.application = this.express = null;
	this.res = this.response = null;
	this.req = this.request = null;
}

Controller.prototype.setApp = function(app) {
	this.app = this.application = this.express = app;
};

Controller.prototype.setRes = function(res) {
	this.res = this.response = res;
};

Controller.prototype.setReq = function(req) {
	this.req = this.request = req;
};

Controller.prototype.setOpts = function(opts) {
	if (!opts.date)
		opts.date = new Date();
	this.opts = opts;
};

module.exports = Controller;