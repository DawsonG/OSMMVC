var mongoose = require('mongoose');
var Schema = mongoose.Schema;

SuppliesSchema = mongoose.Schema({
	name : { type: String, required: true },
	count: { type: Number, required: true, default: 0 }
});

var Supplies = mongoose.model('Supplies', SuppliesSchema );
module.exports = Supplies;