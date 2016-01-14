// app/models/user.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var whiskySchema = mongoose.Schema({

	name		: String,
	type		: String,
	country		: String,
	ratings		: [],
	tags		: []
});

// create the model for whiskys and expose it to our app
module.exports = mongoose.model('Whisky', whiskySchema);
