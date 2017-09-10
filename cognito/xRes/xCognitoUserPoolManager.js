//https://serverless.com/framework/docs/providers/aws/guide/testing/

var AWS = require('aws-sdk');
const uuid = require('uuid');
var CognitoSDK = require('amazon-cognito-identity-js');
var functionsCommon = require('./common.js');

AWS.CognitoIdentityServiceProvider.AuthenticationDetails = CognitoSDK.AuthenticationDetails;
AWS.CognitoIdentityServiceProvider.CognitoUserPool = CognitoSDK.CognitoUserPool;
AWS.CognitoIdentityServiceProvider.CognitoUser = CognitoSDK.CognitoUser;
AWS.CognitoIdentityServiceProvider.CognitoUserAttribute = CognitoSDK.CognitoUserAttribute;



AWS.config.region = process.env.REGION;
  
var poolData = { 
    UserPoolId: process.env.USER_POOL_ID,
    ClientId: process.env.CLIENT_ID
};


class xCognitoUserPoolManager {  
    createNew(username, password, userAttributes) {

        const component = 'RegisterCognitoUser'

        var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);

        var attributeList = [];
        
        userAttributes.forEach(function(entry) {
                
            var tmpAttr = {
                Name :  entry.name,
                Value : entry.value
            };


            var tmpAttributeAws = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(tmpAttr);

            attributeList.push(tmpAttributeAws);
        
        }, this);

        userPool.signUp(username, password, attributeList, null, function(err, result){
            if (err) {
                functionsCommon.logmsg(component,uniqueId,'error', JSON.stringify(err) )
              
                let errorData = {
                    code: "EC.003",
                    data: err
                }
    
                callback(null,functionsCommon.generateErrorResponse(null,errorData)); 
    
            } else {
    
                callback(null,functionsCommon.generateSuccessResponse(201,result)); 
            }
          });
    }
  }
  
  module.exports = xCognitoUserPoolManager;