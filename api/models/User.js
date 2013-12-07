/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */
var bcrypt = require("bcrypt")
  , moment = require("moment")
  , postmark = require("postmark")("8d7e4629-8a93-4248-b8bf-77f8dc4b7319");

module.exports = {

  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/
    first_name: {type: "string", required: true}
    , last_name: {type: "string", required: true}
    , email: {type: "email", required: true}
    , encrypted_pw: {type: "string", required: true}
    , confirmation_code: {type: "string"}
    , status: {type: "integer"}
  }

  , statuses: {
    archived: 0
    , active: 1
    , pending: 2
    , password_reset: 3
    , deactivated: 4
  }

  , beforeValidation: function(values, next) {
    User.findByEmail(values.email).done(function (err, user) {
      if (err) return next(err);

      if (user.length && user[0].id !== values.id) {
        next({email: "Cannot be duplicated"});
      } else {
        if (values.encrypted_pw) {
          next();
        } else if ( values.password === values.confirm_password ) {
          bcrypt.hash(values.password, 10, function (err, hash) {
            if (err) return next(err);

            values.encrypted_pw = hash;
            next();
          });
        } else {
          next({ confirm_password: "Needs to match." });
        }
       }
    });
  }

  , afterValidation: function (values, next) {
    delete(values.password);
    delete(values.confirm_password);
    
    next();
  }

  , beforeCreate: function (values, next) {
		delete(values.password);
		delete(values.confirm_password);

    bcrypt.hash(moment().format("X.SSS") + values.email, 10, function (err, hash) {
      if (err) return next(err);
      
      values.confirmation_code = hash;
      values.status = User.statuses.pending;
      next();
    });
  }

  , afterCreate: function (user, next) {
    postmark.send({
        "From": "ben.hunsaker@me.com"
        , "To": user.email
        , "Subject": "Please confirm your account"
        , "HtmlBody": "http://localhost:1337/verify/" + encodeURIComponent(user.confirmation_code)
        , "TextBody": "http://localhost:1337/verify/" + encodeURIComponent(user.confirmation_code)
    }, function(error, success) {
        if(error) {
            console.error("Unable to send via postmark: " + error.message);
            next();
            return;
        }
        console.info("Sent to postmark for delivery");
        next();
    });
  }

};
