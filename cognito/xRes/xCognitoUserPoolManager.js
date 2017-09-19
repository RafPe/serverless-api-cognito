//https://serverless.com/framework/docs/providers/aws/guide/testing/

var AWS = require('aws-sdk');
const uuid = require('uuid');
var CognitoSDK = require('amazon-cognito-identity-js');
var xSharedFunctions = require('./shared/xSharedFunctions');

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
    constructor(uuid,callback,disableLog){
        
        this.userPool   = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        this.callback   = callback;
        this.component  = 'cognito';

        this.xSharedFnc = new xSharedFunctions(this.component,null,(disableLog === null || disableLog === undefined ) ? null : disableLog);  
        this.uuid       = uuid;


        this.sns = new AWS.SNS({
            apiVersion: '2010-03-31',
            region: process.env.REGION
        });

    }

    authenticate(usrName,usrPass){
        var that = this;
        let res  = null;

        
        const user = new AWS.CognitoIdentityServiceProvider.CognitoUser({ Username: usrName, Pool: that.userPool });
        
        const authenticationData    = { Username: usrName, Password: usrPass };
        const authenticationDetails = new AWS.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData);
        
        user.authenticateUser(authenticationDetails, {
            onSuccess: result => {
                that.xSharedFnc.logmsg(that.uuid,'info','authenticated cognito user');
                that.xSharedFnc.logmsg(that.uuid,'info',`${JSON.stringify(result)}`);

                res = that.xSharedFnc.generateSuccessResponse(result);

                that.xSharedFnc.logmsg(that.uuid,'info',`${JSON.stringify(res)}`);

                that.callback(null,res);            

                return res;
            },
            onFailure: error => {
                that.xSharedFnc.logmsg(that.uuid,'error','Failed to authenticate cognito user (EC.007)');
                that.xSharedFnc.logmsg(that.uuid,'error',`${JSON.stringify(error)}`);

                let errorData = {
                    code: "EC.006",
                    data: error
                }

                res = that.xSharedFnc.generateErrorResponse(errorData,errorData.data.statusCode);

                that.callback(null,res);

                return res;
            },
            newPasswordRequired: () => {},  // no-op
            mfaRequired: () => {},  // no-op
            customChallenge: () => {} // no-op
        });
                    
    }

    createNew(username, email, mobile ,password ,xtraUserAttributes) {
        var that = this;
        let res  = null;

        var userPool      = new AWS.CognitoIdentityServiceProvider.CognitoUserPool(poolData);
        var attributeList = [];
        
        if(xtraUserAttributes != true ){
            xtraUserAttributes = [];
        }

        var attrEmail = {
            name : 'email',
            value : email
        };
    
        xtraUserAttributes.push(attrEmail);
    
        var attrMobile = {
            name : 'phone_number',
            value : mobile
        };
    
        xtraUserAttributes.push(attrMobile);
    
        var attrUsername = {
            name : 'nickname',
            value : username
        };
    
        xtraUserAttributes.push(attrUsername);



        xtraUserAttributes.forEach(function(entry) {
                
            var tmpAttr = {
                Name :  entry.name,
                Value : entry.value
            };


            var tmpAttributeAws = new AWS.CognitoIdentityServiceProvider.CognitoUserAttribute(tmpAttr);

            attributeList.push(tmpAttributeAws);
        
        }, this);

        
        userPool.signUp(username, password, attributeList, null, function(err, result){
            if (err) {

                that.xSharedFnc.logmsg(that.uuid,'error','Failed to create cognito user (EC.006)');
                that.xSharedFnc.logmsg(that.uuid,'error',`${JSON.stringify(err)}`);

                let errorData = {
                    code: "EC.006",
                    data: err
                }

                res = that.xSharedFnc.generateErrorResponse(errorData,errorData.data.statusCode);

                that.callback(null,res);

                return res;
    
            } else {
    
                that.xSharedFnc.logmsg(that.uuid,'info','Created cognito user');
                that.xSharedFnc.logmsg(that.uuid,'info',`${JSON.stringify(result)}`);


                res = that.xSharedFnc.generateSuccessResponse(result,201);

                that.xSharedFnc.logmsg(that.uuid,'info',`${JSON.stringify(res)}`);

                that.callback(null,res);            

                return res;
            }
          });
    }
  }
  
  module.exports = xCognitoUserPoolManager;