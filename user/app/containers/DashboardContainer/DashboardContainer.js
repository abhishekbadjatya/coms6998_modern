import {connect} from 'react-redux';
import DashboardComponent from '../../components/DashboardComponent/DashboardComponent.js';
import {fetchGroceries, fetchUserData} from '../../actions/initialLoadingActions.js';

const mapStateToProps = (state) => {
	return {

		"flags" : state.flags,
		"groceries" : state.groceries

	};
};

const mapDispatchToProps = (dispatch) => {

	return {

		fetchGroceries : () => {

			dispatch(fetchGroceries());

		},
		fetchUserData : () => {

			dispatch (fetchUserData());
		}

	};

};


export default connect(mapStateToProps, mapDispatchToProps)(DashboardComponent);
