const AWS = require('aws-sdk');
const fetch = require('node-fetch');
const SQS = new AWS.SQS({ apiVersion: '2012-11-05' });
const Lambda = new AWS.Lambda({ apiVersion: '2015-03-31' });
const config = require("./config.js");
const SQS_URL = config.mySqsURL;

exports.handler = (event, context, callback) => {
    // TODO implement
    console.log("start");
    console.log(event);

    var receiptHandle = event.ReceiptHandle;
    var body = JSON.parse(event.Body);
    console.log(body);

    fetch('http://prodmicro4.rukskym4pu.us-west-2.elasticbeanstalk.com/api/getproductsbyid', {
		    method : 'POST',
		    body	 : JSON.stringify(body),
		    headers : {"content-type" : "application/json"}
    })
	  .then(function(response){
	        console.log('prod fetch done');
		    return response.json();
	   })
	   .then((json) => {
		     console.log(json);
		     return fetch('http://ordermicroservice-new.us-west-2.elasticbeanstalk.com/api/orders/createOrder', {
		         method  : 'POST',
			       body	: JSON.stringify(json.body),
			       headers : {"content-type" : "application/json"}
         });
	   })
     .then(function(response){
         console.log('order fetch done');
        return response.json();
	   })
	   .then((json) => {
		     console.log(json);
		     if(json.status !== undefined) {
            // delete message
              const params = {
                QueueUrl: SQS_URL,
                ReceiptHandle: receiptHandle
              };
            SQS.deleteMessage(params, (err,data) => {
                if (err){
                console.log('error');
              console.log(err);
                }
                else{
                    console.log("Message deleted");
                }
            });
		     }
    })
    .catch(function(err){
        console.log(err);
    });

    callback(null, 'Hello from Lambda');
};
