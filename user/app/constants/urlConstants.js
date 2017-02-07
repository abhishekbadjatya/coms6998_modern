

let urlConstants = () => {

	let baseUrl = "http://localhost:3000/"
	return {

		"login" : baseUrl + 'login',
		// "init" : baseUrl + 'api/getSession',
		// "signUp" : baseUrl + 'api/authz/signup',
		// "logout" : baseUrl + 'api/authz/logout',
		"fetchGroceries" : baseUrl + 'grocery',
		"fetchUserData" : baseUrl + 'user'
	};


};

export default urlConstants();