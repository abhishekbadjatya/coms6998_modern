var config=require('./config.js');
var dao = require('./dao/mongoconnect.js');
var express = require('express');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var AWS = require('aws-sdk');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


var paymentModel = dao.paymentModel;

var orderModel = dao.orderModel;
var orderProductModel = dao.orderProductModel;
var accountModel = dao.account;


AWS.config.update(config.AWS_config);

var sqs = new AWS.SQS();

var sqsParams = {
  DelaySeconds: 10,
  MessageAttributes: {
    "Title": {
      DataType: "String",
      StringValue: "The Whistler"
    },
    "Author": {
    DataType: "String",
    StringValue: "John Grisham"
    },
  "WeeksOn": {
    DataType: "Number",
    StringValue: "6"
   }
 },
 MessageBody: "Information about current NY Times fiction bestseller for week of 12/11/2016.",
 QueueUrl: "QUEUE_URL"
};


dao.connectToDB();

app.get('/api/orders/purchaseHistory/:custID', function(req, res) {
	var customerID = req.params.custID;
	//var accountNumber = req.body.accountNumber;
	//console.log(customerID);
	var orderStatus = []

	//dao.connectToDB();
	/*, "status" : "SUCCESS"*/
	orderModel.find({"customer_id" : customerID}).lean().exec()
	.then(function(orders){
		var orderIDs = [];
		//console.log(orders);
		for(var j = 0; j < orders.length; j++){
			if(dao.validateID(orders[j]._id)){
				orderIDs.push(orders[j]._id);
				orderStatus.push(orders[j].status);
			}
			//console.log(orderIDs);
			//console.log(orderStatus);
		}
		//console.log(orderIDs);
		return orderProductModel.find({
			"orderID" : {$in : orderIDs}
		}).exec();
	})
	.then(function(orderProducts){
		//dao.disConnectFromDB();
		var orderProductsResp = [];
		for(var i=0; i < orderProducts.length; i++){
			orderProductsResp.push({
				"productID" : orderProducts[i].productID,
				"orderID"  	: orderProducts[i].orderID,
				"status"		: orderStatus[i],//.status
				"links"			: [
					{
						"rel" 	: "self",
						"href"	: config.BASE_URL+"/order/"+orderProducts[i].orderID
					},
					{
						"rel"		: "product",
						"href"	: config.BASE_URL+"/app/"+orderProducts[i].productID
					}
				]
			});
		}
		res.status(200).json(orderProductsResp);
	})
	.catch(function(err){
		//dao.disConnectFromDB();
		console.log(err);
		res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
	})

});

app.post('/api/orders/createOrder', function(req, res) {

	var orderID = null;
	var productID = req.body.productID;
	var productPrice = req.body.productPrice;
	var customerID = req.body.custID;
	var accountNumber = req.body.accountNumber;
	var status = 'PENDING';
	var stripeToken = req.body.stripeToken;
	var orderID = req.body.order;

  console.log("came here");
	/*dao.connectToDB();
	orderModel({
		"customer_id" 	 : customerID,
		"account_number" : accountNumber,
		"charge"				 : null,
		"status"         : status
	}).save()
	.then(function(order){
		dao.disConnectFromDB();
		console.log("Order id " + order.id);
		orderID = order.id;
		res.status(202).json({"orderID":orderID, "status":status});
		return */
		fetch('https://o6iadgh01m.execute-api.us-west-2.amazonaws.com/dev/charge', {//(config.BASE_URL_USER+'/adapter/placeCharge', { //
			method 				: 'POST',
			body	: JSON.stringify({
				"productID" 		: productID,
				"stripeToken" 	: stripeToken,
				"productPrice" 	: productPrice
			})})
		/*}, function(err){
			dao.disConnectFromDB();
			console.log(err);
			res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
		})*/
		.then(function(response){

			return response.json();
		})
		.then((json) => {
			console.log(orderID);
			var charge = json.stripeInfo;
			status = json.status;
      console.log(status);
      //dao.connectToDB();
			return orderModel.findByIdAndUpdate(orderID, {
				"charge"	: charge,
				"status"  : status
			}, {new : true});
	})
	.then(function(order){
		/*console.log(order);
		if(status == 'FAILURE'){
			return Promise.reject();
		}
		return orderProductModel({
			"orderID"  	: orderID,
			"productID" : productID
		}).save();
	})
	.then(function(orderProduct){*/
    console.log("about asndasdjaskdjakjdaksjdkasjdkasjdkas");
		var params = {
			AttributeNames: [
				"SentTimestamp"
			],
			MaxNumberOfMessages: 1,
			MessageAttributeNames: [
				"All"
			],
			QueueUrl: config.sqsURL,
			VisibilityTimeout: 20,
			WaitTimeSeconds: 5
		};
    var deleteParams = null;

    var found = false;
    console.log(!found);
    readMessage();
    // while(!found){
    // sleep(1000);
    function readMessage(){
    console.log('inside while');
		sqs.receiveMessage(params, function(err, data) {
  		if (err) {
    		console.log("Receive Error", err);
  		} else {
        console.log("inside receiveMessage");
        console.log(data);
        if(data.Messages != undefined) {
  				for(var i = 0; i < data.Messages.length; i++){
  					var id = JSON.parse(data.Messages[i].Body).orderID;
            console.log("humara iddd " + id);
            if(id == orderID){
              console.log(id);
              found = true;
  						deleteParams = {
  							QueueUrl: config.sqsURL,
  							ReceiptHandle: data.Messages[i].ReceiptHandle
  						};
  						break;
  					}
				}
        console.log(deleteParams);
        if(found) {
				sqs.deleteMessage(deleteParams, function(err, data) {
      		if (err) {
        		console.log("Delete Error", err);
      		} else {
        		console.log("Message Deleted", data);
            sqs1();
      		}
    		});
        }
        else{
          readMessage();
        }
      }
      else{
        readMessage();
      }
       //here if of undefined check ends
			}
		});
    }

function sqs1(){

		var sqsBody = {
				"orderID" : orderID,
				"status"	: status
		};

		var sqsParams = {
				DelaySeconds	: 10,
				MessageAttributes: {
					"Title": {
						DataType: "String",
						StringValue: "The Whistler"
					},
					"Author": {
						DataType: "String",
						StringValue: "John Grisham"
					},
					"WeeksOn": {
						DataType: "Number",
						StringValue: "6"
					}
				},
				MessageBody: JSON.stringify(sqsBody),
				QueueUrl: config.sqsURL
		};

		sqs.sendMessage(sqsParams, function(err, data) {
			if (err) {
				console.log("Error", err);
			} else {
				console.log("Success", data.MessageId);
			}
		});



		console.log("Order product created. Everything done");
		//dao.disConnectFromDB();
		res.status(200).send({"status" :"SUCCESS"});
  }
	})
	.catch(function(err){
		//dao.disConnectFromDB();
		console.log(err);
	});

});


