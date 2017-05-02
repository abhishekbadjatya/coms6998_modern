var AWS = require("aws-sdk");
var async = require("async");
var config = require("./config.js");
var QUEUE_URL = config.mySqsURL;
var WORKER_LAMBDA_FUNCTION_NAME = config.worker;
var REGION = config.AWS_config.region;
var sqs = new AWS.SQS({region: REGION});
var lambda = new AWS.Lambda({region: REGION});

function receiveMessages(callback) {
    var params = {
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 10
    };
    sqs.receiveMessage(params, function(err, data) {
        if (err) {
            console.error(err, err.stack);
            callback(err);
        } else {
            callback(null, data.Messages);
        }
    });
}
function invokeWorkerLambda(task, callback) {
    var params = {
        FunctionName: WORKER_LAMBDA_FUNCTION_NAME,
        InvocationType: 'Event',
        Payload: JSON.stringify(task)
    };
    lambda.invoke(params, function(err, data) {
        if (err) {
            console.error(err, err.stack);
            callback(err);
        } else {
            callback(null, data)
        }
    });
}
function handleSQSMessages(callback, context) {
    receiveMessages(function(err, messages) {
        if (messages && messages.length > 0) {
            var invocations = [];
            messages.forEach(function(message) {
                invocations.push(function(callback) {
                    invokeWorkerLambda(message, callback)
                });
            });
            async.parallel(invocations, function(err) {
                if (err) {
                    console.error(err, err.stack);
                    callback(err);
                } else {
                    if (context.getRemainingTimeInMillis() > 20000) {
                        handleSQSMessages(callback, context);
                    } else {
                        callback(null, "PAUSE");
                    }
                }
            });
        } else {
            callback(null, "DONE");
        }
    });
}
exports.handler = function(event, context, callback) {
    handleSQSMessages(callback, context);
};
