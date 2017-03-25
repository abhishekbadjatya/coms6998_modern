let mongoose = require ('mongoose');
let Schema = mongoose.Schema;

let accountSchema = new Schema ({

	accountType : Number,
	accountNumber : String,
	accountBalance : Number

});

account = mongoose.model ('account', accountSchema);

module.exports = account;