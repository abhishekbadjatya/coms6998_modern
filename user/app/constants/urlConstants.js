

let urlConstants = () => {

	let baseOrchestratorURL = "https://k0yo0m53qf.execute-api.us-west-2.amazonaws.com/prod/";
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