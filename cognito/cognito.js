//https://serverless.com/framework/docs/providers/aws/guide/testing/

class xCognitoUserPoolManager {
    constructor(db, mailer) {
      this.db = db;
      this.mailer = mailer;
    }
  
    save(email, callback) {
      const user = {
        email: email,
        created_at: Date.now()
      }
  
      this.db.saveUser(user, function (err) {
        if (err) {
          callback(err);
        } else {
          this.mailer.sendWelcomeEmail(email);
          callback();
        }
    });
    }
  }
  
  module.exports = Users;