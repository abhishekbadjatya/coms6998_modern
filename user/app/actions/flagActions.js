import actionConstants from '../constants/actionConstants.js';

export function setFlags (payload) {

	return {

		type : actionConstants.SET_FLAGS,
		payload
	};
}