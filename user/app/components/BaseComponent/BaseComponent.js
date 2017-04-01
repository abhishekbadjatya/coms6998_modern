import React from 'react';
import CSSModules from 'react-css-modules';
import BaseStyle from './assets/BaseComponent.scss';
import NotificationSystem from 'react-notification-system';
import imageLogo from './assets/logos.png';


class BaseComponent extends React.Component {

	constructor (props) {

		super(props);
		
	}
	componentWillMount () {

		// this.props.fetchMetadata();
	}

	
	componentWillReceiveProps (nextProps) {

		if (this.props.notifConfig.isTriggered != nextProps.notifConfig.isTriggered) {

			if (nextProps.notifConfig.isTriggered) {

				this.notificationRef.addNotification({
						"level" : nextProps.notifConfig.level,
						"message" : nextProps.notifConfig.message
				});
			}
		}
	

		

	}

	render () {

		let {custName} = this.props.userInfo;

		let {isLoggedIn} = this.props.flags;

		return (
			<div >
				<div styleName = 'base-header'>
					<div styleName = 'logout-container'>
							{
								(isLoggedIn) ? 
									(	<span>
											
											<span styleName = 'welcome-text'>
												Welcome, {custName}.
											</span>
											<input type = 'button'  styleName = 'logout'
								 			onClick = {() => this.props.logout()} value = 'Logout'/>
							 			</span>
									)
									:
									(null)

							}
					</div>
				
				</div>
				<NotificationSystem ref={(ref) => this.notificationRef = ref} />

				<div styleName = 'children'>

					{this.props.children}

				</div>

			</div>



			);
		

	}
}

export default CSSModules(BaseComponent, BaseStyle,);
