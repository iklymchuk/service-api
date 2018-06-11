const graphql = require('graphql');
const StatusType = require('./StatusType');
const Status = require('./../models/Status');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema
} = graphql;

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        status: {
            type: StatusType,
            args: {id: {type: GraphQLString}},
            resolve(parent, args) {
                return Status.findById(args.id)
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
});