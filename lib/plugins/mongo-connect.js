'use strict';

const Mongoose = require('mongoose');

const internals = {};


exports.plugin = {
    name: 'Connect to MongoDB',
    version: '0.1.0',
    register: async (server, options) => {

        const mongoDbUri = 'mongodb://localhost:27017/hapi_db';

        await Mongoose.connection.on('connected', () => {

            server.log('info',`==> 🔐 App is connected to ${mongoDbUri}`);
        });
        Mongoose.connection.on('error', (err) => server.log('error while connecting to mongodb', err));

        //connect with mongoDB
        Mongoose.connect(mongoDbUri, { useNewUrlParser: true });
    }
};
