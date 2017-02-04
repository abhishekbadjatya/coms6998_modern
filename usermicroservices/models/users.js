let mongoose = require ('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema ({

	name : String

});

module.exports = {

	usersModel : mongoose.model ('users', userSchema)

};
