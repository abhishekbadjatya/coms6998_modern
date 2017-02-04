var dao = requrire('../dao/mongoconnect.js');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());


var paymentModel = dao.paymentModel;

app.post('/savePayment', function(req, res) {
    
	dao.connectToDB();
	var newPayment = paymentModel(req.body.paymentObj).save(function(err, data){
		dao.disConnectFromDB();
		if(err) throw err;
    	res.json(data);
    });
        
});

app.use(express.static(__dirname));
app.listen(3001);