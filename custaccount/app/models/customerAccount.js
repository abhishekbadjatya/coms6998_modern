let mongoose = require ('mongoose');
let Schema = mongoose.Schema;

let customerAccountSchema = new Schema ({

	"accountNumber" : String,
	"custID" : String

});

var customeraccount = mongoose.model ('customeraccount', customerAccountSchema);

exports.customeraccountModel = customeraccount;
