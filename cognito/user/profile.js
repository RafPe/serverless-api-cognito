'use strict';

var AWS = require('aws-sdk');
AWS.util.isBrowser = function() { return false; };

var xSharedFunctions = require('../xRes/shared/xSharedFunctions');
var xCognitoUserPoolManager = require('../xRes/xCognitoUserPoolManager');


const uuid      = require('uuid');
const component  = 'cognito'

var xSharedFnc = new xSharedFunctions('cognito');

module.exports.uprofile = (event, context, callback) => {
    const uniqueId      = uuid.v1();
    
    var xCognitoUserPoolMgr = new xCognitoUserPoolManager(uniqueId,callback);
  
    xSharedFnc.logmsg(uniqueId,'info','Starting execution');
    xSharedFnc.logmsg(uniqueId,'info',`${JSON.stringify(event)}`);

    callback(null,xSharedFnc.generateSuccessResponse("yey") );

  }
  