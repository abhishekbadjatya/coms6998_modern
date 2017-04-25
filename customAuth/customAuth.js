let util = require('./utils.js');
let userFactory = require ('./userFactory.js');
let fetch = require ('node-fetch');
let config = require ('./config.js');

exports.handler =  (event, context, callback) => {
    
    var token = event.authorizationToken;
    let principalId;
    fetch (config.USERMICROSERVICE + 'jwtDetails', {
            headers : {
            'Authorization' : 'Bearer ' + token
        }
    })
    .then ((response) => {
      return response.json();  
    })
    .then ((unsignedJSON) => {
        console.log (unsignedJSON);
        principalId = unsignedJSON.custID;
        let userObject = userFactory.getObject(unsignedJSON);
        
        return userObject.isAllowed (util.extractMethodAndPath(event.methodArn))
        
    })
    .then ((isAllowed) => {
            
            switch (isAllowed) {
            
            case 'allow':
                console.log('allowed');
                callback(null, generatePolicy(principalId, 'Allow', event.methodArn));
                break;
            case 'deny':
                console.log('denied');
                callback(null, generatePolicy(principalId, 'Deny', event.methodArn));
                break;
            
            default:
                callback("Error: Invalid token"); 
            }

    });

    
};

var generatePolicy = function(principalId, effect, resource) {
    var authResponse = {};
    
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; // default version
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; // default action
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    
    // Can optionally return a context object of your choosing.
    authResponse.context = {};
    authResponse.context.principalId = principalId;
    return authResponse;
}