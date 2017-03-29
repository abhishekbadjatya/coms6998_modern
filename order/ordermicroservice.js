var config=require('./config.js');
var dao = require('./dao/mongoconnect.js');
var express = require('express');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var paymentModel = dao.paymentModel;

var orderModel = dao.orderModel;
var orderProductModel = dao.orderProductModel;


app.post('/api/orders/purchaseHistory', function(req, res) {
	var customerID = req.body.custID;
	var accountNumber = req.body.accountNumber;
	console.log(customerID);
	dao.connectToDB();
	orderModel.find({"customer_id" : customerID, "status" : "SUCCESS"}).exec()
	.then(function(orders){
		var orderIDs = [];
		for(var j = 0; j < orders.length; j++){
			orderIDs.push(orders[j].id);
		}
						console.log(orderIDs);
		return orderProductModel.find({
			"orderID" : {$in : orderIDs}
		}).exec();
	})
	.then(function(orderProducts){
		dao.disConnectFromDB();
		var products = [];
		for(var i=0; i < orderProducts.length; i++){
			products.push(orderProducts[i].productID);
		}
		res.status(200).json(products);
	})
	.catch(function(err){
		dao.disConnectFromDB();
		console.log(err);
		res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
	})

});

app.post('/api/orders/createOrder', function(req, res) {

	var orderID = null;
	var productID = req.body.productID;
	var productPrice = req.body.productPrice;
	var customerID = req.body.custID;
	var accountNumber = req.body.accountNumber;
	var status = 'PENDING';
	var stripeToken = req.body.stripeToken;


	dao.connectToDB();
	orderModel({
		"customer_id" 	 : customerID,
		"account_number" : accountNumber,
		"charge"				 : null,
		"status"         : status
	}).save()
	.then(function(order){
		dao.disConnectFromDB();
		console.log("Order id " + order.id);
		orderID = order.id;
		res.status(202).json({"orderID":orderID, "status":status});
		return fetch('https://o6iadgh01m.execute-api.us-west-2.amazonaws.com/dev/charge', {//(config.BASE_URL_USER+'/adapter/placeCharge', { //
			method 				: 'POST',
			body	: JSON.stringify({
				"productID" 		: productID,
				"stripeToken" 	: stripeToken,
				"productPrice" 	: productPrice
			})});
		}, function(err){
			dao.disConnectFromDB();
			console.log(err);
			res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
		})
		.then(function(response){
			return response.json();
		})
		.then((json) => {
			var charge = json.stripeInfo;
			status = json.status;
			dao.connectToDB();
			return orderModel.findByIdAndUpdate(orderID, {
				"charge"	: charge,
				"status"  : status
			}, {new : true});
	})
	.then(function(order){
		if(status == 'FAILURE'){
			return Promise.reject();
		}
		return orderProductModel({
			"orderID"  	: orderID,
			"productID" : productID
		}).save();
	})
	.then(function(orderProduct){
		console.log("Order product created. Everything done");
		dao.disConnectFromDB();
	})
	.catch(function(err){
		dao.disConnectFromDB();
		console.log(err);
	});

});


app.use(express.static(__dirname));
app.listen(3001);
console.log("Server started");
