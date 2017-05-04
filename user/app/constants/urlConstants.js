

let urlConstants = () => {

	let baseOrchestratorURL = "https://k0yo0m53qf.execute-api.us-west-2.amazonaws.com/prod/";
	return {

		"login" : baseOrchestratorURL + 'login',
		"signup" : baseOrchestratorURL + 'signup',
		"singleCustomerInfo" : baseOrchestratorURL + 'customer/self',
		"newOrder" : baseOrchestratorURL + 'order',
		"customerAllAccounts" : baseOrchestratorURL + 'account/self',
		"customerPurchaseHistory" : baseOrchestratorURL + 'customer/self/app',
		"fetchGroceries" : baseOrchestratorURL + 'app',
		"sendStripeToken" : baseOrchestratorURL + 'api/gateway/charge',
		"addProductToUser" : baseOrchestratorURL + 'user/grocery'
	};


};

export default urlConstants();