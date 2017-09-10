var exports = module.exports = {};

var AWS = require('aws-sdk');
const uuid = require('uuid');
var CognitoSDK = require('amazon-cognito-identity-js');


AWS.CognitoIdentityServiceProvider.AuthenticationDetails = CognitoSDK.AuthenticationDetails;
AWS.CognitoIdentityServiceProvider.CognitoUserPool = CognitoSDK.CognitoUserPool;
AWS.CognitoIdentityServiceProvider.CognitoUser = CognitoSDK.CognitoUser;
AWS.CognitoIdentityServiceProvider.CognitoUserAttribute = CognitoSDK.CognitoUserAttribute;


module.exports = {
    generateErrorResponse: function(respCode, dataErr){
        
            var responseCode = (respCode === null) ? 400:respCode ;
            var responseBody = "";
        
            var response = {
              statusCode: responseCode,
              body:       responseBody
            };
            
            response.body = {
                status:  "error",
                error:   dataErr,
            };
            
            response.body = JSON.stringify(response.body);
        
            return response;
    },
    generateSuccessResponse: function(respCode, dataSuc){
        
            var responseCode = (respCode === null) ? 400:respCode ;
            var responseBody = "";
        
            var response = {
              statusCode: responseCode,
              body:       responseBody
            };
            
            response.body = {
                status:  "success",
                data: dataSuc
            };
            
            response.body = JSON.stringify(response.body);
        
            return response;
    },    
    isDef: function(v) {
        return v !== undefined && v !== null;
    },
    logmsg: function(component, uniqueId, severity,  message) {
        var timestamp = new Date().getTime();
        console.log(`[${component}] [${timestamp}] [${uniqueId}][${severity}] ${message}`);
    }
  };
  



  



