import React from 'react';
import CSSModules from 'react-css-modules';
import LoginStyle from './assets/LoginComponent.scss';
import {hashHistory} from 'react-router';
import _ from 'lodash';


class LoginComponent extends React.Component {

	constructor (props) {

		super(props);
		this._handleKeyPress = this._handleKeyPress.bind(this);
		this.onClickOfLoginButton = this.onClickOfLoginButton.bind(this);
		this.usernameRefSave = this.usernameRefSave.bind(this);
		this.passwordRefSave = this.passwordRefSave.bind(this);
		this.onClickOfGoToSignUp = this.onClickOfGoToSignUp.bind(this);
	}

	onClickOfGoToSignUp () {

		hashHistory.push('signUp');

	}

	_handleKeyPress (e) {

		if (e.key === 'Enter') {
			this.onClickOfLoginButton();
		}
	}
	usernameRefSave(ref) {
		this.usernameRef = ref;
	}


	passwordRefSave (ref) {
		this.passwordRef = ref;
	}
	onClickOfLoginButton () {
		let username = this.usernameRef.value; 
		let password = this.passwordRef.value;


		if (!username || !password) {

			this.props.triggerNotification({
				level : 'error',
				message : 'Please fill out all fields.'

			});

			return;

		}

		if (_.trim(username) !=  username) {

			this.props.triggerNotification({
				level : 'error',
				message : "No leading or trailing spaces in username"

			});

			return;

		}


		let {login} = this.props;
		login (username, password);

		
		
	}

	render () {
		let {isLoggedInChecked} = this.props.flags;
		// if (!isLoggedInChecked) {

		// 	return (
		// 		<div>
		// 			Loading..
		// 		</div>

		// 		);
		// }

		return (
			<div>

				<div styleName="form">
					<div id="login">   
			          <h1 styleName ='welcome-back-text'>Welcome Back!</h1>
			          
			          <form>
			          
				        <div styleName="field-wrap">
				            <label styleName='labels-input'>
				              Email Address<span styleName="req" >*</span>
				            </label>
				            	<input styleName='text-fields' autoComplete={'off'}
				            	type='text' 
								ref = {this.usernameRefSave} 
								onKeyPress = {this._handleKeyPress} />


				        </div>
				          
				        <div styleName="field-wrap">
				            <label styleName='labels-input'>
				              Password<span styleName="req" >*</span>
				            </label>
				            	<input 
				            	styleName='text-fields' autoComplete={'off'}
				            	type ='password' 
								ref = {this.passwordRefSave}
							 	onKeyPress = {this._handleKeyPress} />

				        </div>
				        <div styleName='gap-up'>
				          <div styleName = 'gap'>
					          <input type = 'button' onClick = {this.onClickOfLoginButton}
					          styleName="button button-block" value = 'Log In'/>
				          </div>
				          <div styleName = 'gap'>

					          <input styleName = 'new-user' type = 'button' onClick = {this.onClickOfGoToSignUp}
								styleName="button button-block" value = 'New User' />
							</div>
						</div>
			          </form>

			        </div>
			      
				</div> 
							

				
			</div>



			);
		

	}
}

export default CSSModules(LoginComponent, LoginStyle, {allowMultiple:true});
