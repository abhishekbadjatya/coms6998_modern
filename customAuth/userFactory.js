let Customer = require ('./users/Customer.js');
let Admin = require ('./users/Admin.js');


let userFactory = function () {

};

userFactory.prototype.getObject = function (userObject) {

	switch (userObject.role) {
		case 'CUSTOMER' :
			return new Customer (userObject);
			break;
		case 'ADMIN' :
			return new Admin (userObject);
			break;
	}

};

module.exports = new userFactory();

