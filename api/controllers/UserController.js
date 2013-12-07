/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var moment = require("moment")
  , bcrypt = require("bcrypt")
  , postmark = require("postmark")("8d7e4629-8a93-4248-b8bf-77f8dc4b7319");

module.exports = {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
  _config: {}

  // public
  , registration: function (req, res) {
  	res.view({layout: "no_user_layout"});
  }

  , verify: function (req, res) {
    User
      .findOne({
        confirmation_code: req.param("token")
        , status: User.statuses.pending
      })
      .done( function (err, user) {
        if (err) return res.send(null, 500);
        if (!user) return res.send(null, 500);

        user.confirmation_code = null;
        user.status = User.statuses.active;

        user.save( function (err) {
          if (err) return res.send(err, 500);

          req.logIn(user, function(err) {
            if (err) {
              res.redirect('/login');
              return;
            }
            
            res.redirect('/');
            return;
          });
        });
    });
  }

  , reset_password_request: function (req, res) {
    res.view({layout: "no_user_layout"});
  }

  , process_reset_password_request: function (req, res) {
    // would like to limit these to user who are not suspended, archived, deactivated
    User.findOne({ email: req.body.email }).done(function (err, user) {
      if (err) return res.send(err, 500);
      bcrypt.hash(moment().format("X.SSS") + user.email, 10, function (err, hash) {
        if (err) return next(err);
        user.confirmation_code = hash;
        user.status = User.statuses.password_reset;
        user.encrypted_pw = 1;

        user.save(function (err) {
          if (err) return res.send(err, 500);
          postmark.send({
              "From": "ben.hunsaker@me.com"
              , "To": user.email
              , "Subject": "Reset Your Password"
              , "HtmlBody": "http://localhost:1337/reset_password/" + encodeURIComponent(user.confirmation_code)
              , "TextBody": "http://localhost:1337/reset_password/" + encodeURIComponent(user.confirmation_code)
            }, function(error, success) {
              if(error) {
                  console.error("Unable to send via postmark: " + error.message);
                  // Need an error message here
                  res.redirect("/reset_password");
                  return;
              }
              res.redirect("/reset_password");
          });
        })
      });
    });
  }

  , reset_password: function (req, res) {
    User
      .findOne({
        confirmation_code: req.param("token")
        , status: User.statuses.password_reset
      })
      .done( function (err, user) {
        if (err) return res.send(null, 500);
        if (!user) return res.send(null, 500);

        res.view({
          user: user
          , layout: "no_user_layout"
        });
    });
  }

  , process_reset_password: function (req, res) {
    User
      .findOne(req.params.id)
      .done( function (err, user) {
        if (err) return res.send(null, 500);
        if (!user) return res.send(null, 500);

        user.confirmation_code = null;
        user.status = User.statuses.active;
        user.password = req.body.password;
        user.confirm_password = req.body.confirm_password;
        user.encrypted_pw = null;
        
        user.save( function (err) {
          if (err) return res.send(err, 500);
          req.logIn(user, function(err) {
            if (err) {
              res.redirect('/registration');
              return;
            }
            
            res.redirect('/');
            return;
          });
        });
    });
  }
};
