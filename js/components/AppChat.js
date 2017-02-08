import React from 'react';
import Relay from 'react-relay';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { blue200 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import CreateMessageMutation from '../mutations/CreateMessageMutation';
import UpdateMessageMutation from '../mutations/UpdateMessageMutation';
import RemoveMessageMutation from '../mutations/RemoveMessageMutation';

import Toolbar from 'material-ui/Toolbar';
import PtestChatHeader from './AppChat/header';
import PtestChatFooter from './AppChat/footer';
import PtestChatContent from './AppChat/content';

const muiTheme = getMuiTheme({
    palette: {
        accent2Color: blue200
    }
});

class AppChat extends React.Component {

    constructor(props) {

        super(props);

        this._user = {
            avatar: 'user'
        };

        this.state = {
            messages: [{
                text: 'Romanian president slams corruption bill',
                user: {
                    avatar: 'user'
                },
                date: new Date
            }, {
                text: 222,
                user: {
                    avatar: 'user'
                },
                date: new Date
            }]
        };

        this.onMessage = this.onMessage.bind(this);
        this.onMessageRemove = this.onMessageRemove.bind(this);
        this.onMessageUpdate = this.onMessageUpdate.bind(this);
    }

    render() {

        return (

            <MuiThemeProvider muiTheme={muiTheme}>

                <div className="s-chat">

                    <PtestChatHeader messagesCount={this.props.viewer.messages.length} />

                    <PtestChatContent
                        messages={this.props.viewer.messages}
                        onMessageRemove={ this.onMessageRemove }
                        onMessageUpdate={ this.onMessageUpdate }
                    />

                    <PtestChatFooter onMessage={ this.onMessage } />
                </div>
            </MuiThemeProvider>
        );
    }

    onMessage(text) {

        this.props.relay.commitUpdate(
            new CreateMessageMutation({
                text: text,
                viewer: this.props.viewer
            })
        );
    }

    onMessageRemove(index) {

        this.props.relay.commitUpdate(
            new RemoveMessageMutation({
                id: this.props.viewer.messages[index].id,
                viewer: this.props.viewer
            })
        );
    }

    onMessageUpdate(index, text) {

        this.props.relay.commitUpdate(
            new UpdateMessageMutation({
                id: this.props.viewer.messages[index].id,
                text: text,
                viewer: this.props.viewer
            })
        );
    }
};

export default Relay.createContainer(AppChat, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on User {
                messages {
                    id
                    text
                    date
                    user
                }
                ${CreateMessageMutation.getFragment('viewer')}
                ${UpdateMessageMutation.getFragment('viewer')}
                ${RemoveMessageMutation.getFragment('viewer')}
            }
        `
    }
});
