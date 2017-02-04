let express = require('express');
let bodyParser = require('body-parser');
let expressJWT = require('express-jwt');
let jwt = require ('jsonwebtoken');
let path = require('path');
let app = express();
let mongoose = require ('mongoose');
let Schema = mongoose.Schema;

let {userModel} = require ('./models/users.js');

let {groceriesModel} = require ('./models/groceries.js');


const SECRET_KEY = "This is the secret key";


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.use (
	expressJWT ({secret: SECRET_KEY})
	.unless({path : ['/login', '/grocery'] }));


mongoose.connect('mongodb://localhost:27017/groceriesapp');


app.get ('/' , (req, res) => {

	res.json({status:"working"});


});

app.post ('/login' , (req, res) => {

	let myToken = jwt.sign ({userID: 1}, SECRET_KEY);
	res.status(200).json ({"status": myToken});

});

app.get ('/grocery', (req, res) => {
	
	// mongoose.model('groceries').find ((error, groceries) => {
	// 	res.json(groceries);
	// });
	groceriesModel.find ((error, groceries) => {

		res.json(groceries);

	});
});


app.listen(3000, () => {

	console.log("Server started on port 3000");
});
