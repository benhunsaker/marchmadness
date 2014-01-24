// /**
//  * app.js
//  *
//  * This file contains some conventional defaults for working with Socket.io + Sails.
//  * It is designed to get you up and running fast, but is by no means anything special.
//  *
//  * Feel free to change none, some, or ALL of this file to fit your needs!
//  */


// (function (io) {

//   // as soon as this file is loaded, connect automatically, 
//   var socket = io.connect();
//   if (typeof console !== 'undefined') {
//     log('Connecting to Sails.js...');
//   }

//   socket.on('connect', function socketConnected() {

//     // Listen for Comet messages from Sails
//     socket.on('message', function messageReceived(message) {

//       ///////////////////////////////////////////////////////////
//       // Replace the following with your own custom logic
//       // to run when a new message arrives from the Sails.js
//       // server.
//       ///////////////////////////////////////////////////////////
//       log('New comet message received :: ', message);
//       //////////////////////////////////////////////////////

//     });


//     ///////////////////////////////////////////////////////////
//     // Here's where you'll want to add any custom logic for
//     // when the browser establishes its socket connection to 
//     // the Sails.js server.
//     ///////////////////////////////////////////////////////////
//     log(
//         'Socket is now connected and globally accessible as `socket`.\n' + 
//         'e.g. to send a GET request to Sails, try \n' + 
//         '`socket.get("/", function (response) ' +
//         '{ console.log(response); })`'
//     );
//     ///////////////////////////////////////////////////////////


//   });


//   // Expose connected `socket` instance globally so that it's easy
//   // to experiment with from the browser console while prototyping.
//   window.socket = socket;


//   // Simple log function to keep the example simple
//   function log () {
//     if (typeof console !== 'undefined') {
//       console.log.apply(console, arguments);
//     }
//   }
  

// })(

//   // In case you're wrapping socket.io to prevent pollution of the global namespace,
//   // you can replace `window.io` with your own `io` here:
//   window.io

// );

requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js'
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    , paths: {
        jquery: 'vendor/jquery.min'
        , json2: "vendor/json2"
        , underscore: "vendor/underscore"
        , backbone: "vendor/backbone"
        , "backbone.babysitter": "vendor/backbone.babysitter"
        , "backbone.wreqr": "vendor/backbone.wreqr"
        , marionette: "vendor/backbone.marionette"
        , bootstrap: "vendor/bootstrap"
        , handlebars: "vendor/handlebars-v1.1.1.2"
        , "require.text": "vendor/require.text"
        , model: 'models'
        , collection: 'collections'
        , view: 'view'
        , layout: 'layout'
    },

    shim: {
        underscore: {
            exports: "_"
        }
        , jquery: {
            exports: "$"
        }
        , backbone: {
            deps: ["jquery", "underscore", "json2"]
            , exports: "Backbone"
        }
        , marionette: {
            deps: ["backbone", "backbone.babysitter", "backbone.wreqr"]
            , exports: "Marionette"
        }
    }
});

require(["app"], function(){
  ContactManager.start();
});
