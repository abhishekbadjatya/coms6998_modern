var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var config=require('../config.js');
var stripe = require('stripe')(config.STRIPE_SECRET_KEY);
var fetch = require('node-fetch');
var myHeaders= {'Content-Type': 'application/json'};

var app = express();
// app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Test api for getting charge details
app.get('/api/user/grocery/123456789', function(req, res) {
    // res.writeHead(200, {"Content-Type": "application/json"});
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({"price":2000,"name":"milk","_id":123456789});
});

//
app.post('/api/gateway/charge', function(req, res) {
    var stripeToken = req.body.stripeToken; //need to check from where to retrieve the token
    productid=123456789
    fetch('http://localhost:3000/api/user/grocery/'+productid)
    .then(function(res) {
        return res.json();
    })
    .then(function(json) {
        console.log(json);
        var amount = json.price;
        stripe.charges.create({
        card: stripeToken,
        currency: 'usd',
        amount: amount
     },function(err, charge) {
            if (err) {
                res.status(500).send(err);
            } else {
                var postdata = {
                    "chargeDetails":charge,
                    "JWT":"JWTToken",
                    "product_id":productid
                };
                fetch('http://localhost:3001/api/payment/save', { method: 'POST', 
                                                                body: JSON.stringify(postdata),
                                                                headers: myHeaders
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
    })
    .catch(function(err) {
        console.log('Error');
        res.status(500).send(err);
    });
});

app.use(express.static(__dirname));
app.listen(3000);