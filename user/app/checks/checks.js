import store from '../store/store.js';
// import {checkInit} from '../actions/initialLoadingActions.js';
import {hashHistory} from 'react-router';

// export function loginCheck () {

// 	store.dispatch(checkInit())
// 	.then((response) => {

// 		switch (response) {

// 			case 'SESSION_DOES_NOT_EXIST' : 
// 			case 'USER_NOT_LOGGED_IN' : 
// 										break;
// 			case 'USER_LOGGED_IN' : 
// 			if (store.getState().userInfo.type == 'ORGANIZATION') {

// 				hashHistory.push('org/events');

// 			} else {
// 				hashHistory.push('user/myposts');

// 			}
// 		}

// 	});


// }

// export function userCheck () {

// 	store.dispatch(checkInit())
// 	.then((response) => {

// 		switch (response) {

// 			case 'SESSION_DOES_NOT_EXIST' : 
// 			case 'USER_NOT_LOGGED_IN' : hashHistory.push ('login')
// 										break;
// 			case 'USER_LOGGED_IN' :
// 			if (store.getState().userInfo.type == 'ORGANIZATION') {

// 				hashHistory.push('org/events');

// 			}
// 			break;


// 		}

// 	});



// }


