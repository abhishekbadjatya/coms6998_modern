class Admin {
	constructor (userObject) {
		this.AdminID = userObject.AdminID;
	}

	getAdminID () {
		return this.AdminID;
	}
}

module.exports = Admin;