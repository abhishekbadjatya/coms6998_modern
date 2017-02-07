import initialState from '../../constants/initialState.js';
import actionConstants from '../../constants/actionConstants';
import _ from 'lodash';



const notifConfig = (state = initialState.notifConfig, action) => {

	switch (action.type) {

		case actionConstants.ADD_NOTIFICATION : return Object.assign ({}, state, action.notifConfig);

		case actionConstants.SET_NOTIFICATION_TRIGGER_FLAG :
		return {...state, isTriggered : action.flag};
		break;
		

		default: 
		return state
	}



};

export default notifConfig;