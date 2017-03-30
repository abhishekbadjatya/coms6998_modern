let mongoose = require ('mongoose');
let Schema = mongoose.Schema;

let accountSchema = new mongoose.Schema ({
	"accountType" : Number,
	"accountBalance" : Number
});

var account = mongoose.model('accounts', accountSchema);

exports.accountModel = account;