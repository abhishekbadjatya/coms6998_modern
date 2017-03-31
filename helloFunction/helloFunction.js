var fetch = require('node-fetch');

exports.handler = (event, context, callback) => {
    
    //callback(null, "Hello, " + event.emailID + "!");
    console.log("received event");
    console.log(event);
    var emailID=event.emailID;
    // context.succeed(emailID);
    fetch('http://usermicroservices-dev.us-west-2.elasticbeanstalk.com//updateVerificationStatus', { method: 'PUT', 
                                     headers : {"Content-type":"application/json"},
                                     body: JSON.stringify({"emailID":event.emailID})})
        .then(function(res) {
           // console.log(res);
        return res.json();
        })
        .then(function (json){
            console.log(json);
            context.succeed(json);  
        })
        .catch(function(err){
            console.log("Inside error");
           console.log(err); 
        });
};
