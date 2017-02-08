import React from 'react';
import CSSModules from 'react-css-modules';
import StripeFormComponentStyle from './assets/StripeFormComponent.scss';
import StripeCheckout from 'react-stripe-checkout';


class StripeFormComponent extends React.Component {

	constructor (props) {

		super(props);
		
	}
	onToken = (token) => {
	    this.props.updateProductToStatusAndSendStripeToken (
	    	{status:"PENDING", groceryID: this.props.groceryID},
	    	{token:token, groceryID: this.props.groceryID}
	    );
	    
	}

	
	

	render () {

		return (
			<StripeCheckout
			amount={this.props.price*100}
  			currency="USD"
		    token={this.onToken}
		    stripeKey="pk_test_iBSEwt5yCIyYuHrpbRZJCUBQ"
		    />
		);
	}
}

export default CSSModules(StripeFormComponent, StripeFormComponentStyle);