var AWS = require('aws-sdk');
const uuid = require('uuid');
var CognitoSDK = require('amazon-cognito-identity-js');
var functionsCommon = require('./common.js');

AWS.CognitoIdentityServiceProvider.AuthenticationDetails = CognitoSDK.AuthenticationDetails;
AWS.CognitoIdentityServiceProvider.CognitoUserPool = CognitoSDK.CognitoUserPool;
AWS.CognitoIdentityServiceProvider.CognitoUser = CognitoSDK.CognitoUser;
AWS.CognitoIdentityServiceProvider.CognitoUserAttribute = CognitoSDK.CognitoUserAttribute;

const component = 'RegisterCognitoUser'

AWS.config.region = process.env.REGION;
  
var poolData = { 
    UserPoolId: process.env.USER_POOL_ID,
    ClientId: process.env.CLIENT_ID
};

  module.exports.register = (event, context, callback) => {

    const uniqueId  = uuid.v1();
  
    functionsCommon.logmsg(component,uniqueId,'info','Starting execution')

      
    if ( !functionsCommon.isDef(event.body) )
        { 

            functionsCommon.logmsg(component,uniqueId,'error','Missing body information (EC.001)')

            let errorData = {
                code: "EC.001",
                data: {
                    message: "Missing body"
                }
            }

            callback(null,functionsCommon.generateErrorResponse(null,errorData) ); 

        }
  
    var jsonBody = JSON.parse(event.body);
  
    functionsCommon.logmsg(component,uniqueId,'info','Parsed body from request')
  
    if ( !functionsCommon.isDef(jsonBody.username) || !functionsCommon.isDef(jsonBody.password) || !functionsCommon.isDef(jsonBody.attributes) )
        {

            functionsCommon.logmsg(component,uniqueId,'error','Missing required parameters in body (EC.002)')
            

            let errorData = {
                code: "EC.002",
                data: {
                    message: "Missing required parameters in body"
                }
            }

            callback(null,functionsCommon.generateErrorResponse(null,errorData) ); 

        }

    let userName = jsonBody.username;
    let userPass = jsonBody.password;
    let userAttr = new Array();
  
    userAttr = jsonBody.attributes;

    functionsCommon.logmsg(component,uniqueId,'info','All required parameters received')
    functionsCommon.logmsg(component,uniqueId,'info', JSON.stringify(jsonBody) )
    functionsCommon.logmsg(component,uniqueId,'info','Registering user ...')

    var userPool = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
      

    var attributeList = [];

    userAttr.forEach(function(entry) {
        
        var tmpAttr = {
            Name :  entry.name,
            Value : entry.value
        };


        var tmpAttributeAws = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(tmpAttr);

        attributeList.push(tmpAttributeAws);

      }, this);

      userPool.signUp(userName, userPass, attributeList, null, function(err, result){
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
  
  