var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var config=require('../config.js');
var stripe = require('stripe')(config.STRIPE_SECRET_KEY);
var fetch = require('node-fetch');

var app = express();
// app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Test api for getting charge details
app.get('/getCharge', function(req, res) {
    // res.writeHead(200, {"Content-Type": "application/json"});
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({"charge":2000});
});

//Api for chargin based on token
app.post('/charge', function(req, res) {
    var stripeToken = req.body.stripeToken;
    fetch('http://localhost:3000/getCharge')
    .then(function(res) {
        return res.json();
    })
    .then(function(json) {
        var amount = json.charge;
        stripe.charges.create({
        card: stripeToken,
        currency: 'usd',
        amount: amount
     },function(err, charge) {
            if (err) {
                res.status(500).send(err);
            } else {
                console.log(charge);
                res.status(200).send(charge);
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