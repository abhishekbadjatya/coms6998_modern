let mongoose = require ('mongoose');
let Schema = mongoose.Schema;

let grocerySchema = new Schema ({

	name : String

});

groceriesModel = mongoose.model ('groceries', grocerySchema);

module.exports = {groceriesModel};
