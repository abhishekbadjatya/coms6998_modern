

let urlConstants = () => {

	let baseOrchestratorURL = "";
	return {

		"login" : baseOrchestratorURL + 'login',
		"signup" : baseOrchestratorURL + 'signup',
		"singleCustomerInfo" : baseOrchestratorURL + 'customer/single',
		"getCustomerAllPurchases" : baseOrchestratorURL + 'customer/app',
		"newOrder" : baseOrchestratorURL + 'order',
		"fetchGroceries" : baseOrchestratorURL + 'app',
		"fetchUserData" : baseOrchestratorURL + 'user',
		"sendStripeToken" : baseOrchestratorURL + 'api/gateway/charge',
		"addProductToUser" : baseOrchestratorURL + 'user/grocery'
	};


};

export default urlConstants();