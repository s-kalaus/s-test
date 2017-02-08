import React from 'react';
import Toolbar from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';

class PtestChatFooter extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            message: ''
        };

        this.handleMessageChange = this.handleMessageChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {

        return (

            <Toolbar className="s-footer" style={{height: '48px', backgroundColor: '#fff'}}>

                <form onSubmit={this.handleSubmit}>

                    <TextField autoComplete="off" value={this.state.message} onChange={this.handleMessageChange} hintText="Enter your message..." className="s-input" />
                </form>
            </Toolbar>
        );
    }

    handleMessageChange(event) {

        this.setState({
            message: event.target.value
        });
    }

    handleSubmit(event) {

        event.preventDefault();

        this.props.onMessage(this.state.message);

        this.setState({
            message: ''
        });
    }
};

export default PtestChatFooter;