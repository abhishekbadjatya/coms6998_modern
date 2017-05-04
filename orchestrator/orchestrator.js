'use strict';
const config = require ('./config.js');
const fetch = require ('node-fetch');

const basicHeader = {
    'Content-Type' : 'application/json'
};

exports.handler = (event, context, callback) => {
    
    let header = {
        'Content-Type': 'application/json',

    };
    let payload;
    console.log(event);

    switch (event.operation) {
        case 'login':
            
            fetch (config.USERMICROSERVICE + 'login', {
                method: 'POST',
                headers : header,
                body : JSON.stringify(event['body-json'])
            })
            .then ((response) => {
                if (response.status == 200 || response.status == 401) {
                    return response.json();    
                } else {
                    return Promise.reject("Something went wrong");
                }
                

            })
            .then ((json) => {
                console.log(json);
                if (json.error) {
                    callback ("401 "+json.error);
                } else {
                    callback(null, json);    
                }
                
            })
            .catch ((err) => {
                console.log(err);
                callback("500 Internal Server Error");
                
            });
        break;

        case 'signup' :
        
            let userSignUpStatus;
            let userCreatedDetails;

            fetch (config.USERMICROSERVICE + 'signup', {
                method: 'POST',
                headers : header,
                body : JSON.stringify(event['body-json'])
            })
            .then ((response) => {
                userSignUpStatus = response.status;
                return response.json();
            })
            .then ((json) => {

                let custID=json.custID;
                let accountBalance = 0;
                let accountType = 0;
                let accountLabel = 'PRIVATE';
                let accountData= {custID,accountBalance,accountType, accountLabel}
                let userCreatedDetails = json;
                if (userSignUpStatus == 200) {
                    
                    fetch(config.USERACCOUNTMICROSERVICE+'customerAccount', {
                        method: 'POST',
                        headers : header,
                        body: JSON.stringify(accountData)
                    })
                    .then((response) => {
                        return response.json();
                    })
                    .then ((accountJSON) => {
                        console.log(accountJSON);
                        delete userCreatedDetails.custID;
                        callback(null, userCreatedDetails);
                    })
                    .catch ((err) => {
                        console.log(error);
                        callback('500 Internal server error');
                    });
                    

                } else {

                    callback(userSignUpStatus + ' ' + json.error);
                }

            })
            
            .catch ((err) => {
                console.log(err);
                callback('500 Internal server error');
            });
        break;
        
        case 'getAllProducts' :
            fetch (config.PRODUCTMICROSERVICE + 'api/getproducts', {
                method: 'GET',
                headers : header
            })
            .then ((response) => {
                return response.json();

            })
            .then ((json) => {
                console.log(json);
                callback (null, json);
                

            })
            .catch ((err) => {
                
                console.log(err);
                callback ("500 Internal Server Error");
            });

        break;

        case 'customerSingle' :
            let callingURL = config.USERMICROSERVICE + 'customerInfo/';
            if (event.params.path.custID == 'self') {
                callingURL += event.context['authorizer-principal-id'];
            } else {
                callingURL += event.params.path.custID;
            }
            fetch (callingURL, {
                method: 'GET',
                headers : header
            })
            .then ((response) => {
                return response.json();

            }).then ((json) => {
                console.log(json);
                callback (null,json);
                

            }).catch ((err) => {
                console.log(err);
                callback ("500 Internal Server Error");
            });
        
        break;

        case 'createOrder' :

            payload = event['body-json'];
            payload.custID = event.context['authorizer-principal-id'];

            fetch (config.ORDERMICROSERVICE + 'api/orders/createBlankOrder', {
                method: 'POST',
                headers : header,
                body : JSON.stringify(payload)

            }).then ((response) => {
                return response.json();

            }).then ((json) => {
                console.log(json);
                callback(null, json);
                

            }).catch ((err) => {
                console.log(err);

                callback(null, "Internal Server Error");
                
            });
        break;

        case 'custAppPurchaseHistory' :
            let custID = '';
            if (event.params.path.custID == 'self') {
                custID += event.context['authorizer-principal-id'];
            } else {
                custID += event.params.path.custID;
            }
            fetch (config.ORDERMICROSERVICE + 'api/orders/purchaseHistory/' + custID)
            .then ((response) => {
                return response.json();
            })
            .then ((json) => {
                console.log(json);
                callback(null, json);

            }).catch ((err) => {
                console.log(err);
                callback ("500 Internal Server Error");
                
            });
        
        break;

        case 'createCustomerAccount' : 
            payload = event['body-json'];
            payload.accountBalance = 0;
            payload.custID = event.context['authorizer-principal-id'];
            console.log(payload);
            fetch (config.USERACCOUNTMICROSERVICE + 'customerAccount', {
                    method : 'POST',
                    headers : header,
                    body : JSON.stringify (payload)

            }).then ((response) => {

                return response.json();

            }).then ((jsonAccountResponse) =>  {

                callback(null, jsonAccountResponse);


            })
            .catch((error) => {
                console.log(error);
                callback ("500 Internal Server Error");
            });

        break;

        case 'getUserAccounts' :
        {
            let custID = '';
            if (event.params.path.id == 'self') {
                    custID += event.context['authorizer-principal-id'];
            } else {
                    custID += event.params.path.id;
            }

            fetch (config.USERACCOUNTMICROSERVICE + 'customerAccount/' + custID)
            .then((response) => {
                return response.json ();
            })
            .then ((json) => {

                console.log(json);
                callback(null, json);

            })
            .catch((error) => {
                console.log(error);
                callback ("500 Internal Server Error");
            });
        }

        break;
       
        
        case 'getSingleOrder' :

            let orderID = event.product_id;

            fetch (config.ORDERMICROSERVICE + 'order/' + orderID).then((response) => {

                return response.json();

            }).then((json) => {
                callback (null, json);
            }).catch ((err) => {

                console.log(error);
                callback ("500 Internal Server Error");
            });
        break;


        case 'getProductById' :
            let appID = event.product_id;

            fetch (config.PRODUCTMICROSERVICE + '/api/getproducts/' + appID)
            .then((response) => {

                return response.json();

            }).then((json) => {

                callback (null, json);
            }).catch ((err) => {
                console.log(error);
                callback ("500 Internal Server Error");
            });

        break;
        default:
            callback ("400 Invalid Operation");
        break;
    }

};