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

module.exports.validateID = function(id) {
	return mongoose.Types.ObjectId.isValid(id);
}

var orderProductSchema = new mongoose.Schema({
	productID : String,
	orderID : String
});

var accountSchema = new mongoose.Schema ({
	"accountType" : String,
	"accountBalance" : Number
});

var account = mongoose.model('accounts', accountSchema);

exports.account = account;





var paymentSchema = new mongoose.Schema({}, { strict: false });
var orderSchema = new mongoose.Schema({}, { strict: false });

var paymentModel = mongoose.model('paymentModel', paymentSchema);
var orderProductSchema = mongoose.model('order_products', orderProductSchema);
var userModel = mongoose.model('userModel', paymentSchema);
var orderModel = mongoose.model('orders', orderSchema);

exports.userModel = userModel;
exports.orderProductModel = orderProductSchema;
exports.paymentModel = paymentModel;
exports.orderModel = orderModel;
