let mongoose = require ('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema ({

	username : {
		type: String,
		unique: true
	},
	password : String,

	groceriesBought : Array


});

usersModel = mongoose.model ('users', userSchema);
module.exports = usersModel;