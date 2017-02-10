import {connect} from 'react-redux';
import SignUpComponent from '../../components/SignUpComponent/SignUpComponent.js';
import {signUp} from '../../actions/initialLoadingActions.js';
import {triggerNotification} from '../../actions/notificationActions.js';
const mapStateToProps = (state) => {

	return {
	

	};
};

const mapDispatchToProps = (dispatch) => {

	return {

		"signUp" : (payload) => {

			dispatch(signUp (payload));
		},
		triggerNotification : (config) => {

			dispatch(triggerNotification(config));


		}

	};

};


export default connect(mapStateToProps, mapDispatchToProps)(SignUpComponent);
