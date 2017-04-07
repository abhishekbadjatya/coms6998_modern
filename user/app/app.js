import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store  from './store/store.js';
import LoginContainer from './containers/LoginContainer/LoginContainer.js';
import BaseContainer from './containers/BaseContainer/BaseContainer.js';
import DashboardContainer from './containers/DashboardContainer/DashboardContainer.js';
import SignUpContainer from './containers/SignUpContainer/SignUpContainer.js';
import ProductContainer from './containers/ProductContainer/ProductContainer.js';

import {dashboardCheck} from './checks/checks.js';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import {Route, hashHistory, Router, IndexRedirect} from 'react-router';

ReactDOM.render(

	<Provider store = {store}>
		<Router history = {hashHistory} >
			<Route path = '/' component = {BaseContainer}  >
				<IndexRedirect to = '/login' />
				<Route path = 'login' component = {LoginContainer} />
				<Route onEnter = {dashboardCheck} path = 'dashboard' component = {DashboardContainer} />
				<Route path = 'product/:productId' component = {ProductContainer} />
				<Route path = "signUp" component = {SignUpContainer} />
			</Route>
		</Router>
	</Provider>
	,document.getElementById('app'));