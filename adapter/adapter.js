'use strict';
let aws = require('aws-sdk');

var config=require('./config.js');
var stripe = require('stripe')(config.STRIPE_SECRET_KEY);
aws.config={ "accessKeyId": config.accessKeyId, "secretAccessKey": config.secretAccessKey, "region": "us-east-1" };


//exports.handler;
exports.handler = (event, context, callback) => {


	switch (event.path) {

		case '/email' :

			sendEmail(JSON.parse(event.body))
			.then((res) => {

				let response = {
				    statusCode: '200',
				    body: JSON.stringify(res),
				    headers: {
				        'Content-Type': 'application/json',
				    }
				};

				context.succeed(response);


			}).catch((err)=> {

				let response = {
				    statusCode: '500',
				    body: JSON.stringify(err),
				    headers: {
				        'Content-Type': 'application/json',
				    }
				};

				context.succeed(response);
			});
		break;

		case '/charge' :
			
			makePayment (JSON.parse(event.body))
			.then((res) => {

				let response = {
				    statusCode: '200',
				    body: JSON.stringify(res),
				    headers: {
				        'Content-Type': 'application/json',
				    }
				};

				context.succeed(response);

			})
			.catch((err)=> {

				let response = {
				    statusCode: '400',
				    body: JSON.stringify(err),
				    headers: {
				        'Content-Type': 'application/json',
				    }
				};

				context.succeed(response);
			});


		break;

		default:
		break;
	}


};


let sendEmail = (payload) => {


	let from  = payload.from;
	let to = payload.to;
	let subject = payload.subject;
	let body = payload.body;


	var ses = new aws.SES({apiVersion: '2010-12-01'});
	let p = new Promise((resolve, reject) => {

		ses.sendEmail({ 
			   Source: from, 
			   Destination: { ToAddresses: [to] },
			   Message: {
			       Subject: {
			          Data: subject
			       },
			       Body: {
			           Text: {
			               Data: body,
			           }
			        }
			   }
			}, (err, data) => {
			    
			    if (err) {
			    	reject({
		     			status:'FAILURE',
		     			error : err
	     			});

			    } else {

			    	resolve({
			    		status: 'SUCCESS',
			    		body : data
			    	});

			    }
		 	}
		 );

		



	});

	return p;
	

};


let makePayment = (payload) => {

	let productPrice = payload.productPrice;
	let productID = payload.productID;
	let stripeToken = payload.stripeToken;

	let  p = new Promise ((resolve, reject) => {
		stripe.charges.create({
	     
	        card: stripeToken,
	        currency: 'usd',
	        amount: productPrice*100
	     
	     }, (err, charge) => {
	     	if (err) {


	     		reject ({
	     			status:'FAILURE',
	     			stripeInfo : err
	     		});
	     	
	     	} else {
	     

	     		resolve ({
	     			status:'SUCCESS',
	     			stripeInfo : charge
	     		});

	     	
	     	}
	     	
	     	

	     });

	});

	return p;
    


};


// adapter ({
// 	"path"  : "/email",
// 	"body" : JSON.stringify({

// 		"from" : "sajal50@gmail.com",
// 	    "to" : "sk4226@columbia.edu" ,
// 	    "subject" : "yo" ,
// 	    "body" : "yoyoy"

// 	})
// });


