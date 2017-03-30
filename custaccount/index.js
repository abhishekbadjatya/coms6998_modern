'use strict';

const APP_PATH = './app';

// Vendor imports.
const AWS = require('aws-sdk');
const HTTPS = require('https');



var config=require('./config.js');
var dao = require('./app/dao/mongoconnect.js');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');
var controller = require('./app/Controller/AccountController.js')

function extractOperationAndParams(event, callback) {
  console.log('Received event:`', JSON.stringify(event, null, 2));
  if (event.operation) {
    var operation = event.operation;
    var params = event.payload;
    callback(null, operation, params);
  }
}

exports.handler = (event, context, callback) => {
  extractOperationAndParams(event, (err, operation, params) => {
    switch (operation) {
      case 'fetchAll':
      case 'fetch'://Need to change the controller function names here
        controller.getUserAccounts(params);
      .then((res) => {

        let response = {
            statusCode: '200',
            body: JSON.stringify(res),
            headers: {
                'Content-Type': 'application/json',
            }
        };

        context.succeed(response);


      }).catch((err)=> {

        let response = {
            statusCode: '500',
            body: JSON.stringify(err),
            headers: {
                'Content-Type': 'application/json',
            }
        };

        context.succeed(response);
      });
        break;
      case 'create':
        controller.create(params, callback).
        .then((res) => {

        let response = {
            statusCode: '200',
            body: JSON.stringify(res),
            headers: {
                'Content-Type': 'application/json',
            }
        };

        context.succeed(response);


      }).catch((err)=> {

        let response = {
            statusCode: '500',
            body: JSON.stringify(err),
            headers: {
                'Content-Type': 'application/json',
            }
        };

        context.succeed(response);
      });
        break;
      default:
        let response = {
            statusCode: '400',
            body: JSON.stringify(),
            headers: {
                'Content-Type': 'application/json',
            }
        };

        context.succeed(response);
    }
  });
};