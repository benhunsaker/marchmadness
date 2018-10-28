'use strict';

const Pool = require('./model');


const internals = {};
internals.processErrors = ['Duplicated pool name', 'ValidationError'];
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
    description: 'Get all Pools',
    handler: (req, h) => {

        return Pool.find()
            .then((t) => t)
            .catch(internals.processError(req, h));
    }
};

const getOne = {
    description: 'Get a single pool',
    handler: (req, h) => {

        return Pool.findById(req.params.pool_id)
            .then((t) => t)
            .catch(internals.processError(req, h));
    }
};

const create = {
    description: 'Create a new pool',
    handler: (req, h) => {

        return Pool.checkNameAndSave(null, req.payload || {})
            .then((nt) => ({ message: 'Sucessfully created a new pool', data: nt }))
            .catch(internals.processError(req, h));
    }
};

const update = {
    description: 'Update a single pool',
    handler: (req, h) => {

        return Pool.checkNameAndSave(req.params.pool_id, req.payload)
            .then((nt) => ({ message: 'Sucessfully updated pool', data: nt }))
            .catch(internals.processError(req, h));
    }
};

const deletePool = {
    description: 'Delete a single pool',
    handler: (req, h) => {

        return Pool.findByIdAndDelete(req.params.pool_id)
            .then((t) => {

                return (t) ? { message: 'Sucessfully deleted the pool', data: t } : h.response({
                    error: 'Pool ID not found',
                    message: 'Pool not found for this id.'
                }).code(400);
            })
            .catch(internals.processError(req, h));
    }
};


module.exports = { getAll, getOne, create, update, deletePool };
