'use strict';

const Team = require('../models/team');


const internals = {};
internals.processErrors = ['Duplicated team name', 'ValidationError'];
internals.processError = (req, h) => {

    return (err) => {

        if (internals.processErrors.includes(err.name)) {
            req.server.log('info', err);
            return h.response(Object.assign({}, err)).code(400);
        }

        req.server.log('err', err);
        return h.response({
            error: 'Internal Server Error',
            message: 'An internal server error occurred'
        }).code(500);
    };
};


const getAll = {
    description: 'Get all Teams',
    handler: (req, h) => {

        return Team.find()
            .then((t) => t)
            .catch(internals.processError(req, h));
    }
};

const getOne = {
    description: 'Get a single team',
    handler: (req, h) => {

        return Team.findById(req.params.team_id)
            .then((t) => t)
            .catch(internals.processError(req, h));
    }
};

const create = {
    description: 'Create a new tournament',
    handler: (req, h) => {

        return Team.checkNameAndSave(null, req.payload || {})
            .then((nt) => ({ message: 'Sucessfully added a new team', data: nt }))
            .catch(internals.processError(req, h));
    }
};

const update = {
    description: 'Update a single team',
    handler: (req, h) => {

        return Team.checkNameAndSave(req.params.team_id, req.payload)
            .then((nt) => ({ message: 'Sucessfully updated team', data: nt }))
            .catch(internals.processError(req, h));
    }
};

const deleteTeam = {
    description: 'Delete a single team',
    handler: (req, h) => {

        return Team.findByIdAndDelete(req.params.team_id)
            .then((t) => {

                return (t) ? { message: 'Sucessfully deleted the team', data: t } : h.response({
                    error: 'Team ID not found',
                    message: 'Team not found for this id.'
                }).code(400);
            })
            .catch(internals.processError(req, h));
    }
};


module.exports = { getAll, getOne, create, update, deleteTeam };
