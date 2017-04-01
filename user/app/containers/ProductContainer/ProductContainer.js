import {connect} from 'react-redux';
import ProductComponent from '../../components/ProductComponent/ProductComponent.js';
import {fetchGroceries, createOrder} from '../../actions/initialLoadingActions.js';
import {triggerNotification} from '../../actions/notificationActions.js';
const mapStateToProps = (state) => {

	return {

		groceries: state.groceries
	

	};
};

const mapDispatchToProps = (dispatch) => {

	return {

		fetchGroceries : () => {

			dispatch(fetchGroceries());

		},
		createOrder : (object) => {


			dispatch(createOrder(object));
			// let {token, groceryID} = stripeObject;
			// dispatch(sendStripeToken(token, groceryID));
			// dispatch(updateStatusOfGrocery(statusObject));
		}


	};

};


export default connect(mapStateToProps, mapDispatchToProps)(ProductComponent);
