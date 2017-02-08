import Relay from 'react-relay';

export default class CreateMessageMutation extends Relay.Mutation {

    getMutation() {

        return Relay.QL`mutation{createMessage}`;
    }

    getVariables() {

        return {
            text: this.props.text
        };
    }

    getFatQuery() {

        return Relay.QL`
            fragment on CreateMessagePayload {
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