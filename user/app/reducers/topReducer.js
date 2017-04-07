import {combineReducers} from 'redux';
import userInfo from './userinfo/userInfo.js';
import notifConfig from './notifConfig/notifConfig.js';
import flags from './flags/flags.js';
import groceries from './groceries/groceries.js';
import customerAccounts from './customerAccounts/customerAccounts.js';
import userPurchaseHistory from './userPurchaseHistory/userPurchaseHistory.js';

export default combineReducers({

	userInfo,
	notifConfig,
	flags,
	groceries,
	customerAccounts,
	userPurchaseHistory

});


