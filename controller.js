/**
 * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
 * @param obj1
 * @param obj2
 * @returns obj3 a new object based on obj1 and obj2
 */
function merge_options(obj1,obj2){
    var obj3 = {};
    for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
    for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
    return obj3;
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

Controller.prototype.render = function(name, opts) {
	var lopts = merge_options(this.opts, opts);

	this.res.render(name, lopts);
};

Controller.prototype.respond = function() {

};

module.exports = Controller;