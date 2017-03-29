'use strict';
const config = require ('./config.js');
const fetch = require ('node-fetch');

const basicHeader = {
    'Content-Type' : 'application/json'
};
//exports.handler
let orchestrator = (event, context, callback) => {
    
    let response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        body: {'message' : ''} 
        
    };
    
    switch (event.operation) {
        
        case 'login' :

            fetch (config.USERMICROSERVICE + 'login', {
                method: 'POST',
                headers : basicHeader,
                body : JSON.stringify (event.payload)
            })
            .then ((response) => {
                return response.json();

            }).then ((json) => {

                console.log(json);

            }).catch ((err) => {
                console.log(err);
            })

            break;
            
        case 'signup' :
            response.body.message = 'calling signup';
            break;
            
        case 'getAllApps' :
            response.body.message = 'calling get all apps';
            break;
            
        case 'getAppWithID' :
            response.body.message = 'calling get app with ID';
            break;
        
        case 'emailVerification' :
            response.body.message = 'calling verfying email';
            break;
        
        case 'getAllCustomerInfo' :
            response.body.message = 'calling getAllCustomerInfo';
            break;
            
            
        case 'getCustomerWithID' :
            response.body.message = 'calling getCustomerWithID';
            break; 
        
        case 'getCustomerWithID' :
            response.body.message = 'calling getCustomerWithID';
            break;
            
        
        case 'getCustomerAllApps' :
            response.body.message = 'calling getCustomerAllApps';
            break; 
        
        case 'getSingleCustomerGetSingleApp' :
            response.body.message = 'calling getSingleCustomerGetSingleApp';
            break; 
        
        case 'getAllCustomerForApp' : 
            response.body.message = 'calling getAllCustomerForApp';
            break;
            
        case 'getSingleAppSingleCustomer' : 
            response.body.message = 'calling getAllCustomerForApp';
            break; 
        
        case 'createOrder' :
            response.body.message = 'calling creating order';
            break;
        
        case 'getSingleOrder' : 
            response.body.message = 'calling getSingleOrder';
            break;
        
        case 'updateCustomerInfo' : 
            response.body.message = 'calling getSingleOrder';
            break;
        
        
        case 'getAllAccounts' : 
            response.body.message = 'calling getAllAccounts';
            break;
        
        case 'createAccount' : 
            response.body.message = 'calling createAccount';
            break;
        
        
        case 'getSingleAccountInfo' :
            response.body.message = 'calling getSingleAccountInfo';
            break;
        
        
        case 'getSingleAccountAllApps' :
            response.body.message = 'calling getSingleAccountAllApps';
            break;
        
        
        case 'getSingleAccountSingleApp' :
            response.body.message = 'calling getSingleAccountSingleApp';
            break;   
        
        default:
            response.body.message = 'invalid';
            break;
            
        
        
    }
    
    //context.succeed(response);
};

orchestrator({

    "operation" : "login",
    "payload": {
        "emailID": "sk4226@columbia.edu",
        "password": "sk4226"

    },
    "params" : {
        "header" : {
            "Authorization": "Bearer askdjnkasndkjasndkjnaskdjnasd"
        }
    }
});