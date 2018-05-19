import React from 'react';

import ChatInput from './ChatInput/ChatInput.js';
import ParticipantsModal from './ParticipantsModal/ParticipantsModal.js';
import ProfileModal from '../ProfileModal/ProfileModal.js';
import Messages from './Messages/Messages.js';
import LoadingSpinner from '../LoadingSpinner';
import ErrorModal from '../errorModal';
import Dropzone from 'react-dropzone';
import io from 'socket.io-client';

import { getRecentEmoji } from '../../lib/apiRequests/emoji';
import './styles.css';
import { uploadImage as requestUploadImage } from '../../lib/apiRequests/images';

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
            loading: false,
            showErrorModal: false,
            dropzoneActive: false,
            title: ''
        };

        this.lastOpenedChat = null;

        getRecentEmoji()
            .then(res => res.data)
            .then(recentEmoji => this.setState({ recentEmoji }));

        this.socket = io();

        this.closeProfileModal = this.closeProfileModal.bind(this);
        this.openProfileModal = this.openProfileModal.bind(this);

        this.openParticipantsModal = this.openParticipantsModal.bind(this);
        this.closeParticipantsModal = this.closeParticipantsModal.bind(this);

        this.handleMessage = this.handleMessage.bind(this);
        this.handleUpdateMessage = this.handleUpdateMessage.bind(this);
        this.handleCloseErrorModal = this.handleCloseErrorModal.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    handleCloseErrorModal() {
        this.setState({ showErrorModal: false });
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

    resetStyles() {
        if (this.lastOpenedChat) {
            this.lastOpenedChat.style.backgroundColor = '#fff';
        }
    }

    selectDialog() {
        this.lastOpenedChat.style.backgroundColor = '#f9f9f9';
    }

    componentDidMount() {
        const id = this.props.messagesInfo.conversationId;
        this.lastOpenedChat = document.querySelector(`.conversation-${id}`); // eslint-disable-line
        this.selectDialog();
        this.socket.on(`message_${this.props.messagesInfo.conversationId}`,
            this.handleMessage);
    }

    componentWillUnmount() {
        this.resetStyles();
        this.socket.removeListener(`message_${this.props.messagesInfo.conversationId}`);
    }

    handleMessage(message) {
        const newMessages = this.state.messages.slice();
        newMessages.push(message);
        this.setState({
            messages: newMessages
        });
    }

    onDragEnter() {
        this.setState({
            dropzoneActive: true
        });
    }

    onDragLeave() {
        this.setState({
            dropzoneActive: false
        });
    }

    onDrop(files) {
        this.setState({
            files,
            dropzoneActive: false,
            loading: true
        });
        files.map(file=> this.uploadImage(file));
    }

    uploadImage(file) {
        requestUploadImage(file)
            .then(res => {
                if (res.data.error) {
                    this.setState({
                        loading: false,
                        showErrorModal: true,
                        error: `Error on file ${file.name}
                         ${res.data.error.message}`
                    });
                } else {
                    this.setState({ loading: false });
                    const message = {
                        type: 'image',
                        conversationId: this.props.messagesInfo.conversationId,
                        imageUrl: `/api/images/${res.data.imageId}`,
                        author: this.state.currentUser
                    };
                    this.socket.emit('message', message);
                }
            });
    }


    handleUpdateMessage(updatedMessage) {
        console.info(updatedMessage);
        const newMessages = this.state.messages.slice();
        const index = newMessages.findIndex(msg => msg._id === updatedMessage._id);
        if (index !== -1) {
            newMessages[index] = updatedMessage;
            this.setState({
                messages: newMessages
            });
        }
    }

    render() {
        const loading = this.state.loading;
        const { dropzoneActive } = this.state;
        const overlayStyle = {
            position: 'fixed',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 9999,
            padding: '23.5em 0',
            background: 'rgba(0,0,0,0.5)',
            textAlign: 'center',
            color: '#fff'
        };

        return (
            <Dropzone
                disableClick
                onDrop={this.onDrop}
                onDragEnter={this.onDragEnter}
                onDragLeave={this.onDragLeave}
                className='chat-container'
            >
                {dropzoneActive && <div style={overlayStyle}>Drop images...</div>}
                <ErrorModal
                    showModal={this.state.showErrorModal}
                    error={this.state.error}
                    handleCloseModal={this.handleCloseErrorModal}
                />

                {loading ? <LoadingSpinner /> : null}
                <ProfileModal
                    showModal={this.state.showProfileModal}
                    handleCloseModal={this.closeProfileModal}
                    username={this.state.profileUsername}
                    avatarUrl={this.state.profileAvatarUrl}
                />

                <div className='chat-container__controls'>
                    {!this.state.currentConversation.isPrivate &&
                    <img
                        src='../../../.././static/images/group.png' alt='group'/>}
                    <h2>{this.state.currentConversation.title}</h2>
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
                    currentConversation={this.state.currentConversation}
                />
                <Messages
                    messages={this.state.messages}
                    currentUser={this.state.currentUser}
                    onMessageTitleClick={this.openProfileModal}
                    conversationId={this.props.messagesInfo.conversationId}
                    socket={this.socket}
                />

                <ChatInput
                    conversationId={this.props.messagesInfo.conversationId}
                    socket={this.socket} currentUser={this.state.currentUser}
                    recentEmoji={this.state.recentEmoji}
                />
            </Dropzone>
        );
    }
}
