//https://serverless.com/framework/docs/providers/aws/guide/testing/

var AWS = require('aws-sdk');
AWS.util.isBrowser = function() { return false; };

const uuid                         = require('uuid');
var CognitoSDK                     = require('amazon-cognito-identity-js');
var xSharedFunctions               = require('./shared/xSharedFunctions');
var CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider

AWS.CognitoIdentityServiceProvider.AuthenticationDetails = CognitoSDK.AuthenticationDetails;
AWS.CognitoIdentityServiceProvider.CognitoUserPool       = CognitoSDK.CognitoUserPool;
AWS.CognitoIdentityServiceProvider.CognitoUser           = CognitoSDK.CognitoUser;
AWS.CognitoIdentityServiceProvider.CognitoUserAttribute  = CognitoSDK.CognitoUserAttribute;


AWS.config.update({
    accessKeyId: process.env.ACC_KEY,
    secretAccessKey: process.env.SECRET_ACC_KEY,
    region: process.env.REGION
  });
  

  
  
var poolData = { 
    UserPoolId: process.env.USER_POOL_ID,
    ClientId: process.env.CLIENT_ID
};


class xCognitoUserPoolManager {  
    constructor(uuid,callback,disableLog){
        
        this.adminClient = new CognitoIdentityServiceProvider({
            apiVersion: '2016-04-19',
            region: process.env.REGION
          })

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

    adminConfirmEmailAndPhone(usrName){
        var that = this;
        let res  = null;

        that.adminClient.adminUpdateUserAttributes({
            UserAttributes: [{
                Name: 'phone_number_verified',
                Value: 'true'
              }, {
                Name: 'email_verified',
                Value: 'true'
              }
              // other user attributes like phone_number or email themselves, etc
            ],
            UserPoolId: process.env.USER_POOL_ID,
            Username: usrName
          }, function(err,result) {
            if (err) {
                that.xSharedFnc.logmsg(that.uuid,'error','Failed to confirm user attributes (EC.011)');
                that.xSharedFnc.logmsg(that.uuid,'error',`${JSON.stringify(err)}`);

                let errorData = {
                    code: "EC.006",
                    data: err
                }

                res = that.xSharedFnc.generateErrorResponse(errorData,errorData.data.statusCode);

                that.callback(null,res);

                return res;
            } else {
                that.xSharedFnc.logmsg(that.uuid,'info','Confirmed user attributes');
                that.xSharedFnc.logmsg(that.uuid,'info',`${JSON.stringify(result)}`);

                res = that.xSharedFnc.generateSuccessResponse(result);

                that.xSharedFnc.logmsg(that.uuid,'info',`${JSON.stringify(res)}`);

                that.callback(null,res);            

                return res;
            }
          })
    }

    confirmForgotPassword(usrName,confirmationCode,newPassword){

        var that = this;
        let res  = null;

        var params = {
            ClientId: process.env.CLIENT_ID,
            Password: newPassword,
            ConfirmationCode: confirmationCode, /* required */
            Username: usrName, /* required */
          };


        this.adminClient.confirmForgotPassword(params, function(err, data) {
            if (err){
                that.xSharedFnc.logmsg(that.uuid,'error','Failed to complete forgot password flow (EC.012)');
                that.xSharedFnc.logmsg(that.uuid,'error',`${JSON.stringify(err)}`);

                let errorData = {
                    code: "EC.012",
                    data: err
                }

                res = that.xSharedFnc.generateErrorResponse(errorData,errorData.data.statusCode);

                that.callback(null,res);

                return res;
            }else{
                that.xSharedFnc.logmsg(that.uuid,'info','completed forgot password flow');
                that.xSharedFnc.logmsg(that.uuid,'info',`${JSON.stringify(data)}`);

                res = that.xSharedFnc.generateSuccessResponse(data);

                that.xSharedFnc.logmsg(that.uuid,'info',`${JSON.stringify(res)}`);

                that.callback(null,res);            

                return res;
            }
        });

    
    }

    resendConfirmationCode(usrName){
        var that = this;
        let res  = null;

        const cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser({ Username: usrName, Pool: that.userPool });


        cognitoUser.resendConfirmationCode(function(err, result) {
            if (err) {
                that.xSharedFnc.logmsg(that.uuid,'error','Failed to resend confirmation code for user registration (EC.010)');
                that.xSharedFnc.logmsg(that.uuid,'error',`${JSON.stringify(err)}`);

                let errorData = {
                    code: "EC.006",
                    data: err
                }

                res = that.xSharedFnc.generateErrorResponse(errorData,errorData.data.statusCode);

                that.callback(null,res);

                return res;
            }else {
                that.xSharedFnc.logmsg(that.uuid,'info','Sent user confirmation code');
                that.xSharedFnc.logmsg(that.uuid,'info',`${JSON.stringify(result)}`);

                res = that.xSharedFnc.generateSuccessResponse(result);

                that.xSharedFnc.logmsg(that.uuid,'info',`${JSON.stringify(res)}`);

                that.callback(null,res);            

                return res;
            }

        });

    }

    confirmUser(usrName,usrConfirmation){
        var that = this;
        let res  = null;

        const cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser({ Username: usrName, Pool: that.userPool });


        cognitoUser.confirmRegistration(usrConfirmation, true, function(err, result) {
            if (err) {
                that.xSharedFnc.logmsg(that.uuid,'error','Failed to confirm user registration (EC.009)');
                that.xSharedFnc.logmsg(that.uuid,'error',`${JSON.stringify(err)}`);

                let errorData = {
                    code: "EC.006",
                    data: err
                }

                res = that.xSharedFnc.generateErrorResponse(errorData,errorData.data.statusCode);

                that.callback(null,res);

                return res;
            } else {
                that.xSharedFnc.logmsg(that.uuid,'info','initiated user confirmation flow');
                that.xSharedFnc.logmsg(that.uuid,'info',`${JSON.stringify(result)}`);

                res = that.xSharedFnc.generateSuccessResponse(result);

                that.xSharedFnc.logmsg(that.uuid,'info',`${JSON.stringify(res)}`);

                that.callback(null,res);            

                return res;
            }
        });
    }

    forgotPassword(usrName){
        var that = this;
        let res  = null;

        const cognitoUser = new AWS.CognitoIdentityServiceProvider.CognitoUser({ Username: usrName, Pool: that.userPool });

        cognitoUser.forgotPassword({
            onSuccess: function (data) {
                that.xSharedFnc.logmsg(that.uuid,'info','initiated forgot password flow');
                that.xSharedFnc.logmsg(that.uuid,'info',`${JSON.stringify(data)}`);

                res = that.xSharedFnc.generateSuccessResponse(data);

                that.xSharedFnc.logmsg(that.uuid,'info',`${JSON.stringify(res)}`);

                that.callback(null,res);            

                return res;
            },
            onFailure: function(err) {
                that.xSharedFnc.logmsg(that.uuid,'error','Failed to initiate forgot password for user (EC.008)');
                that.xSharedFnc.logmsg(that.uuid,'error',`${JSON.stringify(err)}`);

                let errorData = {
                    code: "EC.006",
                    data: err
                }

                res = that.xSharedFnc.generateErrorResponse(errorData,errorData.data.statusCode);

                that.callback(null,res);

                return res;
            }
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