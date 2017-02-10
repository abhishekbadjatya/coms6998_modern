import {connect} from 'react-redux';
import BaseComponent from '../../components/BaseComponent/BaseComponent.js';
import {logout} from '../../actions/initialLoadingActions.js';

const mapStateToProps = (state) => {
	//console.log(state);
	return {
		userInfo : state.userInfo,
		notifConfig : state.notifConfig,
		flags: state.flags
	};
};

const mapDispatchToProps = (dispatch) => {

	return {

		logout : () => {

			dispatch(logout());


		}
		// fetchMetadata: () => {
		// 		dispatch(fetchMetadata());
		// }

	};

};


export default connect(mapStateToProps, mapDispatchToProps)(BaseComponent);
