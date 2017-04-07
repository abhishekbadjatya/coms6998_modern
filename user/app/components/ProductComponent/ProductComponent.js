import React from 'react';
import CSSModules from 'react-css-modules';
import ProductComponentStyles from './assets/ProductComponent.scss';
import StripeFormComponent from './StripeFormComponent/StripeFormComponent.js';
import {hashHistory} from 'react-router';
import _ from 'lodash';

class ProductComponent extends React.Component {

	constructor (props) {

		super(props);
		this.state = {
			selectedAccount: null
		};

		this.onChangeAccountHandler = this.onChangeAccountHandler.bind(this);


	}
	componentWillMount() {
		this.props.fetchGroceries();
		if (this.props.customerAccounts.length > 0) {
			this.setState({selectedAccount : this.props.customerAccounts[0]._id});
		}

		this.getUserPurchaseHistoryInterval = setInterval (this.props.getUserPurchaseHistory, 3000);

	}
	makeCustomerAccountsForm (customerAccounts) {

		return customerAccounts.map ((singleAccount, index) => {

			return (<option key = {singleAccount._id} value = {singleAccount._id}>{singleAccount.accountLabel}</option>);
		})
	}
	onChangeAccountHandler (e) {

		this.setState ({selectedAccount: e.target.value});

	}
	isThisProductAlreadyBought (productId, userPurchaseHistory) {

		let product = _.find (userPurchaseHistory, (singlePurchase) => {
			return singlePurchase.productID == productId;
		});

		return product;

	}

	getStatusText (productFromPurchaseHistory) {
		if (!productFromPurchaseHistory) {
			return null;
		}
		if (productFromPurchaseHistory.status == 'SUCCESS') {
			
			return (<div> Already purchased. </div>);
		
		} else if  (productFromPurchaseHistory.status == 'PENDING') {

			return (<div> Status Order is pending. </div>);
		
		}
	}


	render () {

		let {groceries, customerAccounts, userPurchaseHistory} =  this.props;
		let {productId} = this.props.params;


		let productName = null;
		let productPrice = null;

		groceries.map ((singleGrocery) => {

			if (singleGrocery.productId == productId) {
				productName = singleGrocery.productName;
				productPrice = singleGrocery.productPrice;

			}
		});

		let accountsForm = this.makeCustomerAccountsForm(customerAccounts);
		let productFromPurchaseHistory = this.isThisProductAlreadyBought (productId, userPurchaseHistory);
		let statusText = this.getStatusText (productFromPurchaseHistory);

		return (

			<div> 
				<h2> {productName} </h2>
				<div> Price :  {productPrice} </div>
				
				{
					(productFromPurchaseHistory) 

						?
							statusText
						:

					<div>
						<div> Choose an account to pay with </div>
						<select onChange ={this.onChangeAccountHandler}>
							{accountsForm}
						</select>
						<StripeFormComponent 
							createOrder = {this.props.createOrder} 
							price = {productPrice}
							groceryID = {productId}
							customerAccountID  = {this.state.selectedAccount}
						/>
					</div>



				}
			 </div>


			);
		

	}
}

export default CSSModules(ProductComponent, ProductComponentStyles, {allowMultiple:true});
