const graphql = require('graphql');

const {GraphQLObjectType, GraphQLString} = graphql;

const StatusType = new GraphQLObjectType({
    name: 'Status',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        ip: { type: GraphQLString },
        status: { type: GraphQLString }
    })
});

module.exports = StatusType;