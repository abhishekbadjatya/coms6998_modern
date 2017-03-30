var config=require('./config.js');
var dao = require('./mongo_connect.js');
var express = require('express');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
console.log('test')
var productModel = dao.productModel;

app.post('/api/insertproducts', function(req, res) {
	dao.connectToDB();
	var productName = req.body.productName;
	var productPrice = req.body.productPrice;
	console.log(productName)
	console.log(productPrice)

	var temp = productModel({productName: productName, productPrice: productPrice}).save(function(err){
	if (err) throw err;
	console.log('item saved')
	})
	dao.disConnectFromDB();
	res.send('Inserting Product '+productName);
})

app.put('/api/putproducts', function(req, res) {

	var productID = req.body.productID;
	console.log(productID)

	res.send('Put Product');
})

app.delete('/api/deleteproduct', function(req, res) {

	var productID = req.body.productID;
	console.log(productID)

	res.send('Deleting Product');
})


app.get('/api/getproducts', function(req, res) {

	/*var productID = req.body.productID;
	console.log("Saving product... ")
	
	var product_data = [{productID: 1, productName: 'app1', productPrice: 5},{productID: 2, productName: 'app2', productPrice: 3.99}]
	res.status(200).send(product_data)
	*/
	dao.connectToDB();
	console.log("getproducts")
	productModel.find({}).exec()
	.then ((product_data) => {
		console.log(product_data)
		res.status(200).send(product_data);

	})
	.catch((error) => {
		console.log(error);
		res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
	});
	dao.disConnectFromDB();


})

app.get('/api/getproducts/:id', function(req, res) {

	dao.connectToDB();
	let productID = req.params.id;
	console.log(productID);
	productModel.findOne({"_id": productID})
	.then ((product_data) => {
		console.log(product_data);
		res.status(200).send(product_data);

	})
	.catch((error) => {
		console.log(error)
		res.status(500).send({error:"INTERNAL_SERVER_ERROR"});
	});

	dao.disConnectFromDB();


})

app.get('/',(req,res) =>{
res.status(200).json({message:"Hello"});
});

app.use(express.static(__dirname));
app.listen(process.env.PORT||3000, () => {

	console.log("Server started on port 3000");
});
