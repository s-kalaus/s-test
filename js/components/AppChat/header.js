import React from 'react';
import Toolbar from 'material-ui/Toolbar';

class PtestChatHeader extends React.Component {

    render() {

        return (

            <Toolbar className="s-header">{this.props.messagesCount} item{this.props.messagesCount === 1 ? '' : 's'}</Toolbar>
        );
    }
};

export default PtestChatHeader;