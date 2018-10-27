'use strict';


const internals = {};


const test = {
    description: 'returns test api response',
    handler: (request, h) => h.response({ message: 'This is a test.' })
};


module.exports = { test };
