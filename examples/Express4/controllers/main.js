var Controller = require('osmmvc').Controller;
var Main = new Controller();

var Supplies = require('../models/supplies');

Main.index = function(input, output) {
	var params = {
		title : 'Main EJS'
	};

	return output.render('main.ejs', params);
};

Main.list = async function(input, output) {
	var self = this;
	var params = {
		title : 'Main/List EJS',
		message: input.query.message
	};

	params.supplies = await Supplies.find();

	return output.render('list.ejs', params);
};

Main.add = function(input, output) {
	return output.render('add.ejs', { title : "Add Item to Supplies Model" });
};

Main.add_post = function(input, output) {
	Supplies.create({
		name : input.body.name,
		count: input.body.count
	});

	return output.redirect('/main/list?message=Item%20Added');
};

module.exports = Main;