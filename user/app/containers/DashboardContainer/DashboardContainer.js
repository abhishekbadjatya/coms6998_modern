import {connect} from 'react-redux';
import DashboardComponent from '../../components/DashboardComponent/DashboardComponent.js';
import {initialData, sendStripeToken, updateStatusOfGrocery} from '../../actions/initialLoadingActions.js';

const mapStateToProps = (state) => {
	return {

		"flags" : state.flags,
		"groceries" : state.groceries,
		"userInfo" : state.userInfo

	};
};

const mapDispatchToProps = (dispatch) => {

	return {

		initialData : () => {

			dispatch(initialData());

		},

		updateProductToStatusAndSendStripeToken : (statusObject, stripeObject) => {

			let {token, groceryID} = stripeObject;
			dispatch(sendStripeToken(token, groceryID));
			dispatch(updateStatusOfGrocery(statusObject));
		}


	};

};


export default connect(mapStateToProps, mapDispatchToProps)(DashboardComponent);
