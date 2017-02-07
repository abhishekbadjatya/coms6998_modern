

let urlConstants = () => {

	let baseUrlUserMicroservice = "http://localhost:3000/";
	let baseUrlGatewayMicroservice = "http://localhost:3002/"
	return {

		"login" : baseUrlUserMicroservice + 'login',
		"fetchGroceries" : baseUrlUserMicroservice + 'grocery',
		"fetchUserData" : baseUrlUserMicroservice + 'user',
		"sendStripeToken" : baseUrlGatewayMicroservice + 'api/gateway/charge'
	};


};

export default urlConstants();