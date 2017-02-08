import {connect} from 'react-redux';
import DashboardComponent from '../../components/DashboardComponent/DashboardComponent.js';
import {fetchGroceries, fetchUserData, sendStripeToken, updateStatusOfGrocery} from '../../actions/initialLoadingActions.js';

const mapStateToProps = (state) => {
	return {

		"flags" : state.flags,
		"groceries" : state.groceries,
		"userInfo" : state.userInfo

	};
};

const mapDispatchToProps = (dispatch) => {

	return {

		fetchGroceries : () => {

			dispatch(fetchGroceries());

		},
		fetchUserData : () => {

			dispatch (fetchUserData());
		},

		updateProductToStatusAndSendStripeToken : (statusObject, stripeObject) => {

			let {token, groceryID} = stripeObject;
			dispatch(sendStripeToken(token, groceryID));
			dispatch(updateStatusOfGrocery(statusObject));
		}


	};

};


export default connect(mapStateToProps, mapDispatchToProps)(DashboardComponent);
