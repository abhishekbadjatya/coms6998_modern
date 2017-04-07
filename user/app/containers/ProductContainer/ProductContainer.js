import {connect} from 'react-redux';
import ProductComponent from '../../components/ProductComponent/ProductComponent.js';
import {fetchGroceries, createOrder, getUserPurchaseHistory} from '../../actions/initialLoadingActions.js';
import {triggerNotification} from '../../actions/notificationActions.js';
const mapStateToProps = (state) => {

	return {

		groceries: state.groceries,
		customerAccounts: state.customerAccounts,
		userPurchaseHistory : state.userPurchaseHistory
	

	};
};

const mapDispatchToProps = (dispatch) => {

	return {

		fetchGroceries : () => {

			dispatch(fetchGroceries());

		},
		createOrder : (object) => {


			dispatch(createOrder(object));
		},

		getUserPurchaseHistory : () => {
			dispatch(getUserPurchaseHistory());
		}


	};

};


export default connect(mapStateToProps, mapDispatchToProps)(ProductComponent);
