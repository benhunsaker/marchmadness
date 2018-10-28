'use strict';

const Tournament = require('./model');


const internals = {};
internals.processErrors = ['Duplicated year value', 'ValidationError'];
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
    description: 'Get all tournaments',
    handler: (req, h) => {

        return Tournament.find()
            .then((t) => t)
            .catch(internals.processError(req, h));
    }
};

const getOne = {
    description: 'Get a single tournament',
    handler: (req, h) => {

        return Tournament.findById(req.params.tourney_id)
            .then((t) => t)
            .catch(internals.processError(req, h));
    }
};

const create = {
    description: 'Create a new tournament',
    handler: (req, h) => {

        return Tournament.checkYearAndSave(null, req.payload || {})
            .then((nt) => ({ message: 'Sucessfully created the new tournament', data: nt }))
            .catch(internals.processError(req, h));
    }
};

const update = {
    description: 'Update a single tournament',
    handler: (req, h) => {

        return Tournament.checkYearAndSave(req.params.tourney_id, req.payload)
            .then((nt) => ({ message: 'Sucessfully updated tournament', data: nt }))
            .catch(internals.processError(req, h));
    }
};

const deleteTourney = {
    description: 'Delete a single tournament',
    handler: (req, h) => {

        return Tournament.findByIdAndDelete(req.params.tourney_id)
            .then((t) => {

                return (t) ? { message: 'Sucessfully deleted the tournament', data: t } : h.response({
                    error: 'Tournament ID not found',
                    message: 'Tournament not found for this id.'
                }).code(400);
            })
            .catch(internals.processError(req, h));
    }
};


module.exports = { getAll, getOne, create, update, deleteTourney };
