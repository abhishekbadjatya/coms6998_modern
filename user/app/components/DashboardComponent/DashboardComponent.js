import React from 'react';
import CSSModules from 'react-css-modules';
import DashboardComponentStyle from './assets/DashboardComponent.scss';
import SingleItemComponent from './SingleItemComponent/SingleItemComponent.js';


class DashboardComponent extends React.Component {

	constructor (props) {

		super(props);
		
	}

	componentWillMount () {

		this.props.fetchUserData();
		this.props.fetchGroceries();

	}

	getAllGroceriesView (groceries) {

		return groceries.map ((singleGrocery) => {

			return (<SingleItemComponent key = {singleGrocery._id} {...singleGrocery} />)

		});
	}


	render () {

		let {isUserDataFetched,isGroceryDetailsFetched} = this.props.flags;

		if (!isUserDataFetched && !isGroceryDetailsFetched) {

			return (
				<div>
					Loading..
				</div>);
		}

		let allGroceriesView = this.getAllGroceriesView (this.props.groceries);

		return (
			<div>

				{allGroceriesView}
				
			</div>
			);
	}
}

export default CSSModules(DashboardComponent, DashboardComponentStyle);
