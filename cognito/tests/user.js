import xCognitoUserPoolManager from './xCognitoUserPoolManager'

var functionsCommon = require('./common.js');
var assert = require('chai').assert;
var should = require('chai').should();
var expect = require('expect.js');


// var AWS = require('aws-sdk-mock');

// AWS.mock('Cognito', 'putItem', function (params, callback){
//   callback(null, "successfully put item in database");
// });

// AWS.mock('SNS', 'publish', 'test-message');

/**
    TESTS
**/

// AWS.restore();

describe('Common', function() {
    describe('#generateErrorResponse()', function() {
      it('should return default values when null passed', function(done) {
        expect(functionsCommon.generateErrorResponse(null,'whatever')).to.equal('aaa');
      });
    });
  });








//   {
//     "component": "cognito",
//     "status": "success",
//     "data": {
//         "user": {
//             "username": "mikrowski",
//             "pool": {
//                 "userPoolId": "eu-west-1_ie8fXMaTL",
//                 "clientId": "6krv66g1o2kc5b4kp3u1k10jds",
//                 "client": {
//                     "config": {
//                         "credentials": {
//                             "expired": false,
//                             "expireTime": null,
//                             "accessKeyId": "ASIAIU7HZ3ERK6H6ROAA",
//                             "sessionToken": "FQoDYXdzEKD//////////wEaDEidI0I8dKuayZl52iL2Afqn0TcG31i/mqsS6CAbKPgCPlt89vp7dI/dd91F1Gu7b9Un04Zd5ILJ0SgZ0IhNNZ7I2x0t6R0H4UBqLiQbU0v4Mn506Hp1YLhZUoR6+e7FqO1q2cEIyPBieNUS5Wg0F52iGcBqYT9UxjgwkhKGnEaoWpzZn86OJcIkDowF+XKClriifocX7YGDLmlo8qB235/UDgY/OukFHuILQ1U3B9skMx0PI1HiZ7ygKRXIpZL4jPZgbzKe2puL7qDVhVKpGtQH6LSuGdlaKJcc7p+Ra7soXs5MWX8dNy4wVMKRB+aEvpxjtRRwQXPd7jKqe/kSsbgnHLvfaSj0hoPOBQ==",
//                             "envPrefix": "AWS"
//                         },
//                         "credentialProvider": {
//                             "providers": [
//                                 null,
//                                 null,
//                                 null,
//                                 null
//                             ]
//                         },
//                         "region": "eu-west-1",
//                         "logger": null,
//                         "apiVersions": {},
//                         "apiVersion": "2016-04-19",
//                         "endpoint": "cognito-idp.eu-west-1.amazonaws.com",
//                         "httpOptions": {
//                             "timeout": 120000
//                         },
//                         "maxRedirects": 10,
//                         "paramValidation": true,
//                         "sslEnabled": true,
//                         "s3ForcePathStyle": false,
//                         "s3BucketEndpoint": false,
//                         "s3DisableBodySigning": true,
//                         "computeChecksums": true,
//                         "convertResponseTypes": true,
//                         "correctClockSkew": false,
//                         "customUserAgent": null,
//                         "dynamoDbCrc32": true,
//                         "systemClockOffset": 0,
//                         "signatureVersion": "v4",
//                         "signatureCache": true,
//                         "retryDelayOptions": {},
//                         "useAccelerateEndpoint": false
//                     },
//                     "isGlobalEndpoint": false,
//                     "endpoint": {
//                         "protocol": "https:",
//                         "host": "cognito-idp.eu-west-1.amazonaws.com",
//                         "port": 443,
//                         "hostname": "cognito-idp.eu-west-1.amazonaws.com",
//                         "pathname": "/",
//                         "path": "/",
//                         "href": "https://cognito-idp.eu-west-1.amazonaws.com/"
//                     },
//                     "_clientId": 2
//                 }
//             },
//             "Session": null,
//             "client": {
//                 "config": {
//                     "credentials": {
//                         "expired": false,
//                         "expireTime": null,
//                         "accessKeyId": "ASIAIU7HZ3ERK6H6ROAA",
//                         "sessionToken": "FQoDYXdzEKD//////////wEaDEidI0I8dKuayZl52iL2Afqn0TcG31i/mqsS6CAbKPgCPlt89vp7dI/dd91F1Gu7b9Un04Zd5ILJ0SgZ0IhNNZ7I2x0t6R0H4UBqLiQbU0v4Mn506Hp1YLhZUoR6+e7FqO1q2cEIyPBieNUS5Wg0F52iGcBqYT9UxjgwkhKGnEaoWpzZn86OJcIkDowF+XKClriifocX7YGDLmlo8qB235/UDgY/OukFHuILQ1U3B9skMx0PI1HiZ7ygKRXIpZL4jPZgbzKe2puL7qDVhVKpGtQH6LSuGdlaKJcc7p+Ra7soXs5MWX8dNy4wVMKRB+aEvpxjtRRwQXPd7jKqe/kSsbgnHLvfaSj0hoPOBQ==",
//                         "envPrefix": "AWS"
//                     },
//                     "credentialProvider": {
//                         "providers": [
//                             null,
//                             null,
//                             null,
//                             null
//                         ]
//                     },
//                     "region": "eu-west-1",
//                     "logger": null,
//                     "apiVersions": {},
//                     "apiVersion": "2016-04-19",
//                     "endpoint": "cognito-idp.eu-west-1.amazonaws.com",
//                     "httpOptions": {
//                         "timeout": 120000
//                     },
//                     "maxRedirects": 10,
//                     "paramValidation": true,
//                     "sslEnabled": true,
//                     "s3ForcePathStyle": false,
//                     "s3BucketEndpoint": false,
//                     "s3DisableBodySigning": true,
//                     "computeChecksums": true,
//                     "convertResponseTypes": true,
//                     "correctClockSkew": false,
//                     "customUserAgent": null,
//                     "dynamoDbCrc32": true,
//                     "systemClockOffset": 0,
//                     "signatureVersion": "v4",
//                     "signatureCache": true,
//                     "retryDelayOptions": {},
//                     "useAccelerateEndpoint": false
//                 },
//                 "isGlobalEndpoint": false,
//                 "endpoint": {
//                     "protocol": "https:",
//                     "host": "cognito-idp.eu-west-1.amazonaws.com",
//                     "port": 443,
//                     "hostname": "cognito-idp.eu-west-1.amazonaws.com",
//                     "pathname": "/",
//                     "path": "/",
//                     "href": "https://cognito-idp.eu-west-1.amazonaws.com/"
//                 },
//                 "_clientId": 2
//             },
//             "signInUserSession": null,
//             "authenticationFlowType": "USER_SRP_AUTH"
//         },
//         "userConfirmed": false,
//         "userSub": "53f492ad-5530-407e-8e68-2cd2e4026d41"
//     }
// }