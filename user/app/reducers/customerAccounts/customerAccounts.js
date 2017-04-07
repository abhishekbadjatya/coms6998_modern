import initialState from '../../constants/initialState.js';
import actionConstants from '../../constants/actionConstants';
import _ from 'lodash';



const flags = (state = initialState.customerAccounts, action) => {

	switch (action.type) {

		case actionConstants.SET_CUSTOMERACCOUNTS : {

			return setCustomerAccounts (state, action.payload);
		}

		default: 
		return state
	}



};
function setCustomerAccounts (state, payload) {


	state = _.slice(payload);
	return state;

}
export default flags;