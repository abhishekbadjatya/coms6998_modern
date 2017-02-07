import {combineReducers} from 'redux';
import userInfo from './userinfo/userInfo.js';
import notifConfig from './notifConfig/notifConfig.js';
import flags from './flags/flags.js';
import groceries from './groceries/groceries.js';

export default combineReducers({

	userInfo,
	notifConfig,
	flags,
	groceries
});


