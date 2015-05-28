var Controller = require('osmmvc').Controller;
var Main = new Controller();

var Supplies = require('../models/supplies');

Main.index = function(input, output) {
	var params = {
		title : 'Main EJS'
	};

	return output.render('main.ejs', params);
};

Main.list = function(input, output) {
	var self = this;
	var params = {
		title : 'Main/List EJS',
		message: input.query.message
	};

	Supplies.find(function(err, results) {
		params.supplies = results;

		return self.res.render('list.ejs', params);
	});
};

Main.add = function(input) {
	return this.res.render('add.ejs', { title : "Add Item to Supplies Model" });
};

Main.add_post = function(input) {
	console.log(input);

	Supplies.create({
		name : input.body.name,
		count: input.body.count
	});

	return this.res.redirect('/main/list?message=Item%20Added');
};

module.exports = Main;