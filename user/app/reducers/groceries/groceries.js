import initialState from '../../constants/initialState.js';
import actionConstants from '../../constants/actionConstants';
import _ from 'lodash';



const userInfo = (state = initialState.groceries, action) => {

	switch (action.type) {

		case actionConstants.SET_GROCERIES : {

			return setGroceryInfo (state, action.payload);
		}

		

		default: 
		return state
	}



};





function setGroceryInfo (state, payload) {


	state = _.slice(payload);
	return state;

}

export default userInfo;