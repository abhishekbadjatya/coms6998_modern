class Admin {
	constructor (userObject) {
		this.AdminID = userObject.AdminID;
		let accessRules = {};
		userObject.accessRules.map ((singleAccessRule) => {
			accessRules[singleAccessRule.resource] = singleAccessRule.operation
		});
		this.accessRules = accessRules
	}

	getAdminID () {
		return this.AdminID;
	}

	isAllowed (resourceDetails) {

		let {http_method, resource_path, resource_instance} = resourceDetails;

		switch (resource_path) {

			case 'customer' :
				if (this.accessRules['customer'].indexOf(http_method) > -1) {
					return  Promise.resolve('allow');	
				} else {
					return Promise.resolve ('deny');
				}
				

				break;
			case 'order' :
				if (this.accessRules['order'].indexOf(http_method) > -1) {
					return  Promise.resolve('allow');	
				} else {
					return Promise.resolve ('deny');
				}
				
				break;
			case 'app' :
				if (this.accessRules['app'].indexOf(http_method) > -1) {
					return  Promise.resolve('allow');	
				} else {
					return Promise.resolve ('deny');
				}
				
				break;
			case 'account' :
				if (this.accessRules['account'].indexOf(http_method) > -1) {
					return  Promise.resolve('allow');	
				} else {
					return Promise.resolve ('deny');
				}
				
				break;
			default :
				return Promise.resolve('deny');


		}

	}
}

module.exports = Admin;