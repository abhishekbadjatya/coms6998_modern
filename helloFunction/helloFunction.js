var fetch = require('node-fetch');

exports.handler = (event, context, callback) => {
    
    //callback(null, "Hello, " + event.emailID + "!");
    fetch('http://usermicros1.xayrpvfvwr.us-west-2.elasticbeanstalk.com/updateVerificationStatus', { method: 'PUT', 
                                     body: JSON.stringify({emailID:event.emailID})
                })
    	.then(function(res) {
        return res.json();
    	})
    	.then(function (json){
    		console.log(json);
    	    context.succeed(json);  
    	})
};
