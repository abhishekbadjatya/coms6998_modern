let mongoose = require ('mongoose');
let Schema = mongoose.Schema;

let customerAccountSchema = new Schema ({
	
	accountNumber : String,
	custID : String

});

cutomeraccount = mongoose.model ('customeraccount', customerAccountSchema);

module.exports = cutomeraccount;
