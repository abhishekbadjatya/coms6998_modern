import initialState from '../../constants/initialState.js';
import actionConstants from '../../constants/actionConstants';
import _ from 'lodash';



const userInfo = (state = initialState.userInfo, action) => {

	switch (action.type) {

		case actionConstants.SET_USER_INFO : {

			return setUserInfo (state, action.payload);
		}

		default: 
		return state
	}



};



function setUserInfo (state, payload) {

	return Object.assign({}, state, payload);

}

export default userInfo;