'use strict';

const Hapi = require('hapi');


const internals = {};

internals.plugins = [
    require('./plugins/logger-config'),
    require('./plugins/mongo-connect'),
    require('inert'),
    require('./routes/tournament'),
    require('./routes/team'),
    require('./routes/pool')
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
    server.log('info', `==> ✅ Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {

    if (err) throw new Error(err); //eslint-disable-line curly
    process.exit(1);
});

init();
