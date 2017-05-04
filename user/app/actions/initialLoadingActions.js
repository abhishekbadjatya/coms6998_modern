import urlConstants from '../constants/urlConstants.js';
import {serialize} from '../util/util.js';
import actionConstants from '../constants/actionConstants.js';
import {hashHistory} from 'react-router';
import {triggerNotification} from './notificationActions.js';
import {kfetch} from '../util/util.js';
import {setFlags} from './flagActions.js';


export function fetchSingleCustomerInfo () {

	return (dispatch, getState) => {

		kfetch(urlConstants.singleCustomerInfo)
		.then((response) => {
			return response.json();
		}).then((json) => {
			dispatch({
				type : actionConstants.SET_USER_INFO,
				payload : json
			});
			dispatch (setFlags({isLoggedIn:true, isLoggedInChecked : true}));

			hashHistory.push('dashboard');
			
		}).catch((error) => {
			console.log(error);
		})

	};
}


export function getUserAccounts () {
	
	return function (dispatch, getState) {

		kfetch (urlConstants.customerAllAccounts).then((response) => {

			return response.json();
		}).then ((json) => {

			dispatch ({
				type : actionConstants.SET_CUSTOMERACCOUNTS,
				payload : json.account
			})


		}).catch ((error) => {

			console.log(error);
		})

	}
}

export function updateStatusOfGrocery (statusObject) {

	return function (dispatch, getState) {

		kfetch(urlConstants.addProductToUser,{
			method:'PUT',
			body : JSON.stringify({...statusObject})
		})
		.then((response) => {
			return response.json();
		})
		.then((json) => {


			console.log(json);
			dispatch({
			type : actionConstants.SET_SINGLE_GROCERY_INFO_FOR_USER,
			payload : statusObject
		})
		})
		.catch ((error) => {
			console.log(error)
		})
		


	}
}
export function checkInit () {

	return function (dispatch, getState) {

		if (!getState().userInfo.isLoggedInChecked) {

			return kfetch(urlConstants.init)
			.then((response) => {

				return response.json();

			}).then((json) => {

				dispatch ({

					'type' : actionConstants.SET_USER_INFO,
					payload: {isLoggedInChecked:true}
				});


				if (!json.error) {

					json.isLoggedIn = true;
					
					dispatch ({

						'type' : actionConstants.SET_USER_INFO,
						payload: json
					});


					return Promise.resolve('USER_LOGGED_IN');

				} else {
					if (json.error == 'SESSION_DOES_NOT_EXIST') {

						return Promise.resolve(json.error);
					}
				}


			});
		} else {

			if (getState().userInfo.isLoggedIn) {

				return Promise.resolve('USER_LOGGED_IN');
			} else {

				return Promise.resolve('USER_NOT_LOGGED_IN');

			}
		}




	}



}

export function fetchGroceries () {

	return function (dispatch, getState) {
		kfetch (urlConstants.fetchGroceries)
		.then ((response) => {

			return response.json();

		})
		.then((json) => {


			dispatch({
				
				type : actionConstants.SET_GROCERIES,
				payload : json.products
			
			});

			dispatch (setFlags({isGroceryDetailsFetched:true}));




		}).catch ((error) => {

			console.log(error);
		});
	};
}
export function login (emailID, password) {


	return function (dispatch, getState) {

			let responseStatus;

			kfetch(urlConstants.login, {

				method :'POST',
				body: JSON.stringify({emailID, password})
			}).then((response) => {
				let responseStatus = response.status;

				return response.json();
			}).then((json)=> {



				if (!json.error) {

					localStorage.setItem('token',json.token);

					dispatch({
						type : actionConstants.SET_USER_INFO,
						payload : json
					});
					dispatch (setFlags({isLoggedIn:true, isLoggedInChecked : true}));

					hashHistory.push('dashboard');


				} else {
					

					if (json.error.split(" ")[1] == "INCORRECT_CREDENTIALS") {

						dispatch (triggerNotification({
							message : 'Incorrect Crendentials',
							level: 'error'
						}));

					}
					if (json.error.split(" ")[1] == "USER_DOES_NOT_EXIST") {

						dispatch (triggerNotification({
							message : 'Incorrect Crendentials',
							level: 'error'
						}));

					}
					if (json.error.split(" ")[1] == 'USER_NOT_VERIFIED') {

						dispatch (triggerNotification({
							message : 'Please, verify the your email.',
							level: 'error'
						}));



					}
				}


			}).catch((error) => {
				dispatch (triggerNotification({
							message : 'Something isn\'t right.',
							level: 'error'
				}));

				console.log(error);

			});



		

		


	};


}


export function sendStripeToken (token, groceryID) {

	return function (dispatch, getState) {

		kfetch(urlConstants.sendStripeToken,{
			method :'POST',
			body: JSON.stringify({stripeToken:token.id, productID: groceryID})
		})
		.then((response) => {

			return response.json();
		})
		.then((json)=> {
			console.log(json);
		})
		.catch ((error) => {

			console.log(error);
		})
	}
}

export function signUp (payload)  {

	return function (dispatch, getState)  {

		payload.emailID = payload.username;
		payload.role = 'CUSTOMER';
		kfetch(urlConstants.signup, {

			method :'POST',
			headers: {
					'Content-Type': 'application/json'
			},
			body: JSON.stringify (payload)
		}).then((response) => {
			return response.json();
		}).then((json)=> {



			if (!json.error) {


				hashHistory.push('login');



			} else {
				if (json.error == "USER_EXISTS") {
					dispatch(triggerNotification({

						"level" : "error",
						"message" : "Username is taken"


					}));
				}
			}
			

		}).catch(() => {
			
		});



	}

}

export function createOrder (payload) {

	return function (dispatch, getState) {

		console.log(payload);

		let payloadToBeSent = {
		    "productID" : payload.productID,
		    "productPrice" : payload.productPrice,
		    "custID" : getState().userInfo.custID,
		    "accountNumber" : payload.accountNumber,
		    "stripeToken" : payload.token.id
		}


		kfetch(urlConstants.newOrder,{
			method :'POST',
			body: JSON.stringify(payloadToBeSent)
		})
		.then((response) => {

			return response.json();
		})
		.then((json)=> {
			console.log(json);
		})
		.catch ((error) => {

			console.log(error);
		})
	}
}

export function getUserPurchaseHistory () {

	return (dispatch, getState) => {

		kfetch (urlConstants.customerPurchaseHistory).then((response) => {

			return response.json();
		}).then ((json) => {

			dispatch ({
				type : actionConstants.SET_USER_PURCHASE_HISTORY,
				payload : json
			})


		}).catch ((error) => {

			console.log(error);
		})


	};
}



export function initialData () {

	return (dispatch, getState) => {

		dispatch (fetchSingleCustomerInfo());
		dispatch (fetchGroceries());
		dispatch (getUserAccounts());
		dispatch (getUserPurchaseHistory());

	}
}

export function logout () {
	console.log("Here");
	console.log(localStorage.getItem('token'));
	localStorage.removeItem('token');
	console.log(localStorage.getItem('token'));
	hashHistory.push('login');
	location.reload();

}