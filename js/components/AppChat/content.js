import React from 'react';
import ReactDOM from 'react-dom';
import Toolbar from 'material-ui/Toolbar';
import TextField from 'material-ui/TextField';
import moment from 'moment';

class PtestChatContent extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            offsetTop: 0,
            messageEditIndex: null,
            messageEditText: ''
        };

        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.handleMessageEditTextChange = this.handleMessageEditTextChange.bind(this);
        this.handleEditKeyUp = this.handleEditKeyUp.bind(this);
    }

    componentDidMount() {

        this.updateScroll();
    }

    componentWillReceiveProps() {

        setTimeout(this.updateScroll.bind(this));
    }

    render() {

        const messages = this.props.messages.map((message, index) =>

            <div className="s-message" key={index}>

                {this.state.messageEditIndex === index &&

                    <div className="s-editing">

                        <form onSubmit={this.handleUpdate}>

                            <TextField onKeyUp={this.handleEditKeyUp} autoComplete="off" value={this.state.messageEditText} onChange={this.handleMessageEditTextChange} hintText="Enter your message..." />
                        </form>
                    </div>
                }

                {this.state.messageEditIndex !== index &&

                    <div>

                        <div className="s-avatar">

                            <i className={'fa fa-' + message.user}></i>
                        </div>

                        <div className="s-text">{message.text}</div>

                        <div className="s-date">{moment(message.date).format('D/M/YYYY H:mm')}</div>

                        {this.state.messageEditIndex === null &&

                            <div className="s-toolbar">

                                <a href="" onClick={(evt) => { this.handleEditClick(evt, index); }}><i className="fa fa-pencil"></i></a>

                                <a href="" onClick={(evt) => { this.handleRemoveClick(evt, index); }}><i className="fa fa-times"></i></a>
                            </div>
                        }
                    </div>
                }
            </div>
        );

        return (
            <div className="s-content" ref={(elem) => { this.content = elem; }}>

                <div className="s-messages" ref={(elem) => { this.scrollArea = elem; }} style={{marginTop: this.state.offsetTop}}>

                    {messages}
                </div>
            </div>
        );
    }

    handleEditKeyUp(event) {

        if (event.keyCode === 27) {
            this.handleCancel();
        }
    }

    handleCancel() {

        this.setState({
            messageEditText: '',
            messageEditIndex: null
        });
    }

    handleUpdate(event) {

        event.preventDefault();

        this.props.onMessageUpdate(this.state.messageEditIndex, this.state.messageEditText);

        this.handleCancel();
    }

    handleMessageEditTextChange(event) {

        this.setState({
            messageEditText: event.target.value
        });
    }

    handleEditClick(event, index) {

        event.preventDefault();

        this.setState({
            messageEditText: this.props.messages[index].text,
            messageEditIndex: index
        });
    }

    handleRemoveClick(event, index) {

        event.preventDefault();

        this.props.onMessageRemove(index);
    }

    updateScroll() {

        var offsetTop = this.content.offsetHeight - this.scrollArea.offsetHeight;

        if (offsetTop < 0) {
            offsetTop = 0;
        }

        this.setState({
            offsetTop: offsetTop
        });

        this.scrollArea.scrollTop = this.scrollArea.scrollHeight;
    }
};

export default PtestChatContent;