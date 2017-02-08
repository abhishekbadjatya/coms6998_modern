let express = require('express');
let bodyParser = require('body-parser');
let expressJWT = require('express-jwt');
let jwt = require ('jsonwebtoken');
let path = require('path');
let app = express();
let mongoose = require ('mongoose');
let Schema = mongoose.Schema;
let userModel = require ('./models/users.js');
let groceriesModel = require ('./models/groceries.js');
let cors = require('cors');
let _ = require('lodash');



const SECRET_KEY = "This is the secret key";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use (
	expressJWT ({secret: SECRET_KEY})
	.unless({path : ['/','/login','/signup', new RegExp('^/grocery/*', 'i'), new RegExp('/accountverification/*', 'i')] }));

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({error:"INVALID_TOKEN"});
  }
});


app.use(cors());

mongoose.connect('mongodb://localhost:27017/groceriesapp');
//mongoose.connect('mongodb://aastv:aastv@ds161038.mlab.com:61038/coms6998');
mongoose.Promise = global.Promise;



app.get ('/' , (req, res) => {

	res.json({status:"working"});


});

//This API name should be something else
app.get ('/user', (req, res) => {

	let {userID} = req.user;

	userModel.find({_id:userID}).exec()
	.then((users) => {

		if (users.length > 1) {
			return Promise.reject("MORE_THAN_ONE_USER");
		}
		if (users.length == 0) {
			
			res.status(400).json({error:"NO_USER"});
		} 

		let user = users[0];
		user.password = '';
		res.status(200).json(user);

		


	})
	.catch ((error) => {
		res.status(500).json({error:error});
	});






});

app.post ('/login' , (req, res) => {

	let {username, password} = req.body;

	userModel.find({username:username}).exec()
	.then((users) => {

		if (users.length > 1) {
			return Promise.reject("MORE_THAN_ONE_USER");
		}
		if (users.length == 0) {
			
			res.status(401).json({error:"INCORRECT_CREDENTIALS"});
		} 

		let user = users[0];

		if (user.password == password) {
			
			let myToken = jwt.sign ({userID: user._id}, SECRET_KEY);
			res.status(200).json({token:myToken, userID : user._id});

		} else {

			res.status(401).json({error:"INCORRECT_CREDENTIALS"});
		}


	})
	.catch ((error) => {
		res.status(500).json({error:error});
	});

});

app.get ('/grocery', (req, res) => {

	groceriesModel.find({}).exec()
	.then ((groceries) => {

		res.send(groceries);

	})
	.catch((error) => {

		res.status(500).send(error);
	});

});


let checkIfProductAlreadyExists = (user, groceryID) => {


	return _.find(user.groceriesBought, function(singleGrocery) { 

		return singleGrocery.id == groceryID 
	});

}

app.put('/user/grocery', (req,res) => {

	let {userID} = req.user;
	let {status,groceryID} = req.body;
	console.log(req.body);

	if (status == 'SUCCESS') {

		userModel.find({_id:userID}).exec()
		.then((users) => {

			if (!users.length) {
				return Promise.reject("NO_USER");
			}
			return userModel
			.update(
				{_id: userID},
				{ $pull: 
					{
						groceriesBought : {
							id: groceryID

						}
						
					} 
				} 
			)
			.exec()
			


		})
		.then((response) => {

			return userModel.update (
				{_id:userID}, 
				{
					$push:{
						groceriesBought: {id:groceryID, "status" : "BOUGHT"}
					}
				},
				{
					upsert:true
				})
				.exec()
		})
		.then((response) => {

			res.send({status:"added"});

		})
		.catch ((error) => {

			res.status(500).send(error);
		});




	} else if (status == 'FAILURE') {

		userModel
		.update(
			{_id: userID},
			{ $pull: 
				{
					groceriesBought : {
						id: groceryID,
						status : "PENDING"

					}
					
				} 
			} 
		)
		.exec()
		.then((response) => {

			res.send({response});

		})
		.catch ((error) => {

			res.status(500).send(error);
		});


	} else if (status == 'PENDING') {

		userModel
		.update (
			{_id:userID}, 
			{
				$push:{
					groceriesBought: {id:groceryID, "status" : "PENDING"}
				}
			},
			{
				upsert:true
			}
		)
		.exec()
		.then((response) => {

			res.send({status:"added"});

		})
		.catch ((error) => {

			res.status(500).send(error);
		});


	}


});

app.get ('/grocery/:id', (req, res) => {

	let groceryID = req.params.id;
	groceriesModel.findOne({"_id": groceryID}).exec()
	.then ((groceries) => {

		res.send(groceries);

	})
	.catch((error) => {

		res.status(500).send(error);
	});


});


app.listen(3000, () => {

	console.log("Server started on port 3000");
});



app.post ('/signup' , (req, res) => {
	console.log('Insidde');
	let {username, password} = req.body;
	console.log(username);

	userModel.find({username:username}).exec()
	.then((users) => {
		console.log("Here1");
		if (users.length >= 1) {
			res.status(401).json({error:"USER_EXISTS"});
		} 
    	return userModel({"username":username,"password":password,"isVerified":false}).save();
	})
	.then(function(data){
		//crypt=crypto.createCipher('aes256',SECRET_KEY);
		//let myToken =crypt.update(username,'utf8','hex')+crypt.final('hex');
		console.log("Here2")
		let myToken = jwt.sign({userID: username}, SECRET_KEY);
		console.log(myToken);
		res.status(200).json({token:myToken});
	})
	.catch ((error) => {
		res.status(500).json({error:error});
	});

});


app.post ('/accountverification/:code' , (req, res) => {

	let token = req.params.code;
	// let myToken = jwt.verify(token, SECRET_KEY);
	jwt.verify(token,SECRET_KEY,function(err,token){
		if(err){
			console.log('Error');
			res.status(500).json({error:"INVALID_TOKEN"});
		}
		else{
			console.log(token);
			let userID=token.userID;
			console.log(userID);
		userModel.update (
		{username:userID}, 
			{
				$push:{
					"isVerified":[true]
				}
			},
		{
			upsert:false
		})
	.exec()
	.then ((response) => {
		console.log(response);
		res.send(response);
	})
	.catch((error) => {
		console.log(error)
		res.status(500).json({error:error});

	});
	 	}
	});
});