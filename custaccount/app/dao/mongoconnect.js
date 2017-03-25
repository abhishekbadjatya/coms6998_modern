var mongoose = require ("mongoose");
var config=require('../config.js');

module.exports.connectToDB = function() {
	mongoose.connect(config.MONGO_DB_CONNECTION_STRING, function(){
		console.log("Connected to DB");
	});
};

module.exports.disConnectFromDB = function() {
	mongoose.connection.close(function(){
		console.log("Dis-connected to DB");
	});
};

