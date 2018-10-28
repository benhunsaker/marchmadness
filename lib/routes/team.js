'use strict';

const API = require('../handlers/team');


const internals = {};
internals.path = '/api';


exports.plugin = {
    name: 'Team API routes',
    version: '0.1.0',
    register: async (server, options) => {

        await server.route([
            { method: 'GET', path: `${internals.path}/teams`, config: API.getAll },
            { method: 'POST', path: `${internals.path}/team`, config: API.create },
            { method: 'GET', path: `${internals.path}/team/{team_id}`, config: API.getOne },
            { method: 'PUT', path: `${internals.path}/team/{team_id}`, config: API.update },
            { method: 'DELETE', path: `${internals.path}/team/{team_id}`, config: API.deleteTeam }
        ]);
    }
};
