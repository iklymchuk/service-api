const hapi = require('hapi');
const mongoose = require('mongoose');
const Status = require('./models/Status');
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');
const schema = require('./graphql/schema');

/* swagger section */
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');

const server = hapi.server({
    port: 4000,
    host: 'localhost'
});

//mongoose.connect('mongodb://test:test@localhost:27017/node');
mongoose.connect(process.argv[2]);

mongoose.connection.once('open', () => {
    console.log('db ok')
})

const init = async() => {

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: {
                info: {
                    title: 'Status API Documentation',
                    version: Pack.version
                }
            }
        }
    ]);

    await server.register({
        plugin: graphiqlHapi,
        options: {
            path: '/graphiql',
            graphiqlOptions: {
                endpointURL: '/graphql'
            },
            route: {
                cors: true
            }
        }
    });

    await server.register({
        plugin: graphqlHapi,
        options: {
            path: '/graphql',
            graphqlOptions: {
                schema
            },
            route: {
                cors: true
            }
        }
    });

    server.route([
        {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            return `<h1>API</h1>`;
        }
    },

    {
        method: 'GET',
        path: '/api/v1/status',
        config: {
            description: "Get All the status data",
            tags: ['api', 'v1', 'status']
        },
        handler: function (req, reply) {
            return Status.find();
        }
    },
    {
        method: 'POST',
        path: '/api/v1/status',
        config: {
            description: "Get a status by ID",
            tags: ['api', 'v1', 'status']
        },
        handler: function (req, reply) {
            const {name, ip, status} = req.payload;
            const stat = new Status({
                name,
                ip,
                status
            });

        return stat.save();
        }
    }
    ]);

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

init();