let initialState = () => {

	return {

		"userInfo" : {
			"custID" : null
		},
		"customerAccounts" : [],
		"userPurchaseHistory" : [],
		"notifConfig" : {
			
			isTriggered : false,
			level : null,
			message : null

		},
		flags : {
			"isLoggedInChecked" : false,
			"isLoggedIn" : false,
			"isUserDataFetched" : false,
			"isGroceryDetailsFetched" : false,
			"isCustomerAccountsFetched" : false
		},

		groceries : []

	};
}

export default initialState ();