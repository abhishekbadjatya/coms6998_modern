var dao = require('../dao/mongoconnect.js');
var express = require('express');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var paymentModel = dao.paymentModel;

app.post('/api/payment/save', function(req, res) {

	var chargeFromStripe = req.body.chargeDetails;
	var productId = req.body.product_id;
	var jwtToken = req.headers.authorization;
	var myHeaders = {'Authorization' : jwtToken};
	fetch('http://localhost:3000/api/user/', { method: 'GET',
																						headers: myHeaders})
	.then(function(res){
			var userId = res;
			dao.connectToDB();
			return paymentModel({
				"charge" : chargeFromStripe,
				"itemId" : productId,
				"userId" : userId
			}).save()
	})
	.then(function(data){
			dao.disConnectFromDB();
			fetch('http://localhost:3000/api/user/paymentResponse', { method: 'POST',
																								body: JSON.stringify({'status' : 'success',
																								 											'productId' : productId})})
			.then(function(){
					res.status(200).send(data);
			})
	})
	.catch(function(err){
        dao.disConnectFromDB();
        console.log(err);
        res.status(500).send(data);
  });

});

app.use(express.static(__dirname));
app.listen(3001);
console.log("Server started");
