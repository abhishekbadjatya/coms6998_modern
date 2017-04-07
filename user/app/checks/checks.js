import store from '../store/store.js';
import {fetchSingleCustomerInfo, getUserPurchaseHistory, getUserAccounts} from '../actions/initialLoadingActions.js';
import {hashHistory} from 'react-router';

export function dashboardCheck () {

	if (localStorage.getItem('token') && store.getState().flags.isLoggedIn && store.getState().flags.isLoggedInChecked) {

		console.log('all good');

	} else if ( localStorage.getItem('token') && (!store.getState().flags.isLoggedIn || !store.getState().flags.isLoggedInChecked ) ) {

		store.dispatch(fetchSingleCustomerInfo());
		store.dispatch(getUserAccounts());
		store.dispatch(getUserPurchaseHistory());

	} else {
		hashHistory.push('login');
	}
	


}



