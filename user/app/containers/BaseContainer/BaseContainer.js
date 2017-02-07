import {connect} from 'react-redux';
import BaseComponent from '../../components/BaseComponent/BaseComponent.js';
// import {logout, fetchMetadata} from '../../actions/initialLoadingActions.js';

const mapStateToProps = (state) => {
	return {
		userInfo : state.userInfo,
		notifConfig : state.notifConfig
	};
};

const mapDispatchToProps = (dispatch) => {

	return {

		// logout : () => {

		// 	dispatch(logout());


		// },
		// fetchMetadata: () => {
		// 		dispatch(fetchMetadata());
		// }

	};

};


export default connect(mapStateToProps, mapDispatchToProps)(BaseComponent);
