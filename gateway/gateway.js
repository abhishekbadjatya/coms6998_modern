var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var config=require('./config.js');
var stripe = require('stripe')(config.STRIPE_SECRET_KEY);
var fetch = require('node-fetch');
var cors = require('cors');
var myHeaders= {'Content-Type': 'application/json'};


var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());


app.post('/api/gateway/charge', function(req, res) {

    var JWT=req.headers.authorization;
    var stripeToken = req.body.stripeToken; //need to check from where to retrieve the token
    var productID = req.body.productID;

    fetch(config.BASE_URL_USER+'/grocery/'+productID)
    .then(function(res) {
        return res.json();
    })
    .then(function(json) {
        var amount = json.price;
        stripe.charges.create({
        card: stripeToken,
        currency: 'usd',
        amount: amount*100
     },function(err, charge) {
            console.log(charge);
            var newHeader={'Content-Type': 'application/json',
                            'Authorization': JWT};
            if (err) {
                console.log(err);
                let postdata = {
                    "status":"FAILURE",
                    "error":err,
                    "product_id":productID
                };
                fetch(config.BASE_URL_PAYMENT+'/api/payment/save', { method: 'POST', 
                                                                body: JSON.stringify(postdata),
                                                                headers: newHeader
                })
            } else {
                let postdata = {
                    "status":"SUCCESS",
                    "chargeDetails":charge,
                    "product_id":productID
                };
                fetch(config.BASE_URL_PAYMENT+'/api/payment/save', { method: 'POST', 
                                                                body: JSON.stringify(postdata),
                                                                headers: newHeader
                })
                .then(function(res){
                    console.log('In then');
                })
                .catch(function(err){
                    console.log('Inside catch');
                    console.log(err);
                });
            }
        })
        res.status(202).json({"message" : "CHARGE_TO_BE_CREATED"});
    })
    .catch(function(err) {
        console.log('Error');
        console.log(err);
        res.status(500).send("INTERNAL_SERVER_ERROR");
    });
});

app.use(express.static(__dirname));
app.listen(3002);