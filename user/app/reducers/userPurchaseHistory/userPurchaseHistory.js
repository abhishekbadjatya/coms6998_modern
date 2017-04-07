import initialState from '../../constants/initialState.js';
import actionConstants from '../../constants/actionConstants';
import _ from 'lodash';



const flags = (state = initialState.userPurchaseHistory, action) => {

	switch (action.type) {

		case actionConstants.SET_USER_PURCHASE_HISTORY : {

			return setuserPurchaseHistory (state, action.payload);
		}

		default: 
		return state
	}



};
function setuserPurchaseHistory (state, payload) {


	state = _.slice(payload);
	return state;

}
export default flags;