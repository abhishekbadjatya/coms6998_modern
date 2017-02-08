import React from 'react';
import CSSModules from 'react-css-modules';
import SingleItemComponentStyle from './assets/SingleItemComponent.scss';

import StripeFormComponent from './StripeFormComponent/StripeFormComponent.js';


class SingleItemComponent extends React.Component {

	constructor (props) {

		super(props);
		this.state = {
			eventSelected : {},
			showDetailsModal : false
		};

		this.closeDetailsModal = this.closeDetailsModal.bind(this);
	}

	closeDetailsModal() {
		this.setState({showDetailsModal:false});
	}

	onClickGrocery () {

		this.setState ({
			showDetailsModal : true
		});
	}
	getComponentAccordingToStatus (status) {
		if (status == 'BOUGHT') {
			
			return (<div> You have already purchased this item. </div>);

		} else if  (status == 'PENDING') {
			return (<div> Purchase is being processed. </div>);

		} else {

			return (
				<StripeFormComponent 
					updateProductToStatusAndSendStripeToken = {this.props.updateProductToStatusAndSendStripeToken} 
					price = {this.props.price}
					groceryID = {this.props._id}
				/>
				);
		}
	}
	render () {
		let {name, price, _id, status} = this.props;
		let componentAccordingToStatus = this.getComponentAccordingToStatus(status);

		return (
			<div>
				<div onClick = {() => this.onClickGrocery()} styleName = 'single-item'>
					<div> Item :  {name} </div>
					<div> Price : {price} </div>
					
					{componentAccordingToStatus}
					
				</div>
				
			</div>
			);
	}
}

export default CSSModules(SingleItemComponent, SingleItemComponentStyle);
