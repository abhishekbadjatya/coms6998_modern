var config=require('./config.js');
var dao = require('./dao/mongoconnect.js');
var express = require('express');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var paymentModel = dao.paymentModel;

app.post('/api/payment/save', function(req, res) {


	var status = req.body.status;
	var productId = req.body.product_id;
	if(status === 'SUCCESS'){
		var msg = req.body.chargeDetails;
	} else if(status === 'FAILURE'){
		var msg = req.body.error;
	}
	var jwtToken = req.headers.authorization;
	var myHeaders = {
		'Authorization' : jwtToken,
		'Content-Type' : 'application/json'
		};

	fetch(config.BASE_URL_USER+'/user', {
		method: 'GET',
		headers: myHeaders})
	.then(function(response){
		return response.json();
	})
	.then((json) => {
		var userId = json._id;

		dao.connectToDB();
		return paymentModel({
			"charge" : msg,
			"itemId" : productId,
			"userId" : userId
		}).save()
	})
	.then(function(data){
		dao.disConnectFromDB();
		return fetch(config.BASE_URL_USER+'/user/grocery', { 
			method: 'PUT',
			headers: myHeaders,
			body: JSON.stringify({status : status,groceryID : productId})
		})
			
	})
	.then((response)=> {
		return response.json();
	})
	.then(function(json){
		console.log(json);
		res.status(202).json("message":"PAYMENT_TO_BE_SAVED");
	})
	.catch(function(err){
        dao.disConnectFromDB();
        console.log(err);
        res.status(500).send("INTERNAL_SERVER_ERROR");
  });

});

app.use(express.static(__dirname));
app.listen(3001);
console.log("Server started");
