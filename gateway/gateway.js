var express = require('express');
var bodyParser = require('body-parser');
var config=require('../config.js');
var stripe = require('stripe')(config.STRIPE_SECRET_KEY);

var app = express();
app.use(bodyParser());

app.post('/charge', function(req, res) {
    var stripeToken = req.body.stripeToken;
    console.log(stripeToken);
    var amount = 1000;

    stripe.charges.create({
        card: stripeToken,
        currency: 'usd',
        amount: amount
    },
    function(err, charge) {
        if (err) {
            res.status(500).send(err);
        } else {
            console.log(charge);
            res.status(200).send(charge);
        }
    });
});

app.use(express.static(__dirname));
app.listen(3000);