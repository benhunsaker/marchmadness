'use strict';

const Hapi = require('hapi');
const Hoek = require('hoek');


const internals = {};

internals.plugins = [
    require('./plugins/logger-config'),
    require('inert'),
    require('./routes/api')
];


const init = async (port = 3000) => {

    const server = Hapi.server({
        port,
        state: { strictHeader: false }
    });

    await server.register(internals.plugins);

    server.route({
        method: 'GET',
        path: '/public/{param*}',
        handler: {
            directory: {
                path: './public',
                index: ['index.html', 'default.html', 'hello.html']
            }
        }
    });

    await server.start();
    server.log(`==> ✅ Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    Hoek.assert(!err, err);
    process.exit(1);
});

init();
