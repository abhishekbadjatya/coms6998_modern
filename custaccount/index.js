'use strict';

const APP_PATH = './app';

// Vendor imports.
const AWS = require('aws-sdk');
const HTTPS = require('https');



var config=require('./config.js');

// var bodyParser = require('body-parser');
// var fetch = require('node-fetch');

var dao = require('./app/dao/mongoconnect');
var Account_Controller = require('./app/Controller/AccountController');
var Account_service = require('./app/Service/AccountService');

var accountService  = new Account_service(dao)

var controller = new Account_Controller(accountService)

function extractOperationAndParams(event, callback) {
  console.log('Received event:`', JSON.stringify(event, null, 2));
  if (event.operation) {
    var operation = event.operation;
    var params = event.payload;
    callback(null, operation, params);
  }
}

exports.handler = (event, context, callback) => {
  extractOperationAndParams (event, (err, operation, params) => {
    switch (operation) {
      case 'fetchAll':
      case 'fetch'://Need to change the controller function names here
        controller.getUserAccounts(params, (err, promise) => {
          if (err){
            callback(err);
          }else{
            console.log("logging promise");
            console.log(promise);
            context.succeed(promise);
          
          }

        });
        
        break;
      case 'create':
        controller.create(params,(err, promise)=> {
        if (err){
            callback(err)
          }else{
        console.log("logging promise");
            console.log(promise);
            context.succeed(promise);            
       }
      })
        break;
      default:
        let response = {
            statusCode: '400',
            body: JSON.stringify(),
            headers: {
                'Content-Type': 'application/json',
            }
        };
      callback(null, response);
    }
  })
}