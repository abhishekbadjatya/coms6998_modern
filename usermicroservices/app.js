let express = require('express');
let bodyParser = require('body-parser');
let expressJWT = require('express-jwt');
let jwt = require ('jsonwebtoken');
let path = require('path');
let app = express();
let mongoose = require ('mongoose');
let Schema = mongoose.Schema;
let customerModel = require ('./models/customerInfo.js');
// let groceriesModel = require ('./models/groceries.js');
let cors = require('cors');
let _ = require('lodash');
let config = require ('./config.js');
let port=process.env.PORT||3000;
let aws = require('aws-sdk');
var fetch = require('node-fetch');

aws.config={ "accessKeyId": config.aws_accessKeyId, "secretAccessKey": config.aws_secretAccessKey, "region": "us-west-2" };

const SECRET_KEY = config.SECRET_KEY;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use (
	expressJWT ({secret: SECRET_KEY})
	.unless({path : ['/','/login','/signup', '/updateVerificationStatus',new RegExp('^/grocery/*', 'i'), new RegExp('/accountverification/*', 'i')] }));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({"error":"INVALID_TOKEN"});
  }
});


app.use(cors());


mongoose.connect(config.dbURL);

mongoose.Promise = global.Promise;

app.get('/',(req,res) =>{
res.status(200).json({message:"Hello"});
});

app.get ('/jwtDetails', (req, res) => {

	let {custID,role,accessRules} = req.user;
	// console.log(custID);
	// console.log(role);
	res.status(200).json({custID,role,accessRules});

});

app.get ('/customerInfo', (req, res) => {

	let {custID} = req.user;
	console.log(req.user);
	console.log(custID);

	customerModel.find({_id:custID}).lean().exec()
	.then((customers) => {

		if (customers.length > 1) {
			return Promise.reject("MORE_THAN_ONE_USER");
		}
		if (customers.length == 0) {

			res.status(400).json({error:"NO_USER"});
		}

		let customer = customers[0];
		customer.password = '';
		customer.custID=customer._id;
		delete customer['_id'];
		// console.log(customer);
		res.status(200).json(customer);

	})
	.catch ((error) => {
		console.log(error);
		res.status(500).json({error:"INTERNAL_SERVER_ERROR"});
	});



});

app.post ('/login' , (req, res) => {

	let {emailID, password} = req.body;

	customerModel.find({emailID:emailID}).exec()
	.then((customers) => {

		if (customers.length > 1) {
			return Promise.reject("MORE_THAN_ONE_USER");
		}
		if (customers.length == 0) {

			res.status(401).json({error:"INCORRECT_CREDENTIALS"});
		}

		let customer = customers[0];

		if (customer.isVerified == false) {
				res.status(401).json({error:"USER_NOT_VERIFIED"});			

		} else if(customer.password == password) {
			let myToken;
			if (customer.role=='CUSTOMER'){
				myToken = jwt.sign ({custID: customer.custID, role: customer.role}, SECRET_KEY);
			}
			else if (customer.role=='ADMIN') {
				let accessRules = [
				{
					resource:'custInfo',
					operation: ['GET','POST','PUT','DELETE']
				},
				{
					resource:'custAccount',
					operation: ['GET','POST','PUT','DELETE']
				},
				{
					resource:'order',
					operation: ['GET','POST','PUT','DELETE']
				},
				{
					resource:'product',
					operation: ['GET','POST','PUT','DELETE']
				}
				];
				myToken = jwt.sign ({custID: customer.custID, role: customer.role, accessRules:accessRules}, SECRET_KEY);	
			}
			res.status(200).json({token:myToken, custID : customer.custID, custName:customer.custName});

		} else {

			res.status(401).json({error:"INCORRECT_CREDENTIALS"});
		}


	})
	.catch ((error) => {
		console.log(error);
		res.status(500).json({error:"INTERNAL_SERVER_ERROR"});
	});

});




app.post ('/signup' , (req, res) => {

	let {emailID, password, role} = req.body;
	let custName = emailID;
	customerModel.find({emailID:emailID}).exec()
	.then((cutomers) => {

		if (cutomers.length >= 1) {
			res.status(401).json({error:"USER_EXISTS"});
		}
    	return customerModel({"custName":custName,"emailID":emailID,"password":password,"isVerified":false,"role":role}).save();
	})
	.then(function(data){
		console.log(data);
		accountData=data;
		accountData.custID=accountData._id;
		accountData.password="";
		
		console.log(req.hostname);

		let myToken = jwt.sign({emailID: emailID}, SECRET_KEY);
		// var ses = new aws.SES({apiVersion: '2010-12-01'});
		var to = emailID;
		var from = 'aastv6998@gmail.com';
		var subject = "Account Verification"
		if (process.env)
		{
			var body = "Hi "+custName+",\n Please click on the link to verify your account: http://"+req.hostname+"/accountverification/"+myToken;
		}
		else{
			var body = "Hi "+custName+",\n Please click on the link to verify your account: http://"+req.hostname+":"+port+"/accountverification/"+myToken;
		}
		
		var emailData={to,from,subject,body};
		console.log(emailData);
		// res.status(200).json(accountData);
		res.status(200).json({status:"USER_SIGN_UP_DONE"})
		return fetch(config.sendEmailURL, { method: 'POST', 
                                     body: JSON.stringify(emailData)
                })
		


	}).then((response) => {

		return response.json();
	}).then((json) => {

		console.log(json);
	})
	.catch ((error) => {
		console.log(error);
		res.status(500).json({error:"INTERNAL_SERVER_ERROR"});
	});

});


app.get ('/accountverification/:code' , (req, res) => {

	let token = req.params.code;
	let myToken = jwt.verify(token, SECRET_KEY);
	jwt.verify(token,SECRET_KEY,function(err,token){
		if(err){
			console.log('Error');
			res.status(500).json({error:"INVALID_TOKEN"});
		}
		else{
			//TODO everything in config and change name of statemachine and lambda function
			console.log(token);
			let emailID=token.emailID;
			console.log(emailID);

			// var AWS = require('aws-sdk');
			// AWS.config={ "accessKeyId": "AKIAI42OI74LLARR4DPQ", "secretAccessKey": "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", "region": "us-west-2" };

			let stepfunctions = new aws.StepFunctions();
			console.log(stepfunctions);
			let params = {
    			stateMachineArn: "arn:aws:states:us-west-2:932068603235:stateMachine:LambdaStateMachine",
    			input: JSON.stringify({ "emailID":  emailID})
  			};
			stepfunctions.startExecution(params, (err, data) => {
			console.log(params);
    		if (err) {
      // callback(err, null);
			res.status(500).json({error:err});
    		}

    		console.log(data);
 			res.status(200).json({message:"Your account has been verified!"});

    
  		});
	}
	
});



});

app.put ('/updateVerificationStatus' , (req, res) => {
	console.log('Inside');
	let emailID=req.body.emailID;
	// res.status(200).send({message:req.body});
	// res.status(200).send({"emailID":emailID});
	console.log(emailID);
	customerModel.update (
		{emailID:emailID},
			{
				$set:{
					"isVerified":true
				}
			},
		{
			upsert:false
		})
	.exec()
	.then ((response) => {
		console.log(response);
		res.status(200).send({message:"Your account has been verified"});
	})
	.catch((error) => {
		console.log(error);
		res.status(500).json({error:"INTERNAL_SERVER_ERROR"});

	});

});

app.listen(port, () => {

	console.log("Server started on port "+ port);
});