/*
app.post('/api/orders/createOrder', function(req, res) {

	var orderID = null;
	var productID = req.body.productID;
	var productPrice = req.body.productPrice;
	var customerID = req.body.custID;
	var accountNumber = req.body.accountNumber;
	var status = 'PENDING';
	var stripeToken = req.body.stripeToken;


	dao.connectToDB();
	orderModel({
		"customer_id" 	 : customerID,
		"account_number" : accountNumber,
		"charge"				 : null,
		"status"         : status
	}).save()
	.then(function(order){
		dao.disConnectFromDB();
		console.log("Order id " + order.id);
		orderID = order.id;
		res.status(202).json({"orderID":orderID, "status":status});
		return fetch('https://o6iadgh01m.execute-api.us-west-2.amazonaws.com/dev/charge', {//(config.BASE_URL_USER+'/adapter/placeCharge', { //
			method 				: 'POST',
			body	: JSON.stringify({
				"productID" 		: productID,
				"stripeToken" 	: stripeToken,
				"productPrice" 	: productPrice
			})});
		}, function(err){
			dao.disConnectFromDB();
			console.log(err);
			res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
		})
		.then(function(response){
			return response.json();
		})
		.then((json) => {
			var charge = json.stripeInfo;
			status = json.status;
			dao.connectToDB();
			return orderModel.findByIdAndUpdate(orderID, {
				"charge"	: charge,
				"status"  : status
			});
	})
	.then(function(order){
		/*if(status == 'FAILURE'){
			return Promise.reject();
		}
		return orderProductModel({
			"orderID"  	: orderID,
			"productID" : productID
		}).save();
	})
	.then(function(orderProduct){
		console.log("Order updated. Everything done");
		dao.disConnectFromDB();
	})
	.catch(function(err){
		dao.disConnectFromDB();
		console.log(err);
	});

});
*/

/*app.post('/api/orders/createBlankOrder', function(req, res) {

	var orderID = null;
	var productID = req.body.productID;
	var customerID = req.body.custID;
	var accountNumber = req.body.accountNumber;
	var status = 'PENDING';

	dao.connectToDB();
	orderModel({
		"customer_id" 	 : customerID,
		"account_number" : accountNumber,
		"charge"				 : null,
		"status"         : status
	}).save()
	.then(function(order){
		res.status(202).send({"orderID" :order.id});
		var sns = new AWS.SNS();
		var params = {
			Message: JSON.stringify({
				"default" : "Default message.",
				"order" 	: order.id
			}),
		  MessageStructure: 'json',
		  Subject: 'pickPrice',
		  TargetArn: config.takeProductARN
		};

		sns.publish(params, function(err, data) {
  			if (err) console.log(err, err.stack); // an error occurred
  			else     console.log(data);           // successful response
		});
	})
	.then(function(snsCreated){
		console.log(snsCreated);
	})
	.catch(function(err){
		console.log(err);
		//res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
	});
});
*/

