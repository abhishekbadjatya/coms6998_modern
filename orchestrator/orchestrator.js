'use strict';
const config = require ('./config.js');
const fetch = require ('node-fetch');

const basicHeader = {
    'Content-Type' : 'application/json'
};

exports.handler = (event, context, callback) => {

    console.log(event);
    if (event.Records!=undefined)
        {console.log(event.Records[0].Sns);}

    var operation = event.path;
    var resource = event.resource;
    var payload = event.body;
    var httpMethod = event.httpMethod;
    var resHeader={
        'Content-Type': 'application/json',
        "Access-Control-Allow-Origin" : "*"
    };
    
    var header = {
        'Content-Type': 'application/json',

    }
    if (event.headers != undefined ){
        console.log(event.headers);
        if (event.headers.Authorization !=undefined){
            header.Authorization=event.headers.Authorization;    
        }
        
    }
    var resMessage= null;

    


    if (event.Records != undefined) {


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


        switch (resource) {
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
            
            var userSignUpStatus;
            var userCreatedDetails;
            fetch (config.USERMICROSERVICE + 'signup', {
                method: 'POST',
                headers : header,
                body : payload
            })
            .then ((response) => {
                console.log(response);
                userSignUpStatus = response.status;
                return response.json();
            })
            .then ((json) => {
                console.log(json);
                var custID=json._id;
                var accountBalance = 0;
                var accountType = 0;
                var accountLabel = 'PRIVATE';
                var accountData= {custID,accountBalance,accountType, accountLabel}
                
                if (userSignUpStatus == 200) {
                    userCreatedDetails = json;
                    if (header.Authorization) {
                        delete header.Authorization;
                    }
                    fetch(config.USERACCOUNTMICROSERVICE+'customerAccount', {
                        method: 'POST',
                        headers : header,
                        body: JSON.stringify(accountData)
                    })
                    .then((response) => {
                        return response.json();
                    }).then ((accountJSON) => {
                        console.log(accountJSON);
                        callback(null, { 
                            statusCode: userSignUpStatus,
                            headers:resHeader,
                            body: JSON.stringify(userCreatedDetails)

                        });
                    }).catch ((err) => {
                        callback(null, {
                            statusCode: 500,
                            headers:resHeader,
                            body: JSON.stringify(err)
                        });
                        console.log(err);
                    });

                } else {
                    callback(null, {
                        statusCode: userSignUpStatus,
                        headers:resHeader,
                        body: JSON.stringify(json)

                    });

                }
                
                console.log(json);

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

            case '/customer-single' :
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
                    body: JSON.stringify(json)
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

            case '/account' :
            if (event.httpMethod === 'POST') {


                fetch (config.USERMICROSERVICE + 'customerInfo', {
                    headers : header
                })
                .then ((response) => {
                    return response.json();
                })
                .then ((json) => {
                    let custID = json._id;
                    payload = JSON.parse(payload);
                    payload.accountBalance = 0;
                    payload.custID = custID;

                    return fetch (config.USERACCOUNTMICROSERVICE + 'customerAccount', {
                        method : 'POST',
                        headers : header,
                        body : JSON.stringify (payload)
                    });

                }).then ((response) => {

                    return response.json();

                }).then ((jsonAccountResponse) =>  {

                    callback(null, {
                        statusCode: 200,
                        headers:resHeader,
                        body: JSON.stringify(jsonAccountResponse)
                    });


                });


            } else if (event.httpMethod == 'GET') {
                


                fetch (config.USERMICROSERVICE + 'customerInfo', {
                    headers : header
                })
                .then ((response) => {
                    return response.json();
                })
                .then ((json) => {

                    let custID = json._id;
                    
                    return fetch (config.USERACCOUNTMICROSERVICE + 'customerAccount/' + custID)


                })
                .then ((response) => {

                    return response.json();

                }).then((jsonCustomerAccount) => {

                    callback (null, {
                        statusCode : 200,
                        headers : resHeader,
                        body : JSON.stringify (jsonCustomerAccount)
                    });

                }).catch ((err) => {

                    callback (null, {
                        statusCode : 500,
                        headers : resHeader,
                        body : JSON.stringify ({err : err})
                    });
                });

                

            }
            break;
            case '/order/{id}' :
                let orderID = event.pathParameters.id;

                fetch (config.ORDERMICROSERVICE + 'api/orders/poll/' + orderID).then((response) => {

                    return response.json();

                }).then((json) => {

                    callback (null, {
                        statusCode: 200,
                        headers: resHeader,
                        body : JSON.stringify(json)
                    })
                }).catch ((err) => {

                        callback (null, {
                            statusCode : 500,
                            headers : resHeader,
                            body : JSON.stringify ({err : err})
                        });
                });
            
            case '/app/{id}' :
                let appID = event.pathParameters.id;

                fetch (config.PRODUCTMICROSERVICE + '/api/getproducts/' + appID).then((response) => {

                    return response.json();

                }).then((json) => {

                    callback (null, {
                        statusCode: 200,
                        headers: resHeader,
                        body : JSON.stringify(json)
                    })
                }).catch ((err) => {

                        callback (null, {
                            statusCode : 500,
                            headers : resHeader,
                            body : JSON.stringify ({err : err})
                        });
                });

            break;
            default:
            callback(null, {
                statusCode: 500,
                headers: resHeader,
                body: JSON.stringify({'error':'invalid'})
            });
            break;
        }
    }
};