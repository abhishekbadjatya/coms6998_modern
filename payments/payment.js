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
	var myHeaders = {'Authorization' : jwtToken};
	fetch('http://localhost:3000/api/user/', { method: 'GET',
																						headers: myHeaders})
	.then(function(res){
			var userId = res;
			dao.connectToDB();
			return paymentModel({
				"charge" : msg,
				"itemId" : productId,
				"userId" : userId
			}).save()
	})
	.then(function(data){
			dao.disConnectFromDB();
			fetch('http://localhost:3000/api/user/paymentResponse', { method: 'POST',
																								body: JSON.stringify({'status' : status,
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
