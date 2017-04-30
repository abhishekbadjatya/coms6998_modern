var config = {}

config.MONGO_DB_CONNECTION_STRING="mongodb://apps:apps@ds143000.mlab.com:43000/product_db" 
config.BASE_URL_USER="http://localhost:3005/"
config.placeOrderARN = "arn:aws:sns:us-west-2:421142205754:createOrder"

config.AWS_config = {
  accessKeyId: 'AKIAII2PB7O2Q7W4A77A',
  secretAccessKey: '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',
  region: 'us-west-2'
}
	
module.exports = config;
