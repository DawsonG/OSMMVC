function Controller() {
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

module.exports = Controller;