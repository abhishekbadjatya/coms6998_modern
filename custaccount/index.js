'use strict';

const APP_PATH = './app';

// Vendor imports.
const AWS = require('aws-sdk');
const HTTPS = require('https');



var config=require('./config.js');
var dao = require('./dao/mongoconnect.js');
var bodyParser = require('body-parser');
var fetch = require('node-fetch');

function extractOperationAndParams(event, callback) {
  console.log('Received event:`', JSON.stringify(event, null, 2));
  if (event.operation) {
    var operation = event.operation;
    var params = Utils.omit(event, 'operation');
    callback(null, operation, params);
  } else {
    callback(new InvalidInputException('An operation has to be specified.'));
  }
}

exports.customerAccountControllerHandler = (event, context, callback) => {
  callController(event, 'customersController', callback);
  extractOperationAndParams(event, (err, operation, params) => {
    switch (operation) {
      case 'fetchAll':
      case 'fetch'://Need to change the controller function names here
        controller.show(params, mapping.sendHttpResponse(callback));
        break;
      case 'create':
        controller.create(params, mapping.sendHttpResponse(callback));
        break;
      case 'update':
        controller.update(params, mapping.sendHttpResponse(callback));
        break;
      case 'delete':
        controller.delete(params, mapping.sendHttpResponse(callback));
        break;
      default:
        mapping.sendHttpResponse(callback)(new InvalidInputException(
          'Invalid operation "${operation}" given.'));
    }
  });
};