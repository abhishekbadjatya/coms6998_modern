var config = {}

config.MONGO_DB_CONNECTION_STRING="mongodb://apps:apps@ds143000.mlab.com:43000/product_db" 
config.BASE_URL_USER="http://localhost:3005/"
config.placeOrderARN = "arn:aws:sns:us-east-1:219375999692:placeOrder"

config.AWS_config = {
  accessKeyId: 'AKIAJIBCPJ5HGWIBWLGA',
  secretAccessKey: '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',
  region: 'us-east-1'
}
	
module.exports = config;
