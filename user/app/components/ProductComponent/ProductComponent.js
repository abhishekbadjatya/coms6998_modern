import React from 'react';
import CSSModules from 'react-css-modules';
import ProductComponentStyles from './assets/ProductComponent.scss';

import StripeFormComponent from './StripeFormComponent/StripeFormComponent.js';


import {hashHistory} from 'react-router';
import _ from 'lodash';

class ProductComponent extends React.Component {

	constructor (props) {

		super(props);


	}
	componentWillMount() {
		this.props.fetchGroceries();
	}

	render () {

		let {groceries} =  this.props;
		let {productId} = this.props.params;

		let productName = null;
		let productPrice = null;

		groceries.map ((singleGrocery) => {

			if (singleGrocery.productId == productId) {
				productName = singleGrocery.productName;
				productPrice = singleGrocery.productPrice;

			}
		}) 
		return (

			<div> 
				<h2> {productName} </h2>
				<div> Price :  {productPrice} </div>
				<StripeFormComponent 
					createOrder = {this.props.createOrder} 
					price = {productPrice}
					groceryID = {productId}
				/>
			 </div>


			);
		

	}
}

export default CSSModules(ProductComponent, ProductComponentStyles, {allowMultiple:true});
