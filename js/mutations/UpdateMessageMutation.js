import Relay from 'react-relay';

export default class UpdateMessageMutation extends Relay.Mutation {

    getMutation() {

        return Relay.QL`mutation{updateMessage}`;
    }

    getVariables() {

        return {
            id: this.props.id,
            text: this.props.text,
        };
    }

    getFatQuery() {

        return Relay.QL`
            fragment on UpdateMessagePayload {
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