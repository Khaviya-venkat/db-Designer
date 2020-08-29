var mongoose 			  = require("mongoose");

var TableSchema = new mongoose.Schema({
	username: String,
	name: String,
	datatype: String, 
	constraint: String,
	tablename: String
});

module.exports = mongoose.model("Table", TableSchema);