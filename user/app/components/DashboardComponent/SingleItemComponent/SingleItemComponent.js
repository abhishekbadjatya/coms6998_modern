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
	render () {
		let {name, price, _id, alreadyBought} = this.props;


		return (
			<div>
				<div onClick = {() => this.onClickGrocery()} styleName = 'single-item'>
					<div> Item :  {name} </div>
					<div> Price : {price} </div>
					{
						(alreadyBought)?
						(<div> You have already purchased this item </div>)
							:
						(
							<StripeFormComponent 
							sendStripeToken = {this.props.sendStripeToken} 
							price = {price}
							groceryID = {_id}
						/>)
					}
					
					
				</div>
				
			</div>
			);
	}
}

export default CSSModules(SingleItemComponent, SingleItemComponentStyle);
