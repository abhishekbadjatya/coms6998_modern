import initialState from '../../constants/initialState.js';
import actionConstants from '../../constants/actionConstants';
import _ from 'lodash';



const userInfo = (state = initialState.userInfo, action) => {

	switch (action.type) {

		case actionConstants.SET_USER_INFO : {

			return setUserInfo (state, action.payload);
		}

		case actionConstants.SET_SINGLE_GROCERY_INFO_FOR_USER : {
			return setSingleGroceryInfo (state, action.payload);
		}


		default: 
		return state
	}



};

function setSingleGroceryInfo (state, payload)  {
	let newGroceriesBought = _.slice(state.groceriesBought);
	newGroceriesBought.push({id:payload.groceryID, status:"PENDING"});
	
	return Object.assign({},{...state}, {groceriesBought:newGroceriesBought});
}


function setUserInfo (state, payload) {

	return Object.assign({}, state, payload);

}

export default userInfo;