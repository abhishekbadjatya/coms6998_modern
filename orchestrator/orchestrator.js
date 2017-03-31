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
            }).then ((response) => {
                return response.json();

            }).then ((json) => {

                console.log(json);

            }).catch ((err) => {
                console.log(err);
            });

            break;
            
        case 'signup' :

            fetch (config.USERMICROSERVICE + 'signup', {
                method: 'POST',
                headers : basicHeader,
                body : JSON.stringify (event.payload)
            }).then ((response) => {
                return response.json();

            }).then ((json) => {

                console.log(json);

            }).catch ((err) => {
                console.log(err);
            });
            break;
            
        case 'getAllApps' :
            fetch (config.PRODUCTMICROSERVICE + 'api/getproducts')
            .then ((response) => {
                return response.json();

            }).then ((json) => {

                console.log(json);

            }).catch ((err) => {
                console.log(err);
            });

            break;
            
        case 'getAppWithID' :
            fetch (config.PRODUCTMICROSERVICE + 'api/getproducts/' +  event.id)
            .then ((response) => {
                return response.json();

            }).then ((json) => {

                console.log(json);

            }).catch ((err) => {
                console.log(err);
            });
            break;
        
        case 'emailVerification' :
            //TODO - 
            response.body.message = 'calling verfying email';
            break;
        
        case 'getAllCustomerInfo' :
            response.body.message = 'calling getAllCustomerInfo';
            break;
            
            
        case 'getCustomerWithID' :
            fetch (config.USERMICROSERVICE + '/customerInfo', {
                headers : Object.assign ({}, basicHeader, {"Authorization": event.params.header.Authorization})
            })
            .then ((response) => {
                return response.json();

            }).then ((json) => {

                console.log(json);

            }).catch ((err) => {
                console.log(err);
            });
            
            break;
            
        
        case 'getCustomerAllApps' :
            fetch (config.USERMICROSERVICE + '/customerInfo', {
                headers : Object.assign ({}, basicHeader, {"Authorization": event.params.header.Authorization})
            })
            .then ((response) => {
                return response.json();

            }).then ((json) => {

                let {_id} = json;

                return fetch (config.ORDERMICROSERVICE + 'api/orders/purchaseHistory/' + _id)

            }).then ((response) => {
                return response.json();
            }).then ((json) => {

                let productIDs = json;
                //TODO - now call product micro services to return all the products info.
                
            })
            .catch ((err) => {
                console.log(err);
            });
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
            // NOT TO DO
            response.body.message = 'calling getSingleOrder';
            break;
        
        
        case 'getAllAccounts' : 
            response.body.message = 'calling getAllAccounts';
            break;
        
        case 'createAccount' :
            fetch (config.USERMICROSERVICE + '/customerInfo', {
                headers : Object.assign ({}, basicHeader, {"Authorization": event.params.header.Authorization})
            })
            .then ((response) => {
                return response.json();

            }).then ((json) => {

                let {_id} = json;
                // console.log(_id);
                // console.log(event.payload)
                console.log('Here')
            //     fetch (config.USERMICROSERVICE + 'login', {
            //     method: 'POST',
            //     headers : basicHeader,
            //     body : JSON.stringify (event.payload)
            // })
                event.payload.custID=_id;
                console.log(event.payload);
                console.log(JSON.stringify(event.payload));
                fetch (config.USERACCOUNTMICROSERVICE, {
                method: 'POST',
                headers : basicHeader,
                body : JSON.stringify (event.payload)
            })
            .then ((response) => {
                return response.json();
            }).then ((json) => {

                console.log(json);
                //TODO - now call product micro services to return all the products info.
                
            })
            })
            .catch ((err) => {
                console.log(err);
            });
            break; 
            // fetch (config.USERACCOUNTMICROSERVICE, {
            //     method: 'POST',
            //     headers : basicHeader,
            //     body : JSON.stringify (event.payload)
            // }).then ((response) => {
            //     return response.json();

            // }).then ((json) => {

            //     console.log(json);

            // }).catch ((err) => {
            //     console.log(err);
            // });
            // break;
        case 'getCustomerAccounts' :
            fetch (config.USERACCOUNTMICROSERVICE + '/customerInfo', {
                headers : Object.assign ({}, basicHeader, {"Authorization": event.params.header.Authorization})
            })
            .then ((response) => {
                return response.json();

            }).then ((json) => {

                let {_id} = json;

                return fetch (config.ORDERMICROSERVICE + 'api/orders/purchaseHistory/' + _id)

            }).then ((response) => {
                return response.json();
            }).then ((json) => {

                let productIDs = json;
                //TODO - now call product micro services to return all the products info.
                
            })
            .catch ((err) => {
                console.log(err);
            });
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

    "operation" : "createAccount",
    "payload": {
        // "emailID": "ab4349@columbia.edu",
        // "password": "ab4349"
        "accountType": 0,
        "accountBalance": 100

    },
    "params" : {
        "header" : {
            "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0SUQiOiI1OGRiZWIwOWE4ZDk5OTBkOGU3MzFiODgiLCJpYXQiOjE0OTA5MjU3NDR9.s0uIT5TiHYqJNPAt9W_0BQ8s2Xsbv9NNLk28qdjPpPM"
        }
    }
});