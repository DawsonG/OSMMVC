function Controller() {
	this.res = this.response = null;
}

Controller.prototype.setRes = function(res) {
	this.res = this.response = res;
}

Controller.prototype.setReq = function(req) {
	this.req = this.request = req;
}

module.exports = Controller;