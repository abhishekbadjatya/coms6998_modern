let initialState = () => {

	return {

		"userInfo" : {
			"userID" : null
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