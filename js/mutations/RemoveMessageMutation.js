import Relay from 'react-relay';

export default class RemoveMessageMutation extends Relay.Mutation {

    getMutation() {

        return Relay.QL`mutation{removeMessage}`;
    }

    getVariables() {

        return {
            id: this.props.id
        };
    }

    getFatQuery() {

        return Relay.QL`
            fragment on RemoveMessagePayload {
                viewer{
                    messages
                }
            }
        `;
    }

    getConfigs() {

        return [{
            type: 'FIELDS_CHANGE',
            fieldIDs: {
                viewer: this.props.viewer.id
            }
        }];
    }
    
    static fragments = {
        viewer: () => Relay.QL`
            fragment on User {
                id
            }
        `,
    };
}