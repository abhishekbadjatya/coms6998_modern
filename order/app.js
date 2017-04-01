var config=require('./config.js');
var dao = require('./dao/mongoconnect.js');
var express = require('express');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var AWS = require('aws-sdk');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var paymentModel = dao.paymentModel;

var orderModel = dao.orderModel;
var orderProductModel = dao.orderProductModel;
var accountModel = dao.account;


AWS.config.update(config.AWS_config);


app.get('/api/orders/purchaseHistory/:custID', function(req, res) {
	var customerID = req.params.custID;
	//var accountNumber = req.body.accountNumber;
	console.log(customerID);
	dao.connectToDB();
	orderModel.find({"customer_id" : customerID, "status" : "SUCCESS"}).exec()
	.then(function(orders){
		var orderIDs = [];
		for(var j = 0; j < orders.length; j++){
			if(dao.validateID(orders[j].id)){
				orderIDs.push(orders[j].id);
			}
		}
		//console.log(orderIDs);
		return orderProductModel.find({
			"orderID" : {$in : orderIDs}
		}).exec();
	})
	.then(function(orderProducts){
		dao.disConnectFromDB();
		var orderProductsResp = [];
		for(var i=0; i < orderProducts.length; i++){
			orderProductsResp.push({
				"productID" : orderProducts[i].productID,
				"orderID"  	: orderProducts[i].orderID
			});
		}
		res.status(200).json({
			"orderProducts" : orderProductsResp
		});
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
	var orderID = req.body.order;


	/*dao.connectToDB();
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
		return */
		fetch('https://o6iadgh01m.execute-api.us-west-2.amazonaws.com/dev/charge', {//(config.BASE_URL_USER+'/adapter/placeCharge', { //
			method 				: 'POST',
			body	: JSON.stringify({
				"productID" 		: productID,
				"stripeToken" 	: stripeToken,
				"productPrice" 	: productPrice
			})})
		/*}, function(err){
			dao.disConnectFromDB();
			console.log(err);
			res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
		})*/
		.then(function(response){

			return response.json();
		})
		.then((json) => {
			console.log(orderID);
			var charge = json.stripeInfo;
			status = json.status;
			dao.connectToDB();
			return orderModel.findByIdAndUpdate(orderID, {
				"charge"	: charge,
				"status"  : status
			}, {new : true});
	})
	.then(function(order){
		console.log(order);
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
		res.status(200).send({"status" :"SUCCESS"});
	})
	.catch(function(err){
		dao.disConnectFromDB();
		console.log(err);
	});

});




app.post('/api/orders/createBlankOrder', function(req, res) {

	var orderID = null;
	var productID = req.body.productID;
	var custID = req.body.custID;
	var accountNumber = req.body.accountNumber;
	var status = 'PENDING';
	var stripeToken = req.body.stripeToken;

	dao.connectToDB();
	orderModel({
		"customer_id" 	 : custID,
		"account_number" : accountNumber,
		"charge"				 : null,
		"status"         : status
	}).save()
	.then(function(order){
		dao.disConnectFromDB();
		res.status(202).send({"callback" :"/api/orders/poll/"+order.id});
		var sns = new AWS.SNS();
		var respJSON = {
			"order" 	: order.id,
			"productID" : productID,
			"custID" : custID,
			"accountNumber" : accountNumber,
			"stripeToken" : stripeToken,
		};
		var respJSONStr = JSON.stringify(respJSON);
		var params = {
			Message: JSON.stringify({
				"object" : respJSONStr,
				"default" : "Default message."
			}),
		  MessageStructure: 'JSON',
		  Subject: 'pickPrice',
		  TargetArn: config.takeProductARN
		};
		sns.publish(params, function(err, data){
				if(err) {
					console.log(err);
				} else {
					console.log(data);
				}

		});
	})
	.catch(function(err){
		dao.disConnectFromDB();
		console.log(err);
		//res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
	});
});


app.post('/api/orders/vedant', function(req, res) {

	dao.connectToDB();
	accountModel({
    "accountType": "saving",
    "accountBalance": 10
  }).save()
  .then(function(accountObj){
		res.status(202).json(accountObj);
	})
	.catch(function(err){
		res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
	});
});


app.get('/api/orders/poll/:id', function(req, res) {

	var orderID = req.params.id;

	dao.connectToDB();
	orderModel.find({_id : orderID, status : 'SUCCESS'}).exec()
  .then(function(orderObj){
		if(orderObj != undefined) {
			res.status(200).json({'status':'SUCCESS'});
		} else {
			res.status(404).json({'status':'FAILURE'});
		}
	})
	.catch(function(err){
		res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
	});
});


app.get('/',(req,res) =>{
	res.status(200).json({message:"Hello"});
});

app.use(express.static(__dirname));
app.listen(process.env.PORT||3001);
console.log("Server started");
