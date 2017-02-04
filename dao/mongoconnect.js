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

var userSchema = new mongoose.Schema({
	
});


var productSchema = new mongoose.Schema({
	
});

var paymentSchema = new mongoose.Schema({
	paymentId : String,
	itemId : String,
	userId : String,
	amount : float
});

var paymentModel = mongoose.model('paymentModel', paymentSchema);
var productModel = mongoose.model('productModel', paymentSchema);
var userModel = mongoose.model('userModel', paymentSchema);

exports.userModel = userModel;
exports.productModel = productModel;
exports.paymentModel = paymentModel;