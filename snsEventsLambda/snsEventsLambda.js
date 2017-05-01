'use strict';
let config = require ('./config.js');
let fetch = require ('node-fetch');
console.log('Loading function');

exports.handler = (event, context, callback) => {
    
    let data = JSON.parse(event.Records[0].Sns.Message);
    let Subject = event.Records[0].Sns.Subject;
    console.log(data)
    console.log(Subject);

    switch (Subject) {
    	case 'NEW_USER_SIGN_UP' :
    		console.log('here');
    		fetch (config.SLACK_WEBHOOK_URL, {
    			method : 'POST',
    			headers: {
    				'Content-type' : 'application/json'
    			},
    			body : JSON.stringify({text : 'A new user signed up with emailID - ' + data.emailID })
    		})
    		.then ((response) => {
    			return response.json ();
    		})
    		.then ((json) => {
    			console.log(json);
    		})
    		.catch ((err) => {
    			console.log(err);
    		});

    	break;
    }
    
    callback(null, event);  // Echo back the first key value
};
