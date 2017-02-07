import actionConstants from '../constants/actionConstants';

export function addNotification (notifConfig) {
	return {
		type : actionConstants.ADD_NOTIFICATION,
		notifConfig
	};
}

export function setTriggerNotification (flag) {

	return {

		type: actionConstants.SET_NOTIFICATION_TRIGGER_FLAG,
		flag

	};
}


export function triggerNotification (notifConfig) {

	return function (dispatch, getState) {


		dispatch(addNotification(notifConfig));
		dispatch(setTriggerNotification (true));
		setTimeout(()=>{

			dispatch(setTriggerNotification(false));
			//TODO- HACK FIX IT.

		}, 500);
		
	};
}