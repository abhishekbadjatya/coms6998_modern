var mongoose = require ("mongoose");
var config=require('./config.js');

module.exports.connectToDB = function() {
	mongoose.connect(config.MONGO_DB_CONNECTION_STRING, function(){
		console.log("Connected to App DB");
	});
};


module.exports.disConnectFromDB = function() {
	mongoose.connection.close(function(){
		console.log("Dis-connected to App DB");
	});
};

var productSchema = new mongoose.Schema({
    productName : String,
    productPrice : Number

});

var productModel = mongoose.model('products', productSchema);


module.exports.validateID = function(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

exports.productModel = productModel;
