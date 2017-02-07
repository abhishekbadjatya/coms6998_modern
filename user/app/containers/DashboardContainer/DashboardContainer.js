import {connect} from 'react-redux';
import DashboardComponent from '../../components/DashboardComponent/DashboardComponent.js';
import {fetchGroceries, fetchUserData, sendStripeToken} from '../../actions/initialLoadingActions.js';

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

		sendStripeToken : (token, groceryID) => {

			dispatch(sendStripeToken(token, groceryID));
		}

	};

};


export default connect(mapStateToProps, mapDispatchToProps)(DashboardComponent);
