'use strict';

var xSharedFunctions = require('../xRes/shared/xSharedFunctions');
var xCognitoUserPoolManager = require('../xRes/xCognitoUserPoolManager');


const uuid      = require('uuid');
const component  = 'cognito'

var xSharedFnc = new xSharedFunctions('cognito');

module.exports.register = (event, context, callback) => {
    const uniqueId      = uuid.v1();
    
    var xCognitoUserPoolMgr = new xCognitoUserPoolManager(uniqueId,callback);
  
    xSharedFnc.logmsg(uniqueId,'info','Starting execution');
    xSharedFnc.logmsg(uniqueId,'info',`${JSON.stringify(event)}`);
   
    if ( !xSharedFnc.isDef(event.body) )
      { 
        xSharedFnc.logmsg(uniqueId,'error','Missing body information (EC.001)');
  
        let errorData = {
          code: "EC.001",
          data: {
            message: "Missing body"
          }
        }
  
        callback(null,xSharedFnc.generateErrorResponse(errorData)); 
  
      }
  
  
    var jsonBody = JSON.parse(event.body);
  
    if ( !xSharedFnc.isDef(jsonBody.username) || !xSharedFnc.isDef(jsonBody.email) || !xSharedFnc.isDef(jsonBody.mobile) || !xSharedFnc.isDef(jsonBody.password) )
    {
      xSharedFnc.logmsg(uniqueId,'error','Missing required parameters in body (EC.002)');
      
      let errorData = {
        code: "EC.002",
        data: {
          message: "Missing required parameters in body"
        }
      }
  
      callback(null,xSharedFnc.generateErrorResponse(errorData)); 
    }
  
    xSharedFnc.logmsg(uniqueId,'info','All required parameters received');
    xSharedFnc.logmsg(uniqueId,'info','Calling createPlatformEndpoint...');
  
    xCognitoUserPoolMgr.createNew(jsonBody.username,jsonBody.email,jsonBody.mobile,jsonBody.password)           
  }
  