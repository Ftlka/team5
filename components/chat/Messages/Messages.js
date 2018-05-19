/* eslint-disable max-len */

import React from 'react';

import Message from './Message/Message.js';

import './styles.css';

export default class Messages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.saveElementForScroll = this.saveElementForScroll.bind(this);
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            messages: nextProps.messages,
            currentUser: nextProps.currentUser,
            onMessageTitleClick: nextProps.onMessageTitleClick
        };
    }

    componentDidMount() {
        this.scrollToBottom();
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    saveElementForScroll(el) {
        this.el = el;
    }

    scrollToBottom() {
        if (this.el) {
            this.el.scrollIntoView({ behavior: 'instant' });
        }
    }

    render() {
        return (
            <ol className='messages'>
                {this.props.messages.map((message, idx) => {

                    return (
                        <Message
                            key={idx}
                            currentUser={this.state.currentUser}
                            text={message.text}
                            type={message.type}
                            imageUrl={message.imageUrl}
                            author={message.author}
                            date={message.date}
                            reactions={message.reactions}
                            metadata={message.metadata}
                            onMessageTitleClick={this.state.onMessageTitleClick}
                            saveElementForScroll={this.saveElementForScroll}
                            id={message._id}
                            conversationId={this.props.conversationId}
                            socket={this.props.socket}
                        />
                    );
                }
                )}
            </ol>
        );
    }
}
