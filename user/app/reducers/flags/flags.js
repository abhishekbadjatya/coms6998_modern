import initialState from '../../constants/initialState.js';
import actionConstants from '../../constants/actionConstants';
import _ from 'lodash';



const flags = (state = initialState.flags, action) => {

	switch (action.type) {

		case actionConstants.SET_FLAGS :return setFlags(state, action);
							break;

		default: 
		return state
	}



};


function setFlags(state, action) {
	
	let {payload} = action;


	return {...state, ...payload};
}

export default flags;