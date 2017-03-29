let mongoose = require ('mongoose');
let Schema = mongoose.Schema;

let accountSchema = new Schema ({
	accountType : Number,
	accountBalance : Number
});

account = mongoose.model ('accounts', accountSchema);

module.exports = account;
