import React from 'react';
import CSSModules from 'react-css-modules';
import DashboardComponentStyle from './assets/DashboardComponent.scss';
// import SingleItemComponent from './SingleItemComponent/SingleItemComponent.js';
import {hashHistory} from 'react-router';

class DashboardComponent extends React.Component {

	constructor (props) {

		super(props);
		this.groceriesBoughtHash = {};
		
	}

	componentWillMount () {

		// this.props.fetchUserData();
		this.props.fetchGroceries();

		// this.intervalID = setInterval( ()=>{
			
		// 	this.props.fetchUserData();
		// 	this.props.fetchGroceries();

		// }, 15000);

	}

	// getAllGroceriesView (groceries) {

	// 	return groceries.map ((singleGrocery) => {

	// 		return (
	// 			<SingleItemComponent
	// 			status = { this.getStatus(singleGrocery._id)}
	// 			updateProductToStatusAndSendStripeToken = {this.props.updateProductToStatusAndSendStripeToken} 
	// 			key = {singleGrocery._id} {...singleGrocery} />
	// 		);

	// 	});
	// }

	getStatus (id)  {
		if (this.groceriesBoughtHash[id]) {
			return this.groceriesBoughtHash[id].status;
		} else {

			return "not bought";

		}
	}

	setGroceriesBoughtHash (groceriesBought) {
		this.groceriesBoughtHash = {};

			
		groceriesBought.map ((singleGroceryBought) => {

				this.groceriesBoughtHash[singleGroceryBought.id] = singleGroceryBought;
		});

		


	}

	componentWillUnMount () {
		clearInterval(this.intervalID);
	}

	onClickAnApp (productId) {

		hashHistory.push ('product/' + productId);
	}
	getAllGroceriesView (groceries) {

		return groceries.map ((singleGrocery) => {

			return (
				<div key = {singleGrocery.productId} onClick = {() => this.onClickAnApp(singleGrocery.productId) } > {singleGrocery.productName}</div>
				);
		})

	}

	render () {

		let {groceries} = this.props;

		let allGroceriesView = this.getAllGroceriesView (groceries);

		return (
			<div> {allGroceriesView} </div>
			);

		
	}
}

export default CSSModules(DashboardComponent, DashboardComponentStyle);