app.post('/api/orders/createBlankOrder', function(req, res) {

	var orderID = null;
	var productID = req.body.productID;
	var custID = req.body.custID;
	var accountNumber = req.body.accountNumber;
	var status = 'PENDING';
	var stripeToken = req.body.stripeToken;
	var orderID = null;

	//dao.connectToDB();
	orderModel({
		"customer_id" 	 : custID,
		"account_number" : accountNumber,
		"charge"				 : null,
		"status"         : status
	}).save()
	.then(function(order){
		orderID = order.id;
		return orderProductModel({
			"productID" : productID,
			"orderID"		: orderID
		}).save();
	})
	.then(function(orderProduct){
		//dao.disConnectFromDB();

		res.status(202).send({
			//"callback" 	:"/api/orders/poll/"+orderID
			"callback" 	:"/sqs/"+orderID
		});

    //sqs

    var sqsBody = {
        "orderID" : orderID,
        "status"	: "pending"
    };

    var sqsParams = {
        DelaySeconds	: 10,
        MessageAttributes: {
          "Title": {
            DataType: "String",
            StringValue: "The Whistler"
          },
          "Author": {
            DataType: "String",
            StringValue: "John Grisham"
          },
          "WeeksOn": {
            DataType: "Number",
            StringValue: "6"
          }
        },
        MessageBody: JSON.stringify(sqsBody),
        QueueUrl: config.sqsURL
    };
    console.log("hihih");
    sqs.sendMessage(sqsParams, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.MessageId);
      }
    });

    //sqs

		var sns = new AWS.SNS();
		var respJSON = {
			"order" 	: orderID,
			"productID" : productID,
			"custID" : custID,
			"accountNumber" : accountNumber,
			"stripeToken" : stripeToken,
		};
		var respJSONStr = JSON.stringify(respJSON);
		var params = {
			Message: JSON.stringify({
				"object" : respJSONStr,
				"default" : "Default message."
			}),
		  MessageStructure: 'JSON',
		  Subject: 'pickPrice',
		  TargetArn: config.takeProductARN
		};
		sns.publish(params, function(err, data){
				if(err) {
					console.log(err);
				} else {
					console.log(data);
				}

		});

	})
	.catch(function(err){
		//dao.disConnectFromDB();
		console.log(err);
		//res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
	});
});

app.get('/api/orders/poll/:id', function(req, res) {

	var orderID = req.params.id;

	dao.connectToDB();
	orderModel.find({_id : orderID, status : 'SUCCESS'}).exec()
  .then(function(orderObj){
		if(orderObj != undefined) {
			res.status(200).json({'status':'SUCCESS'});
		} else {
			res.status(404).json({'status':'FAILURE'});
		}
	})
	.catch(function(err){
		res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
	});
});




app.get('/sqs/:id', function(req, res) {

	var orderID = req.params.id;
	var completed = false;
  var deleteParams = null;
  var params = {
		AttributeNames: [
			"SentTimestamp"
		],
		MaxNumberOfMessages: 10,
		MessageAttributeNames: [
			"All"
		],
		QueueUrl: config.sqsURL,
		VisibilityTimeout: 0,
		WaitTimeSeconds: 0
	};

	sqs.receiveMessage(params, function(err, data) {
		if (err) {
			console.log("Receive Error", err);
			res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
		} else {
      console.log(data.Messages[0]);
      if(data.Messages != undefined){

      for(var i = 0; i < data.Messages.length; i++){
				var id = JSON.parse(data.Messages[i].Body).orderID;
				var status = JSON.parse(data.Messages[i].Body).status;
				if(id == orderID) {//} && status == "SUCCESS"){
					deleteParams = {
						QueueUrl: config.sqsURL,
						ReceiptHandle: data.Messages[i].ReceiptHandle
					};
					completed = true;
					break;
				}
			}

      console.log(deleteParams);
      if(completed) {
      sqs.deleteMessage(deleteParams, function(err, data) {
				if (err) {
					console.log("Delete Error", err);
				} else {
					console.log("Message Deleted", data);

				}
			});
      }
      }
		}
    if(completed) {
      res.status(200).json({'status':'SUCCESS'});
    } else {
      res.status(404).json({'status':'FAILURE'});
    }
	});

});








app.get('/order/:id', function(req, res) {

	var orderID = req.params.id;

	dao.connectToDB();
	orderModel.find({_id : orderID}).lean().exec()
  .then(function(orderObj){
		if(orderObj != undefined) {
			var retObj = orderObj[0];
			res.status(200).json(
				/*"orderID" 			: orderObj._id,
				"status" 				: orderObj.status,
				"customerID" 		:	orderObj.customer_id,
				"accountNumber"	:	orderObj.account_number*/
				retObj
			);
		} else {
			res.status(404).json({});
		}
	})
	.catch(function(err){
		res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
	});
});



app.post('/api/orders/vedant', function(req, res) {

	//dao.connectToDB();
	accountModel({
    "accountType": "saving",
    "accountBalance": 10
  }).save()
  .then(function(accountObj){
		res.status(202).json(accountObj);
	})
	.catch(function(err){
		res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
	});
});



app.get('/',(req,res) =>{
	res.status(200).json({message:"Hello"});
});

app.use(express.static(__dirname));
app.listen(process.env.PORT||3001);
console.log("Server started");
