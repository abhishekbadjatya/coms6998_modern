var dao = require('../dao/mongoconnect.js');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());


var paymentModel = dao.paymentModel;

app.post('/api/payment/save', function(req, res) {

	dao.connectToDB();
	var newPayment = paymentModel(req.body.paymentObj).save()
    .then(function(data){
		    dao.disConnectFromDB();
		    res.status(200).send(data);
    })
    .catch(function(err){
        dao.disConnectFromDB();
        console.log(err);
        res.status(500).send(data);
    });

});

app.use(express.static(__dirname));
app.listen(3001);
