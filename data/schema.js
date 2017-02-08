'use strict';

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import {
  User,
  Message,
  getUser,
  getViewer,
  getMessage,
  getMessages,
  createMessage,
  updateMessage,
  removeMessage
} from './database';

var {nodeInterface, nodeField} = nodeDefinitions(
    (globalId) => {

        var {type, id} = fromGlobalId(globalId);

        if (type === 'User') {
            return getUser(id);
        } else if (type === 'Message') {
            return getMessage(id);
        } else {
            return null;
        }
    },
    (obj) => {

        if (obj instanceof User) {
            return userType;
        } else if (obj instanceof Message)  {
            return messageType;
        } else {
            return null;
        }
    }
);

var userType = new GraphQLObjectType({
    name: 'User',
    description: 'A person who uses our app',
    fields: () => ({
        id: globalIdField('User'),
        messages: {
            type: new GraphQLList(messageType),
            description: 'All messages',
            resolve: () => getMessages()
        }
    }),
    interfaces: [nodeInterface]
});

var messageType = new GraphQLObjectType({
    name: 'Message',
    description: 'A Message',

    fields: {
        id: globalIdField('Message'),
        text: {
            type: GraphQLString,
            description: 'Message Text'
        },
        user: {
            type: GraphQLString,
            description: 'Message User Avatar'
        },
        date: {
            type: GraphQLString,
            description: 'Message Date'
        }
    },
    interfaces: [ nodeInterface ]
});

var queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
          node: nodeField,
          viewer: {
              type: userType,
              resolve: () => getViewer()
          }
    })
});

const messageCreateMutation = mutationWithClientMutationId({
    name: 'CreateMessage',
    inputFields: {
        text: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    outputFields: {
        viewer: {
            type: userType,
            resolve: () => getViewer()
        }
    },
    mutateAndGetPayload: ({text}) => {

        createMessage(text);

        return {
            id: 1
        };
    }
});

const messageUpdateMutation = mutationWithClientMutationId({
    name: 'UpdateMessage',
    inputFields: {
        id: {
            type: new GraphQLNonNull(GraphQLID)
        },
        text: {
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    outputFields: {
        viewer: {
            type: userType,
            resolve: () => getViewer()
        }
    },
    mutateAndGetPayload: ({id, text}) => {

        updateMessage(id, text);

        return {
            id: 1
        };
    }
});

const messageRemoveMutation = mutationWithClientMutationId({
    name: 'RemoveMessage',
    inputFields: {
        id: {
            type: new GraphQLNonNull(GraphQLID)
        }
    },
    outputFields: {
        viewer: {
            type: userType,
            resolve: () => getViewer()
        }
    },
    mutateAndGetPayload: ({id}) => {

        removeMessage(id);

        return {
            id: 1
        };
    }
});

var mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        createMessage: messageCreateMutation,
        updateMessage: messageUpdateMutation,
        removeMessage: messageRemoveMutation
    })
});

export var Schema = new GraphQLSchema({
    query: queryType,
    mutation: mutationType
});
