import xCognitoUserPoolManager from './xRes/xCognitoUserPoolManager'

const uuid = require('uuid');
var functionsCommon = require('./common.js');



  module.exports.register = (event, context, callback) => {

    let xCognitoUserPoolMgr = new xCognitoUserPoolManager();
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


  }
  
  