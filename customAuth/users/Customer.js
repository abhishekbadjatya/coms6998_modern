let fetch = require ('node-fetch');
let config = require ('../config.js');

let anyofTheAll = function (http_method) {

	if (http_method == 'GET' || http_method == 'POST' || http_method == 'OPTIONS'|| http_method == 'PUT' || http_method == 'DELETE') {
		return true;
	} else {
		return false;
	}
}

class Customer {
	constructor (userObject) {
		this.custID = userObject.custID;
	}

	getCustID () {
		return this.custID;
	}

	isAllowed (resourceDetails) {

		let {http_method, resource_path, resource_instance} = resourceDetails;

		switch (resource_path) {

			case 'customer' :
				if ( (resource_instance == 'self' || resource_instance == this.custID) && anyofTheAll(http_method)) {
					return  Promise.resolve('allow');
				} else {
					return  Promise.resolve('deny');
				}

				break;
			case 'order' :
				if (!resource_instance && http_method == 'POST') {
					return Promise.resolve('allow');
				} else if ( resource_instance && anyofTheAll(http_method) ) {
					
					return fetch (config.ORDERMICROSERVICE + 'order/' + resource_instance)
					.then((response) => {
						return response.json();
					})
					.then((json) => {
						if (json.customer_id == this.custID ) {

							return Promise.resolve ('allow')
						} else {

							return Promise.resolve('deny'); 
						}
					})
					.catch ((err) => {
						console.log(err);
						return Promise.resolve('deny');
					})
				
				} else {
					return Promise.resolve ('deny');
				}

				break;
			case 'app' :
				if ( http_method == 'GET' ) {
					return Promise.resolve ('allow');
				} else {
					return Promise.resolve ('deny');
				}
				break;
			case 'account' :
				if (!resource_instance && http_method == 'POST') {
					return Promise.resolve('allow');


				} else if ( resource_instance == 'self' && anyofTheAll(http_method) ) {

					return Promise.resolve ('allow');


				} else {
					return Promise.resolve ('deny');
				}
				break;


		}

	}
}

module.exports = Customer;