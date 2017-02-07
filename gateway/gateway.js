var express = require('express');
var bodyParser = require('body-parser');
var http = require('http');
var config=require('./config.js');
var stripe = require('stripe')(config.STRIPE_SECRET_KEY);
var fetch = require('node-fetch');
var cors = require('cors');
// var expressJWT = require('express-jwt');
// var jwt = require ('jsonwebtoken');
var myHeaders= {'Content-Type': 'application/json'};
// const SECRET_KEY = "This is the secret key";

var app = express();
// app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

//Test api for getting charge details
app.get('/grocery/123456789', function(req, res) {
    // res.writeHead(200, {"Content-Type": "application/json"});
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send({"price":20,"name":"milk","_id":123456789});
});

//
app.post('/api/gateway/charge', function(req, res) {
    console.log(req.headers);
    var JWT=req.headers.authorization;
    var stripeToken = req.body.stripeToken; //need to check from where to retrieve the token
    var productID = req.body.productID;

    fetch('http://localhost:3002/grocery/'+productID)
    .then(function(res) {
        return res.json();
    })
    .then(function(json) {
        console.log(json);
        var amount = json.price;
        stripe.charges.create({
        card: stripeToken,
        currency: 'usd',
        amount: amount*100
     },function(err, charge) {
            var newHeader={'Content-Type': 'application/json',
                            'Authorization': JWT};
            if (err) {
                console.log(err);
                let postdata = {
                    "status":"FAILURE",
                    "error":err
                };
                fetch('http://localhost:3001/api/payment/save', { method: 'POST', 
                                                                body: JSON.stringify(postdata),
                                                                headers: newHeader
                })
                // res.status(500).send(err);
            } else {
                let postdata = {
                    "status":"SUCCESS",
                    "chargeDetails":charge,
                    "product_id":productID
                };
                fetch('http://localhost:3001/api/payment/save', { method: 'POST', 
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
    })
    .catch(function(err) {
        console.log('Error');
        res.status(500).send(err);
    });
});

app.use(express.static(__dirname));
app.listen(3002);