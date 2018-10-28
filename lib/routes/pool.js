'use strict';

const API = require('../handlers/pool');


const internals = {};
internals.path = '/api';


exports.plugin = {
    name: 'Pool API routes',
    version: '0.1.0',
    register: async (server, options) => {

        await server.route([
            { method: 'GET', path: `${internals.path}/pools`, config: API.getAll },
            { method: 'POST', path: `${internals.path}/pool`, config: API.create },
            { method: 'GET', path: `${internals.path}/pool/{pool_id}`, config: API.getOne },
            { method: 'PUT', path: `${internals.path}/pool/{pool_id}`, config: API.update },
            { method: 'DELETE', path: `${internals.path}/pool/{pool_id}`, config: API.deletePool }
        ]);
    }
};
