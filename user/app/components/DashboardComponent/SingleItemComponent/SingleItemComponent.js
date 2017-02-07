import React from 'react';
import CSSModules from 'react-css-modules';
import SingleItemComponentStyle from './assets/SingleItemComponent.scss';


class SingleItemComponent extends React.Component {

	constructor (props) {

		super(props);
		
	}

	
	

	render () {
		let {name, price} = this.props;


		return (
			<div styleName = 'single-item'>
				<div> Item :  {name} </div>
				<div> Price : {price} </div>
				
			</div>
			);
	}
}

export default CSSModules(SingleItemComponent, SingleItemComponentStyle);
