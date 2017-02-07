import React from 'react';
import CSSModules from 'react-css-modules';
import DashboardComponentStyle from './assets/DashboardComponent.scss';
import SingleItemComponent from './SingleItemComponent/SingleItemComponent.js';


class DashboardComponent extends React.Component {

	constructor (props) {

		super(props);
		this.groceriesBoughtHash = {};
		
	}

	componentWillMount () {

		this.props.fetchUserData();
		this.props.fetchGroceries();
		this.intervalID = setInterval( ()=>{
			
			this.props.fetchUserData();
			this.props.fetchGroceries();

		}, 15000);

	}

	getAllGroceriesView (groceries) {

		return groceries.map ((singleGrocery) => {

			return (
				<SingleItemComponent
				status = { this.getStatus(singleGrocery._id)}
				sendStripeToken = {this.props.sendStripeToken} 
				key = {singleGrocery._id} {...singleGrocery} />
			);

		});
	}

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

	render () {

		let {isUserDataFetched,isGroceryDetailsFetched} = this.props.flags;

		

		if (!isUserDataFetched && !isGroceryDetailsFetched) {

			return (
					<div>
						Loading..
					</div>
				);
		} else {
			this.setGroceriesBoughtHash(this.props.userInfo.groceriesBought);

			let allGroceriesView = this.getAllGroceriesView (this.props.groceries);
			

			return (
				<div>

					{allGroceriesView}
					
				</div>
				);


		}

		
	}
}

export default CSSModules(DashboardComponent, DashboardComponentStyle);
