let mongoose = require ('mongoose');
let Schema = mongoose.Schema;

let customerSchema = new Schema ({

	emailID : {
		type: String,
		unique: true
	},
	password : String,

	custName: String,

	isVerified: Boolean

});

customerSchema.virtual('custID').get(function () {
  return this._id;
});

customerModel = mongoose.model ('customerInfo', customerSchema);
module.exports = customerModel;