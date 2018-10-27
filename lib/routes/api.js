'use strict';

const API = require('../handlers/api');


const internals = {};
internals.path = '/api';


exports.plugin = {
    name: 'sample api routing',
    version: '0.1.0',
    register: async (server, options) => {

        await server.route([
            { method: 'GET', path: `${internals.path}`, config: API.test }
        ]);
    }
};
