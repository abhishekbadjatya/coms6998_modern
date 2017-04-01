let initialState = () => {

	return {

		"userInfo" : {
			"custID" : null
		},
		"notifConfig" : {
			
			isTriggered : false,
			level : null,
			message : null

		},
		flags : {
			"isLoggedInChecked" : false,
			"isLoggedIn" : false,
			"isUserDataFetched" : false,
			"isGroceryDetailsFetched" : false
		},

		groceries : []

	};
}

export default initialState ();