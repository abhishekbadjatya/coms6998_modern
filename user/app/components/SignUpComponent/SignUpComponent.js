import React from 'react';
import CSSModules from 'react-css-modules';
import SignUpComponentStyles from './assets/SignUpComponent.scss';
import {hashHistory} from 'react-router';
import _ from 'lodash';

class SignUpComponent extends React.Component {

	constructor (props) {

		super(props);
		this._handleKeyPress = this._handleKeyPress.bind(this);
		this.onClickOfSignUButton = this.onClickOfSignUButton.bind(this);
		this.state = {
			checked: "PERSON"
		}

	}

	_handleKeyPress (e) {

		if (e.key === 'Enter') {
			this.onClickOfSignUButton();
		}
	}

	onClickTypeChangeHandler (e) {

		this.setState({
			checked : e.target.value
		})
	}
	
	onClickOfSignUButton () {

		if (!this.usernameRefSave.value || !this.passwordRefSave.value || !this.passwordCopyRefSave.value) {

			this.props.triggerNotification({

				"level" : "error",
				"message" : "Please, fill out all fields."


			});
			return

		}
		if (_.trim(this.usernameRefSave.value) !=  this.usernameRefSave.value) {

			this.props.triggerNotification({

				"level" : "error",
				"message" : "Username can't have leading or trailing spaces."


			});
			return

		}

		if (this.passwordCopyRefSave.value != this.passwordRefSave.value) {
			this.props.triggerNotification ({

				"level" : "error",
				"message" : "Passwords don't match."
			});
			return
		}

		if (!_.trim(this.passwordRefSave.value)) {

			this.props.triggerNotification({

				"level" : "error",
				"message" : "Password can't be all spaces."


			});
			return

		}



		
		this.props.signUp({

			username : this.usernameRefSave.value,
			password : this.passwordRefSave.value
		});
		
	}

	render () {
		return (

			<div>

				<div styleName="form">
					<div id="login">   
			          <h1 styleName ='welcome-back-text'>Welcome to goVolunteer!</h1>
			          
			          <form>
			          
				        <div styleName="field-wrap">
				            <label styleName='labels-input'>
				              Email Address<span styleName="req" >*</span>
				            </label>
							<input type='text'
								styleName='text-fields' autoComplete={'off'} 
								ref = {(ref) => this.usernameRefSave = ref} 
								onKeyPress = {this._handleKeyPress} />


				        </div>
				       
				        <div styleName="field-wrap">
				            <label styleName='labels-input'>
				              Password<span styleName="req" >*</span>
				            </label>
				            <input 
				            styleName='text-fields' autoComplete={'off'}
				            type ='password' 
						 	ref = {(ref) => this.passwordRefSave = ref}
					 		onKeyPress = {this._handleKeyPress} />


				        </div>
				        <div styleName="field-wrap">
				            <label styleName='labels-input'>
				              Re-type Password<span styleName="req" >*</span>
				            </label>
					 		<input type ='password' 
					 		styleName='text-fields' autoComplete={'off'}
						 	ref = {(ref) => this.passwordCopyRefSave = ref}
					 		onKeyPress = {this._handleKeyPress} />


				        </div>
				        
				          
				        
				          <div styleName = 'gap'>
					          
					          <input type = 'button' onClick = {this.onClickOfSignUButton}
				  				styleName="button button-block" value = 'Sign Up' />
				          </div>
				          <div styleName = 'gap'>
							
							<input styleName = 'button button-block' type = 'button' onClick = {()=> hashHistory.push('login')}
				  			value = 'Already a User' />
							</div>
			          </form>

			        </div>
			      
				</div> 
							


			</div>


			);
		

	}
}

export default CSSModules(SignUpComponent, SignUpComponentStyles, {allowMultiple:true});
