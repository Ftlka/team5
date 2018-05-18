import React from 'react';

import ChatInput from './ChatInput/ChatInput.js';
import AddPersonForm from './AddPersonForm/AddPersonForm.js';
import ParticipantsModal from './ParticipantsModal/ParticipantsModal.js';
import ProfileModal from '../ProfileModal/ProfileModal.js';
import Messages from './Messages/Messages.js';
import io from 'socket.io-client';
import Notification from 'react-web-notification';

import { getRecentEmoji } from '../../lib/apiRequests/emoji';
import './styles.css';

export default class Chat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showProfileModal: false,
            showParticipantsModal: false,
            messages: props.messagesInfo.messages,
            currentUser: props.messagesInfo.currentUser,
            currentConversation: props.messagesInfo.currentConversation,
            participantsVisible: false,
            ignore: true,
            disableActiveWindow: true,
            title: ''
        };

        getRecentEmoji()
            .then(res => res.data)
            .then(recentEmoji => this.setState({ recentEmoji }));

        this.socket = io();

        this.closeProfileModal = this.closeProfileModal.bind(this);
        this.openProfileModal = this.openProfileModal.bind(this);

        this.openParticipantsModal = this.openParticipantsModal.bind(this);
        this.closeParticipantsModal = this.closeParticipantsModal.bind(this);

        this.handleMessage = this.handleMessage.bind(this);
        this.handleNotification = this.handleNotification.bind(this);
        this.handleNotSupported = this.handleNotSupported.bind(this);
        this.handlePermissionGranted = this.handlePermissionGranted.bind(this);
        this.handlePermissionDenied = this.handlePermissionDenied.bind(this);
    }

    handlePermissionGranted() {
        this.setState({
            ignore: false
        });
    }
    handlePermissionDenied() {
        this.setState({
            ignore: true
        });
    }
    handleNotSupported() {
        this.setState({
            ignore: true
        });
    }

    closeProfileModal() {
        this.setState({ showProfileModal: false });
    }

    openProfileModal(username) {
        this.setState({
            showProfileModal: true,
            profileUsername: username,
            profileAvatarUrl: `/api/avatar/${username}`
        });
    }

    openParticipantsModal() {
        this.setState({ showParticipantsModal: true });
    }

    closeParticipantsModal() {
        this.setState({ showParticipantsModal: false });
    }


    componentDidMount() {
        this.socket.on(`message_${this.props.messagesInfo.conversationId}`,
            this.handleNotification);
    }

    componentWillUnmount() {
        this.socket.removeListener(`message_${this.props.messagesInfo.conversationId}`);
    }

    handleNotification(message) {
        if (this.state.currentUser === message.author) {
            return this.handleMessage(message);
        }

        const options = {
            tag: Date.now(),
            body: message.type === 'text'
                ? message.text
                : 'Image received',
            icon: '',
            dir: 'ltr'
        };
        this.setState({
            title: message.author,
            options: options
        });
        this.handleMessage(message);
    }

    handleMessage(message) {
        const newMessages = this.state.messages.slice();
        newMessages.push(message);
        this.setState({
            messages: newMessages
        });
    }

    render() {
        return (
            <section className='chat-container'>
                <Notification
                    ignore={this.state.ignore && this.state.title !== ''}
                    notSupported={this.handleNotSupported}
                    disableActiveWindow={this.state.disableActiveWindow}
                    onPermissionGranted={this.handlePermissionGranted}
                    onPermissionDenied={this.handlePermissionDenied}
                    title={this.state.title}
                    options={this.state.options}
                />
                <ProfileModal
                    showModal={this.state.showProfileModal}
                    handleCloseModal={this.closeProfileModal}
                    username={this.state.profileUsername}
                    avatarUrl={this.state.profileAvatarUrl}
                />

                <div className='chat-container__controls'>
                    {!this.state.currentConversation.isPrivate &&
                        <AddPersonForm
                            conversationId={this.props.messagesInfo.conversationId}
                        />}
                    <button
                        className='chat-container__show-participants-button'
                        onClick={this.openParticipantsModal}>
                        О&nbsp;беседе
                    </button>
                </div>

                <ParticipantsModal
                    showModal={this.state.showParticipantsModal}
                    handleCloseModal={this.closeParticipantsModal}
                    conversationId={this.props.messagesInfo.conversationId}
                />

                <Messages
                    messages={this.state.messages}
                    currentUser={this.state.currentUser}
                    onMessageTitleClick={this.openProfileModal}
                />

                <ChatInput
                    conversationId={this.props.messagesInfo.conversationId}
                    socket={this.socket} currentUser={this.state.currentUser}
                    recentEmoji={this.state.recentEmoji}
                />
            </section>
        );
    }
}
