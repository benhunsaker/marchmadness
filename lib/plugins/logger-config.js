'use strict';


const internals = {};


exports.plugin = {
    name: 'Configure the logger',
    version: '0.1.0',
    register: async (server, options) => {

        await server.register({
            plugin: require('good'),
            options: {
                reporters: {
                    myConsoleReporter: [
                        {
                            module: 'good-squeeze',
                            name: 'Squeeze',
                            args: [{ log: '*', response: '*' }]
                        },
                        { module: 'good-console' },
                        'stdout'
                    ]
                }
            }
        });
    }
};
