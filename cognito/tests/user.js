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
