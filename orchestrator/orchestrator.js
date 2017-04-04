'use strict';
const config = require ('./config.js');
const fetch = require ('node-fetch');

const basicHeader = {
    'Content-Type' : 'application/json'
};
//exports.handler
exports.handler = (event, context, callback) => {

    if (event.Records!=undefined)
        {console.log(event.Records[0].Sns);}

    var operation = event.path;
    // var operation = 'defaulthhjhj';
    var payload = event.body;
    var httpMethod = event.httpMethod;
    var resHeader={
                        'Content-Type': 'application/json',
                        "Access-Control-Allow-Origin" : "*"
                    };
    
    var header = {
        'Content-Type': 'application/json',
        // 'Authorization': event.headers.Authorization
    }
    if (event.headers != undefined ){
        header.Authorization=event.headers.Authorization;
    }
    var resMessage= null;

    // callback(null, {
    //     statusCode: 200,
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(event)

    // });


    if (event.Records != undefined) {

        // console.log('From SNS:', message);
        // console.log('From SNS2323:', JSON.parse(JSON.parse(Message).object));
        // let data = JSON.parse(JSON.parse(Message).object));
        console.log("Inside SNS call");
        let data = JSON.parse(event.Records[0].Sns.Message);
        let Subject = event.Records[0].Sns.Subject;
        console.log("After");
        console.log(data);
        console.log(Subject);

        switch(Subject) {

            case 'pickPrice':
            console.log("inside pickprice");
            console.log("header");
            console.log(header);
            fetch (config.PRODUCTMICROSERVICE + 'api/getproductsbyid', {
                method: 'POST',
                headers : header,
                body : data.object
            })
            .then ((response) => {
                return response.json();

            })
            .then ((json) => {

                console.log(json);

            })
            .catch ((err) => {
                console.log(err);
            });


                break;

            case 'createOrder':
            console.log("inside create order");
            fetch (config.ORDERMICROSERVICE + 'api/orders/createOrder', {
                method: 'POST',
                headers : header,
                body : data.object
            }).then ((response) => {
                return response.json();

            }).then ((json) => {

                console.log(json);

            }).catch ((err) => {
                console.log(err);
            });
                break;
            default:
                console.log("Error in event Records")
                break;


        }
       
    } else {



    switch (operation) {
        case '/login':
            fetch (config.USERMICROSERVICE + 'login', {
                method: 'POST',
                headers : header,
                body : payload
            })
            .then ((response) => {
                return response.json();

            })
            .then ((json) => {
                callback(null, {
                    statusCode: 200,
                    headers:resHeader,
                    body: JSON.stringify(json)

                })
            })
            .catch ((err) => {
                callback(null, {
                    statusCode: 500,
                    headers:resHeader,
                    body: JSON.stringify(err)
                });
                console.log(err);
            });

            break;

         case '/signup' :

            fetch (config.USERMICROSERVICE + 'signup', {
                method: 'POST',
                headers : header,
                body : payload
            })
            .then ((response) => {
                return response.json();

            })
            .then ((json) => {
                callback(null, {
                    statusCode: 200,

                    headers:resHeader,
                    body: JSON.stringify(json)

                })
                console.log(json);

            })
            .catch ((err) => {
                callback(null, {
                    statusCode: 500,
                    headers:resHeader,
                    body: JSON.stringify(err)
                });
                console.log(err);
            });
            break;
            
        case '/app' :
            var callingURL=null;
            if (httpMethod=='GET'){
                callingURL= config.PRODUCTMICROSERVICE + 'api/getproducts';
            }
            fetch (callingURL, {
                method: httpMethod,
                headers : header,
                body : payload
            })
            .then ((response) => {
                return response.json();

            })
            .then ((json) => {
                callback(null, {
                    statusCode: 200,
                    headers:resHeader,
                    body: JSON.stringify(json)

                })
                console.log(json);

            })
            .catch ((err) => {
                callback(null, {
                    statusCode: 500,
                    headers:resHeader,
                    body: JSON.stringify(err)
                });
                console.log(err);
            });

            break;

        case '/customer/single' :
            var callingURL=null;
            if (httpMethod=='GET'){
                callingURL= config.USERMICROSERVICE + '/customerInfo';
            }
            fetch (callingURL, {
                method: httpMethod,
                headers : header,
                body : payload
            })
            .then ((response) => {
                return response.json();

            }).then ((json) => {
                callback(null, {
                    statusCode: 200,
                    headers:resHeader,
                    body: JSON.stringify(json)

                })
                console.log(json);

            }).catch ((err) => {
                callback(null, {
                    statusCode: 500,
                    headers:resHeader,
                    body: JSON.stringify(err)
                });
                console.log(err);
            });
            
            break;

         case '/order' :
            var callingURL=null;
            if (httpMethod=='POST'){
                callingURL= config.ORDERMICROSERVICE + 'api/orders/createBlankOrder';
            }

            fetch (callingURL, {
                method: httpMethod,
                headers : header,
                body : payload
            }).then ((response) => {
                return response.json();

            }).then ((json) => {
                callback(null, {
                    statusCode: 202,
                    headers:resHeader,
                    body: JSON.stringify(json)

                })
                console.log(json);

            }).catch ((err) => {
                callback(null, {
                    statusCode: 500,
                    headers:resHeader,
                    body: JSON.stringify(err)
                });
                console.log(err);
            });
            break;


            case '/customer/app' :
            var callingURL=null;
            if (httpMethod=='GET'){
                callingURL= config.USERMICROSERVICE + '/customerInfo';
            }

            fetch (callingURL, {
                method: httpMethod,
                headers : header
            })
            .then ((response) => {
                return response.json();

            }).then ((json) => {
                
                let _id = json._id;
                
                return fetch (config.ORDERMICROSERVICE + 'api/orders/purchaseHistory/' + _id)

            })
            .then ((response) => {
                return response.json();
            })
            .then ((json) => {

                callback(null, {
                    statusCode: 200,
                    headers:resHeader,
                    body: JSON.stringify(json.orderProducts)
                });

            }).catch ((err) => {
                callback(null, {
                    statusCode: 500,
                    headers:resHeader,
                    body: JSON.stringify(err)
                });
                console.log(err);
            });
            
            break;
            

        default:
            callback(null, {
                    statusCode: 500,
                    // headers: {
                    //     'Content-Type': 'application/json'
                    // },
                    headers: resHeader,
                    body: JSON.stringify({'error':'invalid'})
            });
            break;
    }
}
};
    

    // callback(null, {
    //     statusCode: 200,
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(event)

    // });

    // switch (event.operation) {
        
    
            
       
            
    //     case 'getAppWithID' :
    //         fetch (config.PRODUCTMICROSERVICE + 'api/getproducts/' +  event.id)
    //         .then ((response) => {
    //             return response.json();

    //         }).then ((json) => {

    //             console.log(json);

    //         }).catch ((err) => {
    //             console.log(err);
    //         });
    //         break;
        
    //     case 'emailVerification' :
    //         //TODO - 
    //         response.body.message = 'calling verfying email';
    //         break;
        
    //     case 'getAllCustomerInfo' :
    //         response.body.message = 'calling getAllCustomerInfo';
    //         break;
            
            
    //     
        
    //     case 'getCustomerAllApps' :
    //         fetch (config.USERMICROSERVICE + '/customerInfo', {
    //             headers : Object.assign ({}, basicHeader, {"Authorization": event.params.header.Authorization})
    //         })
    //         .then ((response) => {
    //             return response.json();

    //         }).then ((json) => {

    //             let {_id} = json;

    //             return fetch (config.ORDERMICROSERVICE + 'api/orders/purchaseHistory/' + _id)

    //         }).then ((response) => {
    //             return response.json();
    //         }).then ((json) => {

    //             let productIDs = json;
    //             //TODO - now call product micro services to return all the products info.
                
    //         })
    //         .catch ((err) => {
    //             console.log(err);
    //         });
    //         break; 
        
    //     case 'getSingleCustomerGetSingleApp' :
    //         response.body.message = 'calling getSingleCustomerGetSingleApp';
    //         break; 
        
    //     case 'getAllCustomerForApp' : 
    //         response.body.message = 'calling getAllCustomerForApp';
    //         break;
            
    //     case 'getSingleAppSingleCustomer' : 
    //         response.body.message = 'calling getAllCustomerForApp';
    //         break; 
        
    //     case 'createOrder' :
    //         response.body.message = 'calling creating order';
    //         break;
        
    //     case 'getSingleOrder' : 
    //         response.body.message = 'calling getSingleOrder';
    //         break;
        
    //     case 'updateCustomerInfo' : 
    //         // NOT TO DO
    //         response.body.message = 'calling getSingleOrder';
    //         break;
        
        
    //     case 'getAllAccounts' : 
    //         response.body.message = 'calling getAllAccounts';
    //         break;
        
    //     case 'createAccount' :
    //         fetch (config.USERMICROSERVICE + '/customerInfo', {
    //             headers : Object.assign ({}, basicHeader, {"Authorization": event.params.header.Authorization})
    //         })
    //         .then ((response) => {
    //             return response.json();

    //         }).then ((json) => {

    //             let {_id} = json;
    //             // console.log(_id);
    //             // console.log(event.payload)
    //             console.log('Here')
            
    //             event.payload.custID=_id;
    //             console.log(event.payload);
    //             console.log(JSON.stringify(event.payload));
    //             fetch (config.USERACCOUNTMICROSERVICE, {
    //             method: 'POST',
    //             headers : basicHeader,
    //             body : JSON.stringify (event.payload)
    //         })
    //         .then ((response) => {
    //             return response.json();
    //         }).then ((json) => {

    //             console.log(json);

    //             //TODO - now call product micro services to return all the products info.
                
    //         })
    //         })
    //         .catch ((err) => {
    //             console.log(err);
    //         });
    //         break; 

    //     case 'getCustomerAccounts' :
    //         fetch (config.USERMICROSERVICE + '/customerInfo', {
    //             headers : Object.assign ({}, basicHeader, {"Authorization": event.params.header.Authorization})
    //         })
    //         .then ((response) => {
    //             return response.json();

    //         }).then ((json) => {

    //             let {_id} = json;
    //             console.log(_id);
    //             _id='ab1';
    //             console.log(config.USERACCOUNTMICROSERVICE + _id);
    //             fetch (config.USERACCOUNTMICROSERVICE + _id)
    //             .then ((response) => {
    //             return response.json();
    //             })
    //             .then ((json) => {
    //             console.log(json)
    //         })
    //         })
    //         .catch ((err) => {
    //             console.log(err);
    //         });
    //         break;

    //     case 'getSingleAccountInfo' :
    //         response.body.message = 'calling getSingleAccountInfo';
    //         break;
        
        
    //     case 'getSingleAccountAllApps' :
    //         response.body.message = 'calling getSingleAccountAllApps';
    //         break;
        
        
    //     case 'getSingleAccountSingleApp' :
    //         response.body.message = 'calling getSingleAccountSingleApp';
    //         break;   
        
    //     default:
    //         response.body.message = 'invalid';
    //         break;
            
        
        
    // }
    
    //context.succeed(response);
// };

// orchestrator({

//     "operation" : "login",
//     "payload": {
//         "emailID": "ab4349@columbia.edu",
//         "password": "ab4349"
       

//     },
//     "params" : {
//         "header" : {
//             "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjdXN0SUQiOiI1OGRiZWIwOWE4ZDk5OTBkOGU3MzFiODgiLCJpYXQiOjE0OTA5Mjc5ODB9.mwLClfKDeDZbmw32k_0Dr5K1OPLmsDw0GJYkne4J88M"
//         }
//     }
// });