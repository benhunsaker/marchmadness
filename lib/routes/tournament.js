'use strict';

const API = require('../handlers/tournament');


const internals = {};
internals.path = '/api';


exports.plugin = {
    name: 'sample api routing',
    version: '0.1.0',
    register: async (server, options) => {

        await server.route([
            { method: 'GET', path: `${internals.path}/tournaments`, config: API.getAll },
            { method: 'POST', path: `${internals.path}/tournament`, config: API.create },
            { method: 'GET', path: `${internals.path}/tournament/{tourney_id}`, config: API.getOne },
            { method: 'PUT', path: `${internals.path}/tournament/{tourney_id}`, config: API.update },
            { method: 'DELETE', path: `${internals.path}/tournament/{tourney_id}`, config: API.deleteTourney }
        ]);
    }
};
