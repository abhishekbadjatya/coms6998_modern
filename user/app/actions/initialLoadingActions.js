import urlConstants from '../constants/urlConstants.js';
import {serialize} from '../util/util.js';
import actionConstants from '../constants/actionConstants.js';
import {hashHistory} from 'react-router';
import {triggerNotification} from './notificationActions.js';
import {kfetch} from '../util/util.js';
import {setFlags} from './flagActions.js';



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

export function fetchUserData () {

	return function (dispatch, getState) {

		kfetch (urlConstants.fetchUserData)
		.then ((response) => {

			return response.json();

		})
		.then((json) => {

			dispatch({
				
				type : actionConstants.SET_USER_INFO,
				payload : json
			
			});

			dispatch (setFlags({isUserDataFetched:true}));

		}).catch ((error) => {

			console.log(error);
		});

		
	};
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
				payload : json
			
			});

			dispatch (setFlags({isGroceryDetailsFetched:true}));




		}).catch ((error) => {

			console.log(error);
		});
	};
}
export function login (username, password) {


	return function (dispatch, getState) {

		

			kfetch(urlConstants.login, {

				method :'POST',
				body: JSON.stringify({username, password})
			}).then((response) => {
				return response.json();
			}).then((json)=> {



				if (!json.error) {

					localStorage.setItem('token',json.token);

					dispatch({
						type : actionConstants.SET_USER_INFO,
						payload : {userID: json.userID}
					});
					dispatch (setFlags({isLoggedIn:true}));


					hashHistory.push('dashboard');


				} else {

					if (json.error == "INCORRECT_PASSWORD") {

						dispatch (triggerNotification({
							message : 'Incorrect Crendentials',
							level: 'error'
						}));

					}
					if (json.error == "USER_DOES_NOT_EXIST") {

						dispatch (triggerNotification({
							message : 'Incorrect Crendentials',
							level: 'error'
						}));

					}
				}


			}).catch((error) => {

				console.log(error);

			});



		

		


	};


}


export function sendStripeToken (token, groceryID) {

	return function (dispatch, getState) {

		kfetch(urlConstants.sendStripeToken,{
			method :'POST',
			body: JSON.stringify({stripeToken:token, productID: groceryID})
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
